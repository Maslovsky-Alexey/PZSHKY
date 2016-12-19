var schem;
(function (schem) {
    schem.currentCommentCount = 0;
    function addComment(postId, containerID) {
        var e = event;
        if (isEmptyText($(event.target).val())) {
            $(event.target).val('');
            return;
        }
        if (!e.ctrlKey && e.keyCode == 13) {
            e.preventDefault();
            sendCommentToServer(containerID, postId, $(event.target).val());
            $(event.target).val('');
        }
        else if (e.ctrlKey && e.keyCode == 13)
            $(event.target).val($(event.target).val() + '\n');
    }
    schem.addComment = addComment;
    function sendCommentToServer(containerID, postId, text) {
        $.ajax({
            url: 'Posts/SaveComment',
            data: {
                message: text,
                postId: postId
            },
            type: 'post',
            success: function (data) {
                var comment = JSON.parse(data);
                postCommentToBegin(containerID, comment.text, comment.user, comment.date, comment.id, comment.userId);
                schem.currentCommentCount++;
            }
        });
    }
    function postCommentToEnd(containerID, text, who, date, id, userId) {
        $(containerID).append(createCommentElement(text, who, date, id, userId));
        getLikesComment(id);
        getDislikesComment(id);
    }
    schem.postCommentToEnd = postCommentToEnd;
    function postCommentToBegin(containerID, text, who, date, id, userId) {
        $(containerID).prepend(createCommentElement(text, who, date, id, userId));
        getLikesComment(id);
        getDislikesComment(id);
    }
    schem.postCommentToBegin = postCommentToBegin;
    function isEmptyText(text) {
        if (text.length == 0)
            return true;
        for (var i = 0; i < text.length; i++)
            if (text[i] != ' ')
                return false;
        return true;
    }
    schem.isEmptyText = isEmptyText;
    function createCommentElement(msg, username, date, id, userId) {
        var result = getDivWithClassesAndText('', 'post-comment', 'row');
        var aboutComment = getDivWithClassesAndText('', 'post-comment-right', 'col-sm-2');
        aboutComment.appendChild(getWho(username, userId));
        aboutComment.appendChild(getDivWithClassesAndText(date, 'post-comment-date'));
        aboutComment.appendChild(getLikes(id));
        result.appendChild(getDivWithClassesAndText(msg, 'post-comment-text', 'col-sm-10'));
        result.appendChild(aboutComment);
        return result;
    }
    function getWho(username, userId) {
        var who = getDivWithClassesAndText('', 'post-comment-who');
        var whoLink = createElement('a', 'post-comment-who-link');
        whoLink.textContent = username;
        whoLink.setAttribute('href', 'Manage/Index?id=' + userId);
        who.appendChild(whoLink);
        return who;
    }
    function getLikes(id) {
        var likes = getDivWithClassesAndText('', 'comment-likes');
        likes.setAttribute('id', id + '');
        likes.appendChild(createElement('i', 'fa fa-thumbs-up like', { name: 'onclick', value: 'schem.likeComment(' + id + ')' }));
        likes.appendChild(getDivWithClassesAndText('', 'comment-likes-count'));
        likes.appendChild(createElement('i', 'fa fa-thumbs-down dislike', { name: 'onclick', value: 'schem.dislikeComment(' + id + ')' }));
        likes.appendChild(getDivWithClassesAndText('', 'comment-dislikes-count'));
        return likes;
    }
    function likeComment(commentId) {
        console.debug('as');
        $.ajax({
            url: "Posts/LikeComments",
            data: { commentId: commentId },
            type: 'post',
            success: function (result) {
                getLikesComment(commentId);
                getDislikesComment(commentId);
            }
        });
    }
    schem.likeComment = likeComment;
    function dislikeComment(commentId) {
        $.ajax({
            url: "Posts/DislikeComments",
            data: { commentId: commentId },
            type: 'post',
            success: function (result) {
                getLikesComment(commentId);
                getDislikesComment(commentId);
            }
        });
    }
    schem.dislikeComment = dislikeComment;
    function createElement(selector, className) {
        var attributes = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            attributes[_i - 2] = arguments[_i];
        }
        var result = document.createElement(selector);
        result.className = className;
        attributes.forEach(function (attr, index, array) { return result.setAttribute(attr.name, attr.value); });
        return result;
    }
    function getDivWithClassesAndText(text) {
        var classes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            classes[_i - 1] = arguments[_i];
        }
        var result = document.createElement('div');
        classes.forEach(function (item, index, array) { return result.classList.add(item); });
        result.innerText = text;
        return result;
    }
    function getLikesComment(commentId) {
        $.ajax({
            url: "Posts/GetLikesComments",
            data: { commentId: commentId },
            type: 'post',
            success: function (result) {
                $('#' + commentId).find('.comment-likes-count').text(result);
            }
        });
    }
    schem.getLikesComment = getLikesComment;
    function getDislikesComment(commentId) {
        $.ajax({
            url: "Posts/GetDislikesComments",
            data: { commentId: commentId },
            type: 'post',
            success: function (result) {
                $('#' + commentId).find('.comment-dislikes-count').text(result);
            }
        });
    }
    schem.getDislikesComment = getDislikesComment;
})(schem || (schem = {}));
//# sourceMappingURL=comments.js.map