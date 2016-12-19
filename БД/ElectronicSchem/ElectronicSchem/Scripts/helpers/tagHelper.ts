module helpers {

    export function autoTagsCompile(text: string, idContainer: string, input: JQuery) {    
        $.ajax({
            url: '/Posts/GetTagsByPattern',
            data: { pattern: text },
            type: 'post',
            success: (data) => {
                var tags = <schem.TagModel[]>JSON.parse(data);

                if (tags.length > 0)
                    addAuto(idContainer, input, tags);
                else
                    $(idContainer).html('');
            }
        });
    }

    function addAuto(idContainer: string, input: JQuery, listTags: schem.TagModel[]) {
        var auto = createElement('div', '', 'auto');
        var list = createElement('ul', '', 'list-group auto-list');

        listTags.forEach((tag, index, array) => {
            createListItem(tag, input, auto, list);
        });

        auto.appendChild(list);

        $(idContainer).html('');
        $(idContainer).append(auto);
    }

    function createListItem(tag: schem.TagModel, input: JQuery, auto: Element, list: Element): Element {
        var li = createElement('li', tag.value, 'list-group-item auto-list-item');

        li.onclick = () => {
            input.val(li.textContent);
            $(auto).remove();
        };

        list.appendChild(li);

        return list;
    }

    export function getTag(text: string, isRemoving: boolean): Element {
        
        text = text.replace(/\s/g, '_');

        return createTagDiv(text, isRemoving);
    }

    export function isDuplicateTag(text: string, tags: schem.TagModel[]): boolean {
        text = text.replace(/\s/g, '_');
        for (var i = 0; i < tags.length; i++)
            if (tags[i].value == text)
                return true;

        return false;
    }

    function createTagDiv(text: string, isRemoving: boolean): Element {
        var tag = createElement('div', text, 'tag-item');

        if (isRemoving)
            addDeleteIcon(tag);
        else
            addRedirect(tag, text);

        return tag;
    }

    function addRedirect(tag: Element, text: string) {
        $(tag).on('click', () => {
            window.location.href = '/Home/Index?tag=' + text;
        });
    }

    function addDeleteIcon(tag: Element) {
        var deleteIcon = createElement('i', '', 'fa fa-times');

        tag.appendChild(deleteIcon);

        deleteIcon.onclick = () => $(event.target).parent('div').remove();
    }

    export function createElement(element: string, text: string, className: string) {
        var result = document.createElement(element);
        result.className = className;
        result.textContent = text;

        return result;
    }

    export function getListTags(container: string): schem.TagModel[] {
      
        var tagList = new Array<schem.TagModel>();

        $(container).children('div').toArray().forEach((tag: Element, index, array) => tagList.push({ value: tag.textContent}));

        return tagList;
    }

}