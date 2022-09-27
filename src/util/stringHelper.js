const decode = require('unescape');

const toTitleCase = (str) => {
    switch (typeof str) {
        case 'string':
            return str
                .toLowerCase()
                .split(' ')
                .map((word) => {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                })
                .join(' ');
        case 'number':
            return str;
        case 'object':
        default:
    }

    if (Array.isArray(str)) {
        return str.map((ss) => toTitleCase(ss));
    }
};

const toCamelCase = (str) =>
    str && typeof str === 'string'
        ? str
              .replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) =>
                  idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()
              )
              .replace(/\s+/g, '')
        : '';

const toDashCase = (str) =>
    str && typeof str === 'string'
        ? toCamelCase(str)
              .replace(/([a-z])([A-Z])/g, '$1-$2')
              .toLowerCase()
        : '';

const toUnderscoreCase = (str) =>
    str && typeof str === 'string'
        ? _toCamelCase(str)
              .replace(/([a-z])([A-Z])/g, '$1_$2')
              .toLowerCase()
        : '';

const joinConjugation = (arr, conjugation = 'and') =>
    Array.isArray(arr) && arr.length > 1
        ? arr.slice(0, -1).join(', ') +
          (arr.length > 2 ? ', ' : ' ') +
          (typeof conjugation === 'string' ? conjugation : 'and') +
          ' ' +
          arr.slice(-1)
        : arr;

const uuidv4 = () => {
    return 'xxx4xxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const escapeStr = (str) => {
    return decode(str);
};

const nthNumber = (num) => {
    switch (String(num)) {
        case '1':
            return '1st';
        case '2':
            return '2nd';
        case '3':
            return '3rd';
        default:
            return num + 'th';
    }
};

module.exports = {
    toTitleCase,
    toCamelCase,
    toDashCase,
    toUnderscoreCase,
    joinConjugation,
    uuidv4,
    escapeStr,
    nthNumber,
};
