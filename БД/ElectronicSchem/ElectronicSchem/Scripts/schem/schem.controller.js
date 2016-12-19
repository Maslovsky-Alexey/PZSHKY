/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-sanitize.d.ts" />
/// <reference path="../typings/konva/konva.d.ts" />
var appSchem = angular.module('schemApp', ["ngSanitize"]);
appSchem.controller('schemController', function ($scope) {
    var listComponents = Components.loadComponents();
    var canvas;
    var propertiesContainer;
    var backLayer;
    var frontLayer;
    var selectRect;
    var activeComponent;
    var wireMode = false;
    var isRemovigMode = false;
    var isEditMode = false;
    var mouseDowned = false;
    var canvasContainer;
    $scope.sizeCell = 25;
    $scope.countRows = 200;
    $scope.countColumns = 200;
    $scope.resultComponents = listComponents;
    $scope.componentsModel = new Dictionary();
    $scope.countLike;
    $scope.countDislike;
    $scope.initial = function (idContainer, idPropertiesContainer, editMode, postId, tags, commentContainerId) {
        canvasContainer = $('#' + idContainer);
        loadSchem(postId, tags, editMode, commentContainerId);
        propertiesContainer = document.getElementById(idPropertiesContainer);
        initializeCanvas(idContainer);
        showSchemProperties();
        $scope.redraw(konvaLinesToWiresModel());
        if (!isEditMode)
            $(window).scroll(function () {
                if ($(window).scrollTop() + $(window).height() == $(document).height()) {
                    $scope.loadComment(postId, commentContainerId);
                }
            });
    };
    $scope.loadSchem = function (postId, tags) {
        $.ajax({
            url: "/Posts/GetSchem",
            data: { id: postId },
            type: "post",
            success: function (data) { return onLoadSchem(data, tags); }
        });
    };
    $scope.loadComment = function (postId, commentContainerId) {
        $.ajax({
            url: '/Posts/GetComments',
            data: {
                postId: postId,
                beginIndex: schem.currentCommentCount,
                count: 10
            },
            type: 'post',
            success: function (data) { return onLoadComments(data, commentContainerId); }
        });
    };
    $scope.find = function (pattern) {
        $scope.resultComponents = [];
        for (var i = 0; i < listComponents.length; i++)
            if (listComponents[i].name.toLowerCase().indexOf(pattern.toLowerCase()) >= 0)
                $scope.resultComponents.push(listComponents[i]);
    };
    $scope.addComponent = function (component, isLoaded) {
        wireMode = false;
        if (!isLoaded) {
            component.positionx = 1 + Math.floor(canvasContainer.scrollLeft() / $scope.sizeCell + 1);
            component.positiony = 1 + Math.floor(canvasContainer.scrollTop() / $scope.sizeCell + 1);
        }
        helpers.getComponentToKonvaElementAsync(component, $scope.sizeCell, function (result) {
            setEventsForKonvaNode(result);
            result.group.draggable(isEditMode);
            frontLayer.add(result.group);
            canvas.draw();
            result.group.id($scope.componentsModel.length());
            $scope.componentsModel.add(result.group.id(), helpers.clone(component));
        });
    };
    $scope.redraw = function (wires) {
        canvas.width($scope.sizeCell * $scope.countColumns);
        canvas.height($scope.sizeCell * $scope.countRows);
        frontLayer.destroyChildren();
        backLayer.destroyChildren();
        drawCells();
        drawComponents();
        drawWires(wires);
    };
    $scope.savePost = function (title, disc, tags, idPost, categoryConainerId) {
        var post = postToJson(title, disc, tags, categoryConainerId);
        $.ajax({
            url: "/Posts/SavePost",
            data: { post: post, postId: idPost, category: $(categoryConainerId).val() },
            method: 'post',
            success: function (postId) {
                window.location.href = "/Posts?id=" + postId;
            }
        });
    };
    $scope.newPost = function (title, disc, tags, categoryConainerId) {
        var post = postToJson(title, disc, tags, categoryConainerId);
        $.ajax({
            url: "/Posts/CreatePost",
            data: { post: post, category: $(categoryConainerId).val() },
            method: 'post',
            success: function (postId) {
                window.location.href = "/Posts?id=" + postId;
            }
        });
    };
    $scope.addTag = function (listId) {
        var e = event;
        if (e.keyCode == 13) {
            addTagToContainer($(event.target).val(), listId);
            $(event.target).val('');
        }
    };
    $scope.autoTag = function (containerId) {
        helpers.autoTagsCompile($(event.target).val(), containerId, $(event.target));
    };
    $scope.like = function (postId) {
        $.ajax({
            url: "Posts/LikePost",
            data: { postId: postId },
            type: 'post',
            success: function (result) {
                $scope.countLike = result;
                $scope.$apply();
            }
        });
    };
    $scope.hideListTags = function () {
        $('#list-tags-compile').html('');
    };
    $scope.dislike = function (postId) {
        $.ajax({
            url: "Posts/DislikePost",
            data: { postId: postId },
            type: 'post',
            success: function (result) {
                $scope.countDislike = result;
                $scope.$apply();
            }
        });
    };
    function addTagToContainer(value, listId) {
        var container = $(listId);
        if (!helpers.isDuplicateTag(value, helpers.getListTags(listId)) && !schem.isEmptyText(value))
            container.append(helpers.getTag(value, isEditMode));
    }
    function loadSchem(postId, tags, editMode, commentContainerId) {
        $scope.loadSchem(postId, tags);
        isEditMode = editMode.toLowerCase() == 'true';
        if (!isEditMode) {
            $scope.loadComment(postId, commentContainerId);
            updateLikes(postId, commentContainerId);
        }
    }
    function updateLikes(postId, commentContainerId) {
        getLikesPost(postId);
        getDislikesPost(postId);
        var comments = $('.post-comment');
        comments.each(function (index, elem) {
            var commentId = $(elem).find('.comment-likes').attr('id');
            schem.getLikesComment(commentId);
            schem.getDislikesComment(commentId);
        });
        setTimeout(updateLikes, 5000, postId);
    }
    function getLikesPost(postId) {
        $.ajax({
            url: "Posts/GetLikesPost",
            data: { postId: postId },
            type: 'post',
            success: function (result) {
                $scope.countLike = result;
                $scope.$apply();
            }
        });
    }
    function getDislikesPost(postId) {
        $.ajax({
            url: "Posts/GetDislikesPost",
            data: { postId: postId },
            type: 'post',
            success: function (result) {
                $scope.countDislike = result;
                $scope.$apply();
            }
        });
    }
    function initializeCanvas(idContainer) {
        canvas = generateCanvas(idContainer);
        addEventClickToCanvas();
        addWindowEvents();
        backLayer = new Konva.Layer();
        frontLayer = new Konva.Layer();
        canvas.add(backLayer);
        canvas.add(frontLayer);
    }
    function addWindowEvents() {
        window.onclick = function (e) {
            if ($(e.target).hasClass('auto-list-item'))
                return;
            $scope.hideListTags();
        };
    }
    function onLoadSchem(data, tags) {
        var obj = JSON.parse(data);
        var components = obj.components;
        var wires = obj.wires;
        var tagList = obj.tags;
        var res = tagListToString(tagList);
        components.forEach(function (item, index, array) { return $scope.componentsModel.add(index, item); });
        tagList.forEach(function (tag, index, array) { return addTagToContainer(tag.value, tags); });
        $scope.redraw(wires);
    }
    function tagListToString(tagList) {
        var res = '';
        tagList.forEach(function (tag, index, array) {
            return res += tag.value + (index < array.length - 1 ? ',' : '');
        });
        return res;
    }
    function onLoadComments(data, commentContainerId) {
        var comments = JSON.parse(data);
        schem.currentCommentCount += comments.length;
        comments.forEach(function (item, index, array) { return schem.postCommentToEnd(commentContainerId, item.text, item.user, item.date, item.id, item.userId); });
    }
    function generateCanvas(idContainer) {
        var konva = new Konva.Stage({
            container: idContainer,
            width: $scope.sizeCell * $scope.countColumns,
            height: $scope.sizeCell * $scope.countRows
        });
        document.onmousedown = function () { return mouseDowned = true; };
        document.onmouseup = function () { return mouseDowned = false; };
        return konva;
    }
    function drawCells() {
        for (var i = $scope.sizeCell; i < canvas.getWidth(); i += $scope.sizeCell)
            backLayer.add(helpers.getLine(i, 0, i, canvas.getHeight(), 'gray'));
        for (var i = $scope.sizeCell; i < canvas.getHeight(); i += $scope.sizeCell)
            backLayer.add(helpers.getLine(0, i, canvas.getWidth(), i, 'gray'));
        canvas.draw();
    }
    ;
    function drawComponents() {
        frontLayer.find('Group').each(function (el) { return el.remove(); });
        var models = $scope.componentsModel.getValues();
        $scope.componentsModel = new Dictionary();
        models.forEach(function (item, index, array) { return $scope.addComponent(item, true); });
    }
    function drawWires(wireList) {
        wireList.forEach(function (wire, index, array) { return frontLayer.add(addRemoveEventsOnLine(helpers.getLine(wire.x1 * $scope.sizeCell, wire.y1 * $scope.sizeCell, wire.x2 * $scope.sizeCell, wire.y2 * $scope.sizeCell, 'black'))); });
        frontLayer.draw();
    }
    function setEventsForKonvaNode(component) {
        component.group.on('click', function () {
            return showProperties($scope.componentsModel[component.group.id()], component.group);
        });
        component.group.on('mouseup', function () {
            alignAllComponents();
            setModelPosition(component);
        });
        component.group.on('dragstart', function () { return showSchemProperties(); });
        component.group.on('dragmove', function () { return setModelPosition(component); });
    }
    function setModelPosition(component) {
        $scope.componentsModel[component.group.id()].positionx = Math.floor(component.group.x() / $scope.sizeCell);
        $scope.componentsModel[component.group.id()].positiony = Math.floor(component.group.y() / $scope.sizeCell);
    }
    function alignAllComponents() {
        frontLayer.find('Group').each(function (item) { return alignObj(item); });
        canvas.draw();
    }
    function lineAdded(pointStart, pointEnd, line) {
        addEventClickToCanvas();
        addRemoveEventsOnLine(line);
    }
    function addRemoveEventsOnLine(line) {
        return line.on('mouseover', function () {
            if (isRemovigMode && mouseDowned) {
                line.remove();
                frontLayer.draw();
            }
        });
    }
    function addEventClickToCanvas() {
        canvas.on('contentClick', function () {
            if (wireMode)
                schem.wiresUpdater.updateWire(canvas, frontLayer, $scope.sizeCell, lineAdded);
            var p = canvas.getPointerPosition();
            var countElement = frontLayer.getChildren(function (child) {
                return (p.x >= child.x() && p.x <= child.x() + child.width() && p.y >= child.y() && p.y <= child.y() + child.height());
            }).length;
            if (countElement == 0)
                showSchemProperties();
        });
    }
    function focusComponent(group) {
        unfocusComponent();
        activeComponent = group;
        var x = group.x() - group.offsetX();
        var y = group.y() - group.offsetY();
        selectRect = helpers.getRect(x, y, group.width(), group.height(), 'green');
        frontLayer.add(selectRect);
        selectRect.setZIndex(-999999);
        frontLayer.draw();
    }
    function alignObj(obj) {
        var resultPoint = schem.wiresUpdater.alignPoint(new schem.Point(obj.x() + obj.offsetX(), obj.y() + obj.offsetY()), $scope.sizeCell);
        obj.x(resultPoint.x - obj.offsetX());
        obj.y(resultPoint.y - obj.offsetY());
    }
    function showSchemProperties() {
        unfocusComponent();
        propertiesContainer.innerHTML = "";
        if (isEditMode) {
            propertiesContainer.appendChild(helpers.getI('fa fa-pencil schem-properties-button', function () { return wireMode = !wireMode; }));
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
    function showProperties(component, group) {
        focusComponent(group);
        propertiesContainer.innerHTML = "";
        component.properties.forEach(function (prop, index, array) {
            var propertyElement = (schem.propertyModelToHtmlElement(prop, isEditMode));
            if (propertyElement != null)
                propertiesContainer.appendChild(propertyElement);
        });
        if (isEditMode) {
            propertiesContainer.appendChild(helpers.getI("fa fa-trash schem-propeties-trash", function () { return removeElement(group); }));
            propertiesContainer.appendChild(helpers.getI("fa fa-undo", function () { return rotateLeft90(group); }));
            propertiesContainer.appendChild(helpers.getI("fa fa-repeat", function () { return rotateRight90(group); }));
        }
    }
    function rotateRight90(group) {
        group.rotate(90);
        $scope.componentsModel[group.id()].rotation = group.rotation();
        frontLayer.draw();
    }
    function rotateLeft90(group) {
        group.rotate(-90);
        $scope.componentsModel[group.id()].rotation = group.rotation();
        frontLayer.draw();
    }
    function removeElement(group) {
        $scope.componentsModel.remove(group.id());
        unfocusComponent();
        $scope.redraw(konvaLinesToWiresModel());
    }
    function zoomPlus() {
        if ($scope.sizeCell == 50)
            return;
        var wires = konvaLinesToWiresModel();
        $scope.sizeCell += 5;
        $scope.redraw(wires);
    }
    function zoomMinus() {
        if ($scope.sizeCell == 15)
            return;
        var wires = konvaLinesToWiresModel();
        $scope.sizeCell -= 5;
        $scope.redraw(wires);
    }
    function unfocusComponent() {
        if (selectRect) {
            activeComponent = null;
            selectRect.remove();
            selectRect = null;
        }
    }
    function postToJson(title, disc, tags, categoryConainerId) {
        return JSON.stringify({
            components: $scope.componentsModel.getValues(),
            wires: konvaLinesToWiresModel(),
            title: $(title).val(),
            discription: $(disc).val(),
            tags: helpers.getListTags(tags)
        });
    }
    function konvaLinesToWiresModel() {
        var wires = new Array();
        frontLayer.find('Line').each(function (line) {
            var points = helpers.getLinePoints(line);
            points.forEach(function (p, index, array) { return positionToIndexes(p); });
            wires.push(new schem.WireModel(points[0], points[1]));
        });
        return wires;
    }
    function positionToIndexes(point) {
        point.x = Math.floor(point.x / $scope.sizeCell);
        point.y = Math.floor(point.y / $scope.sizeCell);
    }
});
//# sourceMappingURL=schem.controller.js.map