var helpers;
(function (helpers) {
    function autoTagsCompile(text, idContainer, input) {
        $.ajax({
            url: '/Posts/GetTagsByPattern',
            data: { pattern: text },
            type: 'post',
            success: function (data) {
                var tags = JSON.parse(data);
                if (tags.length > 0)
                    addAuto(idContainer, input, tags);
                else
                    $(idContainer).html('');
            }
        });
    }
    helpers.autoTagsCompile = autoTagsCompile;
    function addAuto(idContainer, input, listTags) {
        var auto = createElement('div', '', 'auto');
        var list = createElement('ul', '', 'list-group auto-list');
        listTags.forEach(function (tag, index, array) {
            createListItem(tag, input, auto, list);
        });
        auto.appendChild(list);
        $(idContainer).html('');
        $(idContainer).append(auto);
    }
    function createListItem(tag, input, auto, list) {
        var li = createElement('li', tag.value, 'list-group-item auto-list-item');
        li.onclick = function () {
            input.val(li.textContent);
            $(auto).remove();
        };
        list.appendChild(li);
        return list;
    }
    function getTag(text, isRemoving) {
        text = text.replace(/\s/g, '_');
        return createTagDiv(text, isRemoving);
    }
    helpers.getTag = getTag;
    function isDuplicateTag(text, tags) {
        text = text.replace(/\s/g, '_');
        for (var i = 0; i < tags.length; i++)
            if (tags[i].value == text)
                return true;
        return false;
    }
    helpers.isDuplicateTag = isDuplicateTag;
    function createTagDiv(text, isRemoving) {
        var tag = createElement('div', text, 'tag-item');
        if (isRemoving)
            addDeleteIcon(tag);
        else
            addRedirect(tag, text);
        return tag;
    }
    function addRedirect(tag, text) {
        $(tag).on('click', function () {
            window.location.href = '/Home/Index?tag=' + text;
        });
    }
    function addDeleteIcon(tag) {
        var deleteIcon = createElement('i', '', 'fa fa-times');
        tag.appendChild(deleteIcon);
        deleteIcon.onclick = function () { return $(event.target).parent('div').remove(); };
    }
    function createElement(element, text, className) {
        var result = document.createElement(element);
        result.className = className;
        result.textContent = text;
        return result;
    }
    helpers.createElement = createElement;
    function getListTags(container) {
        var tagList = new Array();
        $(container).children('div').toArray().forEach(function (tag, index, array) { return tagList.push({ value: tag.textContent }); });
        return tagList;
    }
    helpers.getListTags = getListTags;
})(helpers || (helpers = {}));
//# sourceMappingURL=tagHelper.js.map