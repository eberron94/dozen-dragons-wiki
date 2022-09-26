const { markup } = require('../../helper/markup');
const cardUtil = require('../cardUtil');

exports.text = (params, decoration) => {
    const containerElem = cardUtil.element(
        'div',
        'card-element card-text-line'
    );
    const textElem = cardUtil.element('p', 'card-text-text');

    let styleClass;
    switch (decoration) {
        case 'center':
            styleClass = 'text-align-center';
            break;
        case 'justify':
            styleClass = 'text-align-justify';
            break;
        case 'right':
            styleClass = 'text-align-right';
            break;
    }

    const text = cardUtil.textTextString(params);

    return containerElem(textElem(markup(text), styleClass));
};
