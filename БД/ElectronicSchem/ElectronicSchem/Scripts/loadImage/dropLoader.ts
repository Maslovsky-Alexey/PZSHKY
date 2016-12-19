module dropLoader {
    var dropZone = $('#dropZone');

    dropZone[0].ondragover = () => {
        dropZone.addClass('hover');
        return false;
    };

    dropZone[0].ondragleave = () => {
        dropZone.removeClass('hover');
        return false;
    };

    dropZone[0].ondrop = function (event) {
        event.preventDefault();
        dropZone.removeClass('hover');
        dropZone.addClass('drop');



        loadImage(event.dataTransfer.files[0]);
    };

    function loadImage(file: File) {
        var reader = new FileReader();

        reader.onload = function (ev2: any) {
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
            success: () => {
                console.debug('asd');
            }
        });
    }
}
