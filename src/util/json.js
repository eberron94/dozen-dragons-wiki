const stringify = require('json-stable-stringify');

const keyPosition = require('../../.vscode/settings.json')[
    'sortJSON.orderOverride'
].reverse();

exports.JSONStringify = (data) => {
    
    return stringify(data, {
        cmp: sortJson,
        space: 4,
    }),
}

const sortJson = (a, b) => {
    const aa = keyPosition.indexOf(a.key);
    const bb = keyPosition.indexOf(b.key);
    if (aa === -1 && bb === -1) return a.key < b.key ? 1 : -1;
    return aa < bb ? 1 : -1;
};