const { filterUniqueByObjectKey } = require('../../util/arrays');
const { toCamelCase } = require('../../util/stringHelper');
const { Tag } = require('../classes');

exports.composeDefinition = (original) => {
    const list = original.map(parse).filter(filterUniqueByObjectKey());
    return {
        list,
        find: () => null,
        buildBlocks: (buildFn) => buildFn(list, 'definition.hbs'),
        buildTooltips: (buildFn) => buildFn(list, 'definition.hbs'),
    };
};

const parse = (item) => {
    const {
        name = 'ERROR',
        slug = '/',
        tip = [],
        formatted = {},
        alt = [],
    } = item;
    const id = item.id || id || toCamelCase(name);

    const tag = new Tag(id, alt, slug, name, formatted, tip);

    return {
        id,
        type:'definition',
        tag,
    };
};
