/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-sanitize.d.ts" />
/// <reference path="../typings/konva/konva.d.ts" />

var appSchem = angular.module('schemApp', ["ngSanitize"]);

appSchem.controller('schemController', ($scope) => {
    var listComponents = Components.loadComponents();

    var canvas: Konva.Stage;

    var propertiesContainer: Element;

    var backLayer: Konva.Layer;
    var frontLayer: Konva.Layer;

    var selectRect: Konva.Rect;
    var activeComponent: Konva.Group;

    var wireMode = false;
    var isRemovigMode = false;

    var isEditMode = false;
    var mouseDowned = false;

    var canvasContainer: JQuery;

    $scope.sizeCell = 25;
    $scope.countRows = 200;
    $scope.countColumns = 200;
    $scope.resultComponents = listComponents;
    $scope.componentsModel = new Dictionary();
    $scope.countLike;
    $scope.countDislike;

    $scope.initial = (idContainer: string, idPropertiesContainer: string, editMode: string, postId: any, tags: string, commentContainerId: string) => {
        canvasContainer = $('#' + idContainer);

        loadSchem(postId, tags, editMode, commentContainerId);

        propertiesContainer = document.getElementById(idPropertiesContainer);

        initializeCanvas(idContainer);

        showSchemProperties();
        $scope.redraw(konvaLinesToWiresModel());

        if (!isEditMode)
            $(window).scroll(() => {
                if ($(window).scrollTop() + $(window).height() == $(document).height()) {
                    $scope.loadComment(postId, commentContainerId);
                }
            });
    };

    $scope.loadSchem = (postId: number, tags: string) => {
        $.ajax({
            url: "/Posts/GetSchem",
            data: { id: postId },
            type: "post",
            success: (data) => onLoadSchem(data, tags)
        });
    }

    $scope.loadComment = (postId: number, commentContainerId: string) => {
        $.ajax({
            url: '/Posts/GetComments',
            data: {
                postId: postId,
                beginIndex: schem.currentCommentCount,
                count: 10
            },
            type: 'post',
            success: (data) => onLoadComments(data, commentContainerId)
        });
    }

    $scope.find = (pattern: string) => {
        $scope.resultComponents = [];
        
        for (var i = 0; i < listComponents.length; i++)
            if (listComponents[i].name.toLowerCase().indexOf(pattern.toLowerCase()) >= 0)
                $scope.resultComponents.push(listComponents[i]);
    }

    $scope.addComponent = (component: Components.Component, isLoaded: boolean) => {
        wireMode = false;

        if (!isLoaded) {
            component.positionx = 1 + Math.floor(canvasContainer.scrollLeft() / $scope.sizeCell + 1);
            component.positiony = 1 + Math.floor(canvasContainer.scrollTop() / $scope.sizeCell + 1);
        }
          

        helpers.getComponentToKonvaElementAsync(component, $scope.sizeCell, (result: helpers.KonvaComponentGroup) => {
            setEventsForKonvaNode(result);

            result.group.draggable(isEditMode);

            frontLayer.add(result.group);
            canvas.draw();

            result.group.id($scope.componentsModel.length());

            $scope.componentsModel.add(result.group.id(), helpers.clone(component));
        });
    }

    $scope.redraw = (wires: schem.WireModel[]) => {
        canvas.width($scope.sizeCell * $scope.countColumns);
        canvas.height($scope.sizeCell * $scope.countRows);

        frontLayer.destroyChildren();
        backLayer.destroyChildren();

        drawCells();
        drawComponents();
        drawWires(wires);
    }

    $scope.savePost = (title: string, disc: string, tags: string, idPost: number, categoryConainerId: string) => {
        var post = postToJson(title, disc, tags, categoryConainerId);

        $.ajax({
            url: "/Posts/SavePost",
            data: { post: post, postId: idPost, category: $(categoryConainerId).val() },
            method: 'post',
            success: (postId: number) => {
                window.location.href = "/Posts?id=" + postId;
            }
        });
    }

    $scope.newPost = (title: string, disc: string, tags: string, categoryConainerId: string) => {
        var post = postToJson(title, disc, tags, categoryConainerId);

        $.ajax({
            url: "/Posts/CreatePost",
            data: { post: post, category: $(categoryConainerId).val() },
            method: 'post',
            success: (postId: number) => {
                window.location.href = "/Posts?id=" + postId;
            }
        });
    }

    $scope.addTag = (listId: string) => {       
        var e = <KeyboardEvent>event;

        if (e.keyCode == 13) {
            addTagToContainer($(event.target).val(), listId);
            $(event.target).val('');
        }
    }

    $scope.autoTag = (containerId: string) => {
        helpers.autoTagsCompile($(event.target).val(), containerId, $(event.target));
    }

    $scope.like = (postId: number) => {
        $.ajax({
            url: "Posts/LikePost",
            data: { postId: postId },
            type: 'post',
            success: (result: number) => {
                $scope.countLike = result;
                $scope.$apply();
            }
        });
    }

    $scope.hideListTags = () => {
        $('#list-tags-compile').html('');
    };

    $scope.dislike = (postId: number) => {
        
        $.ajax({
            url: "Posts/DislikePost",
            data: { postId: postId },
            type: 'post',
            success: (result: number) => {
                $scope.countDislike = result;
                $scope.$apply();
            }
        });
    }


    function addTagToContainer(value: string, listId: string) {
        var container = $(listId);

        if (!helpers.isDuplicateTag(value, helpers.getListTags(listId)) && !schem.isEmptyText(value))
            container.append(helpers.getTag(value, isEditMode));
    }

    function loadSchem(postId: any, tags: string, editMode: string, commentContainerId: string) {
        $scope.loadSchem(postId, tags);

        isEditMode = editMode.toLowerCase() == 'true';

        if (!isEditMode) {
            $scope.loadComment(postId, commentContainerId);
            updateLikes(postId, commentContainerId);
        }        
    }

    function updateLikes(postId: any, commentContainerId: string) {
        getLikesPost(postId);
        getDislikesPost(postId);

        var comments = $('.post-comment');

        comments.each((index, elem) => {
            var commentId = $(elem).find('.comment-likes').attr('id');

            schem.getLikesComment(commentId);
            schem.getDislikesComment(commentId);
        });

        setTimeout(updateLikes, 5000, postId);
    }

    function getLikesPost(postId: any) {
        $.ajax({
            url: "Posts/GetLikesPost",
            data: { postId: postId },
            type: 'post',
            success: (result: number) => {
                $scope.countLike = result;
                $scope.$apply();
            }
        });
    }

    function getDislikesPost(postId: any) {
        $.ajax({
            url: "Posts/GetDislikesPost",
            data: { postId: postId },
            type: 'post',
            success: (result: number) => {
                $scope.countDislike = result;
                $scope.$apply();
            }
        });
    }

    function initializeCanvas(idContainer: string) {
        canvas = generateCanvas(idContainer);
        addEventClickToCanvas();
        addWindowEvents();

        backLayer = new Konva.Layer();
        frontLayer = new Konva.Layer();

        canvas.add(backLayer);
        canvas.add(frontLayer);
    }

    function addWindowEvents() {
        window.onclick = (e) => {
            if ($(e.target).hasClass('auto-list-item'))
                return;

            $scope.hideListTags();
        };
    }

    function onLoadSchem(data: string, tags: string) {

        var obj = JSON.parse(data);

        var components: Components.Component[] = obj.components;
        var wires: schem.WireModel[] = obj.wires;
        var tagList: schem.TagModel[] = obj.tags;

        var res = tagListToString(tagList);

        components.forEach((item, index, array) => $scope.componentsModel.add(index, item));

        tagList.forEach((tag, index, array) => addTagToContainer(tag.value, tags));

        $scope.redraw(wires);
    }

    function tagListToString(tagList: schem.TagModel[]): string {
        var res = '';

        tagList.forEach((tag, index, array) =>
            res += tag.value + (index < array.length - 1 ? ',' : ''));

        return res;
    }

    function onLoadComments(data: string, commentContainerId: string) {
        var comments = JSON.parse(data);

        schem.currentCommentCount += comments.length;

        comments.forEach((item, index, array) => schem.postCommentToEnd(commentContainerId, item.text, item.user, item.date, item.id, item.userId));
    }


    function generateCanvas(idContainer: string): Konva.Stage {
        var konva = new Konva.Stage({
            container: idContainer,
            width: $scope.sizeCell * $scope.countColumns,
            height: $scope.sizeCell * $scope.countRows
        });

        document.onmousedown = () => mouseDowned = true;
        document.onmouseup = () => mouseDowned = false;

        return konva;
    }

    function drawCells(): void {
        for (var i = $scope.sizeCell; i < canvas.getWidth(); i += $scope.sizeCell)
            backLayer.add(helpers.getLine(i, 0, i, canvas.getHeight(), 'gray'));

        for (var i = $scope.sizeCell; i < canvas.getHeight(); i += $scope.sizeCell)
            backLayer.add(helpers.getLine(0, i, canvas.getWidth(), i, 'gray'));

        canvas.draw();
    };

    function drawComponents(): void {
        frontLayer.find('Group').each((el) => el.remove());

        var models: Array<Components.Component> = $scope.componentsModel.getValues();

        $scope.componentsModel = new Dictionary();

        models.forEach((item, index, array) => $scope.addComponent(item, true));
    }

    function drawWires(wireList: schem.WireModel[]): void {
        wireList.forEach((wire, index, array) => frontLayer.add(addRemoveEventsOnLine(helpers.getLine(
            wire.x1 * $scope.sizeCell, wire.y1 * $scope.sizeCell,
            wire.x2 * $scope.sizeCell, wire.y2 * $scope.sizeCell, 'black'))));

        frontLayer.draw();
    }

    function setEventsForKonvaNode(component: helpers.KonvaComponentGroup): void {
        component.group.on('click', () => 
            showProperties($scope.componentsModel[component.group.id()], component.group));

        component.group.on('mouseup', () => {
            alignAllComponents();
            setModelPosition(component);
        });

        component.group.on('dragstart', () => showSchemProperties());

        component.group.on('dragmove', () => setModelPosition(component));     
    }

    function setModelPosition(component: helpers.KonvaComponentGroup): void{
        $scope.componentsModel[component.group.id()].positionx = Math.floor(component.group.x() / $scope.sizeCell);
        $scope.componentsModel[component.group.id()].positiony = Math.floor(component.group.y() / $scope.sizeCell);
    }

    function alignAllComponents(): void {
        frontLayer.find('Group').each((item) => alignObj(item));
        canvas.draw();
    }

    function lineAdded(pointStart: schem.Point, pointEnd: schem.Point, line: Konva.Line): void {
        addEventClickToCanvas();

        addRemoveEventsOnLine(line);
    }

    function addRemoveEventsOnLine(line: Konva.Line): Konva.Line {
        return <Konva.Line>line.on('mouseover', () => {
            if (isRemovigMode && mouseDowned) {
                line.remove();
                frontLayer.draw();
            }
        });
    }

    function addEventClickToCanvas(): void {
        canvas.on('contentClick', () => {
            if (wireMode)
                schem.wiresUpdater.updateWire(canvas, frontLayer, $scope.sizeCell, lineAdded);

            var p = canvas.getPointerPosition();

            var countElement = frontLayer.getChildren((child: Konva.Node) => {
                return (p.x >= child.x() && p.x <= child.x() + child.width() && p.y >= child.y() && p.y <= child.y() + child.height());
            }).length;

            if (countElement == 0)
                showSchemProperties();
        });
    }

    function focusComponent(group: Konva.Group): void {
        unfocusComponent();
        activeComponent = group;

        var x = group.x() - group.offsetX();
        var y = group.y() - group.offsetY();

        selectRect = helpers.getRect(x, y, group.width(), group.height(), 'green');
        frontLayer.add(selectRect);
        selectRect.setZIndex(-999999);

        frontLayer.draw();
    }


    function alignObj(obj: Konva.Node): void {
        var resultPoint = schem.wiresUpdater.alignPoint(new schem.Point(obj.x() + obj.offsetX(), obj.y() + obj.offsetY()), $scope.sizeCell);

        obj.x(resultPoint.x - obj.offsetX());
        obj.y(resultPoint.y - obj.offsetY());
    }

    function showSchemProperties(): void {
        unfocusComponent();

        propertiesContainer.innerHTML = "";

        if (isEditMode) {
            propertiesContainer.appendChild(helpers.getI('fa fa-pencil schem-properties-button', () => wireMode = !wireMode));
            propertiesContainer.appendChild(helpers.getI("fa fa-eraser schem-properties-button", onModeWash));
        }

        propertiesContainer.appendChild(helpers.getI("fa fa-search-plus schem-properties-button", zoomPlus));
        propertiesContainer.appendChild(helpers.getI("fa fa-search-minus schem-properties-button", zoomMinus));     
        propertiesContainer.appendChild(helpers.getI("fa fa-th schem-properties-button", gridOnOff));
    }

    function gridOnOff() {
        backLayer.visible(!backLayer.visible());

        canvas.draw();
    }

    function onModeWash() {
        wireMode = false;
        isRemovigMode = true;
    }

    function showProperties(component: Components.Component, group: Konva.Group): void {
        focusComponent(group);

        propertiesContainer.innerHTML = "";

        component.properties.forEach((prop, index, array) => {
            var propertyElement = (schem.propertyModelToHtmlElement(prop, isEditMode));

            if (propertyElement != null)
                propertiesContainer.appendChild(propertyElement);
        });

        if (isEditMode) {
            propertiesContainer.appendChild(helpers.getI("fa fa-trash schem-propeties-trash", () => removeElement(group)));
            propertiesContainer.appendChild(helpers.getI("fa fa-undo", () => rotateLeft90(group)));
            propertiesContainer.appendChild(helpers.getI("fa fa-repeat", () => rotateRight90(group)));
        }
    }

    function rotateRight90(group: Konva.Group) {
        group.rotate(90);
        $scope.componentsModel[group.id()].rotation = group.rotation();
        frontLayer.draw();
    }

    function rotateLeft90(group: Konva.Group) {
        group.rotate(-90);
        $scope.componentsModel[group.id()].rotation = group.rotation();
        frontLayer.draw();
    }

    function removeElement(group: Konva.Group) {       
        $scope.componentsModel.remove(group.id());
        unfocusComponent();
        $scope.redraw(konvaLinesToWiresModel());       
    }

    function zoomPlus(): void {
        if ($scope.sizeCell == 50)
            return;

        var wires = konvaLinesToWiresModel();
        $scope.sizeCell += 5;
        $scope.redraw(wires);
    }

    function zoomMinus(): void {
        if ($scope.sizeCell == 15)
            return;

        var wires = konvaLinesToWiresModel();
        $scope.sizeCell -= 5;
        $scope.redraw(wires);
    }

    function unfocusComponent(): void {
        if (selectRect) {
            activeComponent = null;
            selectRect.remove();
            selectRect = null;
        }       
    }

    function postToJson(title: string, disc: string, tags: string, categoryConainerId: string) {
        return JSON.stringify({
            components: $scope.componentsModel.getValues(),
            wires: konvaLinesToWiresModel(),
            title: $(title).val(),
            discription: $(disc).val(),
            tags: helpers.getListTags(tags)
        });
    }

    function konvaLinesToWiresModel() {
        var wires = new Array<schem.WireModel>();

        frontLayer.find('Line').each((line: Konva.Line) => {
            var points = helpers.getLinePoints(line);

            points.forEach((p, index, array) => positionToIndexes(p));
            
            wires.push(new schem.WireModel(points[0], points[1]));
        });

        return wires;
    }

    function positionToIndexes(point: schem.Point): void {
        point.x = Math.floor(point.x / $scope.sizeCell);
        point.y = Math.floor(point.y / $scope.sizeCell);
    }

});