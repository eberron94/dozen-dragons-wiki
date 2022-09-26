const { markup } = require('../../helper/markup');
const cardUtil = require('../cardUtil');

exports.tablerow = (params, decoration) => {
    const containerElem = cardUtil.element(
        decoration === 'header' ? 'th' : 'tr',
        'card-element card-tablerow-line'
    );
    const textElem = cardUtil.element('td', 'card-tablerow-text');

    const row = cardUtil
        .tableCellTextArray( params )
        .map((e) => textElem(markup(e)));

    return containerElem(row.join(''));
};
