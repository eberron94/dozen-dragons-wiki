const { markup } = require('../../helper/markup');
const cardUtil = require('../cardUtil');

exports.tablerow = (params, decoration = 'row') => {
    const containerElem = cardUtil.element(
        'tr',
        'card-element card-tablerow-line'
    );
    const textElem = cardUtil.element(
        decoration === 'header' ? 'th' : 'td',
        'card-tablerow-text'
    );

    const row = cardUtil
        .tableCellTextArray(params)
        .map((e) => textElem(markup(e)));

    return containerElem(row.join(''));
};
