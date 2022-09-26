const { filterUnique, filterUniqueByObjectKey } = require('../../util/arrays');
const { cape } = require('../../util/cape');
const {
    toCamelCase,
    toDashCase,
    toTitleCase,
} = require('../../util/stringHelper');
const { PageNode, Tag } = require('../classes');

exports.composeSpell = (original) => {
    const list = original.map(parse).filter(filterUniqueByObjectKey());

    const sources = list
        .map((item) => item.data.source)
        .filter(filterUnique)
        .map(extractPath(list))
        .sort();

    return {
        list,
        sources,
        find: (id) => {
            const found = list.find((item) => item.id === id);
            return found ? { ...found } : null;
        },
        findSource: (id) => {
            const found = sources.find((item) => item.id === id);
            return found ? { ...found } : null;
        },
        buildPages: (buildFn) => buildFn(list, 'spell.hbs'),
        buildBlocks: (buildFn) => buildFn(list, 'spell.hbs'),
        buildTooltips: (buildFn) => buildFn(list, 'spell.hbs'),
    };
};

const parse = (item) => {
    const node = new PageNode(
        '/magic/spell/' +
            (item.subspell ? 'sub-path/' : '') +
            item.source +
            '/' +
            toDashCase(item.name),
        item.level,
        item.name,
        '(Lv ' + item.level + ') ' + item.name,
        'Spell | ' + item.name
    );

    const tag = new Tag(
        toCamelCase(item.name),
        [],
        node.slug,
        item.name,
        {},
        []
    );

    const data = {
        name: item.name || 'Error',
        type: 'spell',
        supertype: 'power',
        source: item.source || 'general',

        level: item.level || 0,
        power: cape(item.power) || ['automatic'],
        action: cape(item.action) || ['active'],
        target: cape(item.target) || [],
        maintTime: item.maintTime || 'no',
        cost: { activate: 'per degree', maintain: 'per degree' },
        flavor: cape(item.maintTime) || [],
        description: cape(item.description) || [],
        degree: parseDegree(item),

        subspell: Boolean(item.subspell) || true,
        tags: cape(item.tags) || [],
        extra: cape(item.extra) || [], //TODO PARSE EXTRAs
    };

    return {
        id: tag.id,
        type:'spell',
        node,
        tag,
        data,
    };
};

const parseDegree = ({ base, intermediate, advanced, arcane }) => {
    return {
        base: parseDegreeValue(base),
        intermediate: parseDegreeValue(intermediate),
        advanced: parseDegreeValue(advanced),
        arcane: parseDegreeValue(arcane),
    };
};

const parseDegreeValue = (deg) => {
    const { mana, maint, int, effects } = deg || {};
    return {
        mana: mana || 0,
        main: maint || 0,
        int: int || 1,
        effects: cape(effects) || [],
    };
};

const extractPath = (list) => (source) => {
    const {
        node: { slug },
        data: { subspell },
    } = list.find((item) => item.data.source === source);
    const count = list.filter((item) => item.data.source === source).length;

    var name;
    if (source === 'general') {
        name = 'General Spells';
    } else if (subspell) {
        name = 'Sub-path of ' + toTitleCase(source);
    } else {
        name = 'Path of ' + toTitleCase(source);
    }
    return {
        id: source,
        node: new PageNode(
            slug.substring(0, slug.lastIndexOf('/') + 1),
            10,
            name
        ),
        data: { name, isSubpath: Boolean(subspell), count },
    };
};
