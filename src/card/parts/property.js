const { markup } = require('../../helper/markup');
const cardUtil = require('../cardUtil');

exports.property = (params) => {
    const containerElem = cardUtil.element(
        'div',
        'card-element card-property-line'
    );
    const flexElem = cardUtil.element('div', 'card-property-flex');
    const nameElem = cardUtil.element('span', 'card-property-name');
    const textElem = cardUtil.element('p', 'card-property-text');

    const propertyArray = cardUtil
        .propertyTextArray(params)
        .map(({ name, text }) =>
            flexElem(nameElem(name) + textElem(markup(text)))
        );

    return containerElem(propertyArray.join(''));
};
