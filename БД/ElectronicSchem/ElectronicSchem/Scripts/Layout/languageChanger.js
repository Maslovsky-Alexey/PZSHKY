function changeLanguage(lng) {
    $.ajax({
        url: '/Schem/ChangeLanguage',
        data: { language: lng },
        type: 'post',
        success: function () {
            window.location.reload();
        }
    });
}
//# sourceMappingURL=languageChanger.js.map