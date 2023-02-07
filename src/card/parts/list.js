const { markup } = require('../../helper/markup');
const cardUtil = require('../cardUtil');

exports.list = (params, decoration) => {
    const containerElem = cardUtil.element('div', 'card-element card-list-line');
    const nameElem = cardUtil.element('span', 'card-list-name');
    const textElem = cardUtil.element('p', 'card-list-text');

    const name = cardUtil.listNameString(params);
    const text = cardUtil.listTextString(params);

    if (name) {
        return containerElem(
            (nameElem(markup(name)) + textElem(markup(text)))
        );
    }

    return containerElem((textElem(markup(text))));
};
