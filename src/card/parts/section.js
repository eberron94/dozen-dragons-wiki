const { markup } = require('../../helper/markup');
const cardUtil = require('../cardUtil');

exports.section = (params) => {
    const containerElem = cardUtil.element(
        'div',
        'card-element card-section-line'
    );
    const textElem = cardUtil.element('p', 'card-section-text');

    const propertyArray = cardUtil
        .sectionTextArray(params)
        .map((text) => textElem(markup(text)));

    return containerElem(propertyArray.join(''));
};
