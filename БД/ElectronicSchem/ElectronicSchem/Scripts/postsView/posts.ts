var appPosts = angular.module('postsViewApp', []);

class PostModel {
    public id: number;

    public title: string;

    public username: string;

    public discription: string;

    public date: string;

    public datetime: Date;

    public rating: number;
}

class MedalModel {
    public Description: string;

    public Url: string;
}

appPosts.controller('postsController', ($scope) => {
    $scope.posts;

    $scope.init = (userId: string, containerId: string) => {
        getPosts(userId);
        getMedals(userId, containerId);
    }


    $scope.muteUser = (userId: string) => {
        var checked = $(event.target).is(':checked');

        $.ajax({
            url: '/Manage/MuteUser',
            data: {
                userId: userId, mute: checked
            },
            type: 'post'
        });
    }

    function getPosts(userId: string) {
        $.ajax({
            url: "/Posts/GetUserPosts",
            type: 'post',
            data: { userId: userId },
            success: (data) => {
                $scope.posts = <PostModel[]>JSON.parse(data);         
                $scope.$apply();      
            }
        });
    }

    function getMedals(userId: string, containerId: string) {
        $.ajax({
            url: "/Posts/GetMedalsUser",
            type: 'post',
            data: { userId: userId },
            success: (data) => {
                var medals = <MedalModel[]>JSON.parse(data);

                medals.forEach((medal, index, array) => {
                    $(containerId).append(helpers.getMedal(medal));
                });
            }
        });
    }

    $scope.removePost = (postId: number) => {
        $.ajax({
            url: '/Posts/RemovePost',
            data: {
                postId: postId
            },
            type: 'post',
            success: () => removePostFromList(postId)
        });
    };

    function removePostFromList(postId: number) {
        var res: PostModel[] = new Array<PostModel>();

        $scope.posts.forEach((item, index, array) => {
            if (item.id != postId)
                res.push(item);
        });

        $scope.posts = res;
        $scope.$apply();
    }
});
