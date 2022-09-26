const { markup } = require('../../helper/markup');
const cardUtil = require('../cardUtil');

exports.ruler = (params, decoration) => {
    return `<svg
    class='card-element card-ruler-line'
    height='1'
    width='100'
    viewBox='0 0 100 1'
    preserveAspectRatio='none'
    xmlns='http://www.w3.org/2000/svg'
    >
        <polyline points='0,0 100,0.5 0,1' fill={color} />
    </svg>`;
};
