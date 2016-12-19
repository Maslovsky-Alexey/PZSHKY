var home = angular.module('homeApp', []);

home.controller('homeController', ($scope) => {

    var tags: schem.TagModel[];
    var incSort = true;

    $scope.tags;
    $scope.posts;

    $scope.init = (tag: string, category: string) => {
        if (tag)
            getAllPostsByTag(tag);
        else
            if (category)
                getAllPostsByCategory(category);
            else
                getTopPosts();

        getTags();
    }

    $scope.search = () => {        
        var e = <KeyboardEvent>event;

        if (e.keyCode == 13) {
            getAllPosts($(event.target).val());
            $(event.target).val('');
        }
    }

    $scope.searchInTags = () => {
        $scope.tags = new Array<schem.TagModel>();
        var text = $(event.target).val().toLowerCase();

        tags.forEach((tag, index, array) => {
            if (tag.value.toLowerCase().indexOf(text) > -1)
                $scope.tags.push(tag);
        });      
    }

    $scope.tagSearcher = (tag: string) => {      
        getAllPostsByTag(tag);
    }

    $scope.getPostsByCategory = (category: string) => {
        getAllPostsByCategory(category);
    }

    $scope.sortPostByDate = () => {
        if (incSort)
            $scope.posts = $scope.posts.sort((post1: PostModel, post2: PostModel) => new Date(post1.date).getTime() - new Date(post2.date).getTime());
        else
            $scope.posts = $scope.posts.sort((post1: PostModel, post2: PostModel) => new Date(post2.date).getTime() - new Date(post1.date).getTime());

        incSort = !incSort;
    }

    $scope.sortPostByRating = () => {
        if (incSort)
            $scope.posts = $scope.posts.sort((post1, post2) => post1.rating - post2.rating);
        else
            $scope.posts = $scope.posts.sort((post1, post2) => post2.rating - post1.rating);

        incSort = !incSort;
    }

    function getAllPosts(text: string) {
        $.ajax({
            url: '/Posts/AllPosts',
            data: { text: text },
            type: 'post',
            success: (data) => {
                $scope.posts = <PostModel[]>JSON.parse(data);
                $scope.$apply();
            }
        });
    }

    function getTopPosts() {
        $.ajax({
            url: '/Posts/TopPosts',
            type: 'post',
            success: (data) => {
                $scope.posts = <PostModel[]>JSON.parse(data);
                $scope.$apply();
            }
        });
    }

    function getAllPostsByCategory(category: string) {
        $.ajax({
            url: '/Posts/GetPostsByCategory',
            data: { category: category },
            type: 'post',
            success: (data) => {
                $scope.posts = <PostModel[]>JSON.parse(data);
                $scope.$apply();
            }
        });
    }



    function getAllPostsByTag(tag: string) {
        $.ajax({
            url: '/Posts/GetPostsByTag',
            data: { tag: tag },
            type: 'post',
            success: (data) => {
                $scope.posts = <PostModel[]>JSON.parse(data);
                $scope.$apply();
            }
        });
    }

    function getTags() {
        $.ajax({
            url: "/Posts/GetTags",
            type: 'post',
            success: (data) => {
                tags = JSON.parse(data);
                $scope.tags = tags;
                $scope.$apply();
            }
        });
    }

});