const { markup } = require('../../helper/markup');
const cardUtil = require('../cardUtil');

exports.description = (params) => {
    const containerElem = cardUtil.element(
        'div',
        'card-element card-description-line'
    );
    const flexElem = cardUtil.element('div', 'card-description-flex');
    const nameElem = cardUtil.element('span', 'card-description-name');
    const textElem = cardUtil.element('p', 'card-description-text');

    const descriptionArray = cardUtil
        .propertyTextArray(params)
        .map(({ name, text }) =>
            flexElem(nameElem(name) + textElem(markup(text)))
        );

    return containerElem(descriptionArray.join(''));
};
