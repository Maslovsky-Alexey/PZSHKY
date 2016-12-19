function changeLanguage(lng: string) {
    $.ajax({
        url: '/Schem/ChangeLanguage',
        data: { language: lng },
        type: 'post',
        success: () => {
            window.location.reload();
        }
    });
}