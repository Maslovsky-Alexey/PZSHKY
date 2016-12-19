var appPosts = angular.module('postsViewApp', []);
var PostModel = (function () {
    function PostModel() {
    }
    return PostModel;
}());
var MedalModel = (function () {
    function MedalModel() {
    }
    return MedalModel;
}());
appPosts.controller('postsController', function ($scope) {
    $scope.posts;
    $scope.init = function (userId, containerId) {
        getPosts(userId);
        getMedals(userId, containerId);
    };
    $scope.muteUser = function (userId) {
        var checked = $(event.target).is(':checked');
        $.ajax({
            url: '/Manage/MuteUser',
            data: {
                userId: userId, mute: checked
            },
            type: 'post'
        });
    };
    function getPosts(userId) {
        $.ajax({
            url: "/Posts/GetUserPosts",
            type: 'post',
            data: { userId: userId },
            success: function (data) {
                $scope.posts = JSON.parse(data);
                $scope.$apply();
            }
        });
    }
    function getMedals(userId, containerId) {
        $.ajax({
            url: "/Posts/GetMedalsUser",
            type: 'post',
            data: { userId: userId },
            success: function (data) {
                var medals = JSON.parse(data);
                medals.forEach(function (medal, index, array) {
                    $(containerId).append(helpers.getMedal(medal));
                });
            }
        });
    }
    $scope.removePost = function (postId) {
        $.ajax({
            url: '/Posts/RemovePost',
            data: {
                postId: postId
            },
            type: 'post',
            success: function () { return removePostFromList(postId); }
        });
    };
    function removePostFromList(postId) {
        var res = new Array();
        $scope.posts.forEach(function (item, index, array) {
            if (item.id != postId)
                res.push(item);
        });
        $scope.posts = res;
        $scope.$apply();
    }
});
//# sourceMappingURL=posts.js.map