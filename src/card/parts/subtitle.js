const { markup } = require('../../helper/markup');
const cardUtil = require('../cardUtil');

exports.subtitle = (params, decoration) => {
    const containerElem = cardUtil.element(
        'div',
        'card-element card-subtitle-line'
    );
    const textElem = cardUtil.element('p', 'card-subtitle-text');

    const text = cardUtil.subtitleTextString(params );

    return containerElem(textElem(markup(text)));
};
