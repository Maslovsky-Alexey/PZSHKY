module helpers {

    export function getMedal(medal: MedalModel): Element{
        var model = createElement('div', '', 'item-medal');
        model.setAttribute('data-title', medal.Description);

        var img = createElement('img', '', 'img-medal');
        img.setAttribute('src', medal.Url);

        model.appendChild(img);

        return model;
    }
}