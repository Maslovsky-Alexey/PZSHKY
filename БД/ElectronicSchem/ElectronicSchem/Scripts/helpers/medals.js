var helpers;
(function (helpers) {
    function getMedal(medal) {
        var model = helpers.createElement('div', '', 'item-medal');
        model.setAttribute('data-title', medal.Description);
        var img = helpers.createElement('img', '', 'img-medal');
        img.setAttribute('src', medal.Url);
        model.appendChild(img);
        return model;
    }
    helpers.getMedal = getMedal;
})(helpers || (helpers = {}));
//# sourceMappingURL=medals.js.map