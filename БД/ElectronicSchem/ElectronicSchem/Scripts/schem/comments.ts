module schem {
    export var currentCommentCount = 0;

    export function addComment(postId: number, containerID: string) {
        var e = <KeyboardEvent>event;

        if (isEmptyText($(event.target).val())) {
            $(event.target).val('');
            return;
        }  

        if (!e.ctrlKey && e.keyCode == 13) {
            e.preventDefault();
            sendCommentToServer(containerID, postId, $(event.target).val());  
            $(event.target).val('');
        }
                                
        else
            if (e.ctrlKey && e.keyCode == 13) 
                $(event.target).val($(event.target).val() + '\n');
    }

    function sendCommentToServer(containerID: string, postId: number, text: string) {    
        $.ajax({
            url: 'Posts/SaveComment',
            data: {
                message: text,
                postId: postId
            },
            type: 'post',
            success: (data) => {
                var comment = JSON.parse(data);
                postCommentToBegin(containerID, comment.text, comment.user, comment.date, comment.id, comment.userId);
                currentCommentCount++;
            }
        });
    }

    export function postCommentToEnd(containerID: string, text: string, who: string, date: string, id: number, userId: string) {
        $(containerID).append(createCommentElement(text, who, date, id, userId));
        getLikesComment(id);
        getDislikesComment(id);
    }

    export function postCommentToBegin(containerID: string, text: string, who: string, date: string, id: number, userId: string) {
        $(containerID).prepend(createCommentElement(text, who, date, id, userId));
        getLikesComment(id);
        getDislikesComment(id);
    }

    export function isEmptyText(text: string): boolean {
        if (text.length == 0)
            return true;

        for (var i = 0; i < text.length; i++)
            if (text[i] != ' ')
                return false;

        return true;
    }

    function createCommentElement(msg: string, username: string, date: string, id: number, userId: string): Element{
        var result = getDivWithClassesAndText('', 'post-comment', 'row');

        var aboutComment = getDivWithClassesAndText('', 'post-comment-right', 'col-sm-2');
       
        aboutComment.appendChild(getWho(username, userId));
        aboutComment.appendChild(getDivWithClassesAndText(date, 'post-comment-date'));


        aboutComment.appendChild(getLikes(id));

        result.appendChild(getDivWithClassesAndText(msg, 'post-comment-text', 'col-sm-10'));
        result.appendChild(aboutComment);

        return result;
    }

    function getWho(username: string, userId: string): Element {
        var who = getDivWithClassesAndText('', 'post-comment-who');
        var whoLink = createElement('a', 'post-comment-who-link');
        whoLink.textContent = username;
        whoLink.setAttribute('href', 'Manage/Index?id=' + userId);

        who.appendChild(whoLink);

        return who;
    }

    function getLikes(id: number) {
        var likes = getDivWithClassesAndText('', 'comment-likes');

        likes.setAttribute('id', id + '');

        likes.appendChild(createElement('i', 'fa fa-thumbs-up like', { name: 'onclick', value: 'schem.likeComment(' + id + ')'}));
        likes.appendChild(getDivWithClassesAndText('', 'comment-likes-count'));

        likes.appendChild(createElement('i', 'fa fa-thumbs-down dislike', { name: 'onclick', value: 'schem.dislikeComment(' + id + ')' }));
        likes.appendChild(getDivWithClassesAndText('', 'comment-dislikes-count'));

        return likes;
    }

    export function likeComment(commentId: number) {
        console.debug('as');
        $.ajax({
            url: "Posts/LikeComments",
            data: { commentId: commentId },
            type: 'post',
            success: (result: number) => {
                getLikesComment(commentId);
                getDislikesComment(commentId);
            }
        });
    }

    export function dislikeComment(commentId: number) {
        $.ajax({
            url: "Posts/DislikeComments",
            data: { commentId: commentId },
            type: 'post',
            success: (result: number) => {
                getLikesComment(commentId);
                getDislikesComment(commentId);
            }
        });
    }

    function createElement(selector: string, className, ...attributes: { name: string, value: string }[]) {
        var result = document.createElement(selector);

        result.className = className;

        attributes.forEach((attr, index, array) => result.setAttribute(attr.name, attr.value));

        return result;
    }

    function getDivWithClassesAndText(text: string, ...classes: string[]) {
        var result = document.createElement('div');

        classes.forEach((item, index, array) => result.classList.add(item));
        result.innerText = text;

        return result;
    }

    export function getLikesComment(commentId: any) {
        $.ajax({
            url: "Posts/GetLikesComments",
            data: { commentId: commentId },
            type: 'post',
            success: (result: number) => {
                $('#' + commentId).find('.comment-likes-count').text(result);
            }
        });
    }

    export function getDislikesComment(commentId: any) {
        $.ajax({
            url: "Posts/GetDislikesComments",
            data: { commentId: commentId },
            type: 'post',
            success: (result: number) => {
                $('#'+ commentId).find('.comment-dislikes-count').text(result);
            }
        });
    }
}