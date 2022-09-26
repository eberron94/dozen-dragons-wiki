const { markup } = require('../../helper/markup');
const cardUtil = require('../cardUtil');

exports.pftrait = (params) => {
    const containerElem = cardUtil.element(
        'div',
        'card-element card-pftrait-line trait-line'
    );
    const traitElem = cardUtil.element('span', 'card-pftrait-trait trait');

    // console.log(params)

    const traits = cardUtil.traitTextArray(params).map((text) => {
        let className;
        switch (text.trim()) {
            case 'uncommon':
                className = 'uncommon';
                break;
            case 'rare':
                className = 'rare';
                break;
            case 'unique':
                className = 'unique';
                break;
            default:
        }

        return traitElem(text.trim(), className);
    });

    return containerElem(traits.join(''));
};
