var dropLoader;
(function (dropLoader) {
    var dropZone = $('#dropZone');
    dropZone[0].ondragover = function () {
        dropZone.addClass('hover');
        return false;
    };
    dropZone[0].ondragleave = function () {
        dropZone.removeClass('hover');
        return false;
    };
    dropZone[0].ondrop = function (event) {
        event.preventDefault();
        dropZone.removeClass('hover');
        dropZone.addClass('drop');
        loadImage(event.dataTransfer.files[0]);
    };
    function loadImage(file) {
        var reader = new FileReader();
        reader.onload = function (ev2) {
            dropZone.attr('src', ev2.srcElement.result);
            dropZone.removeClass('drop');
            sendImageToServer(ev2.srcElement.result);
        };
        reader.readAsDataURL(file);
    }
    function sendImageToServer(img) {
        $.ajax({
            url: '/Manage/ChangeImage',
            data: { img: img },
            type: 'post',
            success: function () {
                console.debug('asd');
            }
        });
    }
})(dropLoader || (dropLoader = {}));
//# sourceMappingURL=dropLoader.js.map