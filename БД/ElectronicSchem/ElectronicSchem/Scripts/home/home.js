var home = angular.module('homeApp', []);
home.controller('homeController', function ($scope) {
    var tags;
    var incSort = true;
    $scope.tags;
    $scope.posts;
    $scope.init = function (tag, category) {
        if (tag)
            getAllPostsByTag(tag);
        else if (category)
            getAllPostsByCategory(category);
        else
            getTopPosts();
        getTags();
    };
    $scope.search = function () {
        var e = event;
        if (e.keyCode == 13) {
            getAllPosts($(event.target).val());
            $(event.target).val('');
        }
    };
    $scope.searchInTags = function () {
        $scope.tags = new Array();
        var text = $(event.target).val().toLowerCase();
        tags.forEach(function (tag, index, array) {
            if (tag.value.toLowerCase().indexOf(text) > -1)
                $scope.tags.push(tag);
        });
    };
    $scope.tagSearcher = function (tag) {
        getAllPostsByTag(tag);
    };
    $scope.getPostsByCategory = function (category) {
        getAllPostsByCategory(category);
    };
    $scope.sortPostByDate = function () {
        if (incSort)
            $scope.posts = $scope.posts.sort(function (post1, post2) { return new Date(post1.date).getTime() - new Date(post2.date).getTime(); });
        else
            $scope.posts = $scope.posts.sort(function (post1, post2) { return new Date(post2.date).getTime() - new Date(post1.date).getTime(); });
        incSort = !incSort;
    };
    $scope.sortPostByRating = function () {
        if (incSort)
            $scope.posts = $scope.posts.sort(function (post1, post2) { return post1.rating - post2.rating; });
        else
            $scope.posts = $scope.posts.sort(function (post1, post2) { return post2.rating - post1.rating; });
        incSort = !incSort;
    };
    function getAllPosts(text) {
        $.ajax({
            url: '/Posts/AllPosts',
            data: { text: text },
            type: 'post',
            success: function (data) {
                $scope.posts = JSON.parse(data);
                $scope.$apply();
            }
        });
    }
    function getTopPosts() {
        $.ajax({
            url: '/Posts/TopPosts',
            type: 'post',
            success: function (data) {
                $scope.posts = JSON.parse(data);
                $scope.$apply();
            }
        });
    }
    function getAllPostsByCategory(category) {
        $.ajax({
            url: '/Posts/GetPostsByCategory',
            data: { category: category },
            type: 'post',
            success: function (data) {
                $scope.posts = JSON.parse(data);
                $scope.$apply();
            }
        });
    }
    function getAllPostsByTag(tag) {
        $.ajax({
            url: '/Posts/GetPostsByTag',
            data: { tag: tag },
            type: 'post',
            success: function (data) {
                $scope.posts = JSON.parse(data);
                $scope.$apply();
            }
        });
    }
    function getTags() {
        $.ajax({
            url: "/Posts/GetTags",
            type: 'post',
            success: function (data) {
                tags = JSON.parse(data);
                $scope.tags = tags;
                $scope.$apply();
            }
        });
    }
});
//# sourceMappingURL=home.js.map