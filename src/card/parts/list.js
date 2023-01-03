const { markup } = require('../../helper/markup');
const cardUtil = require('../cardUtil');

exports.list = (params, decoration) => {
    const containerElem = cardUtil.element('ul', 'card-element card-list-line');
    const listElem = cardUtil.element('li', 'card-list-list');
    const nameElem = cardUtil.element('span', 'card-list-name');
    const textElem = cardUtil.element('p', 'card-list-text');

    const name = cardUtil.listNameString(params);
    const text = cardUtil.listTextString(params);

    if (name) {
        return containerElem(
            listElem(nameElem(markup(name)) + textElem(markup(text)))
        );
    }

    return containerElem(listElem(textElem(markup(text))));
};
