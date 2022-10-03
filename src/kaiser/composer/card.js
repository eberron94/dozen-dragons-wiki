const { description } = require('../../card/parts/description');
const { list } = require('../../card/parts/list');
const { pftrait } = require('../../card/parts/pftrait');
const { property } = require('../../card/parts/property');
const { ruler } = require('../../card/parts/ruler');
const { section } = require('../../card/parts/section');
const { subtitle } = require('../../card/parts/subtitle');
const { tablerow } = require('../../card/parts/tablerow');
const { text } = require('../../card/parts/text');
const { markup } = require('../../helper/markup');
const { filterUniqueByObjectKey } = require('../../util/arrays');
const { toCamelCase } = require('../../util/stringHelper');

const iconMap = require('../../iconMap.json');

exports.composeCard = (original) => {
    const list = original.map(parse).filter(filterUniqueByObjectKey());
    // console.log(list);

    return {
        list,
        find: (id) => list.find((item) => item.id === id),
        findPartials: (id) => {
            const pid = id.replace('P::', '');
            const foundList = list.filter((item) => item.id.startsWith(pid));

            return foundList;
        },
        buildBlocks: (buildFn) => buildFn(list, 'item-card.hbs'),
        // buildTooltips: (buildFn) => buildFn(list, 'item-card.hbs'),
        print: () => {
            const kMap = {};

            list.forEach(({ id, data }) => (kMap[id] = { id, ...data }));

            return `const kaiser = ${JSON.stringify(kMap, null, 4)};`;
        },
        sort:(a,b)=> {

            if(a?.level < b?.level) return -1;
            if(a?.level > b?.level) return 1;

            if(a?.data?.title < b?.data?.title) return -1;
            if(a?.data?.title > b?.data?.title) return 1;

            if(a?.id < b?.id) return -1;
            if(a?.id > b?.id) return 1;

            return 0;
        }
    };
};

const parse = (item) => {
    const {
        title = 'ERROR',
        contents = [],
        icon_front = '',
        icon_back = '',
        color = '',
        code = '',
        extra = [],
        level,
    } = item;

    const id = item.id || toCamelCase(title);

    // const formattedContent = contents.split('\n')
    // console.log('************', contents);

    const contentLines = contents
        .concat(extra)
        .map((cl) => cl.split('|').map((e) => e.trim()))
        .map(([type, ...args]) => ({ type, params: args || [] }))
        .map(matchLines);

    // console.log(contentLines);

    return {
        id,
        type: 'item-card',
        level,
        data: {
            title,
            contents,
            icon_front,
            icon_back,
            color,
            code,
        },
        card: {
            title: markup(title),
            contents: contentLines,
            icon: iconMap[icon_front || 'ace'].path,
            code: code,
        },
    };
};

const matchLines = (arg) => {
    switch (arg.type) {
        case 'subtitle':
            return subtitle(arg);
        case 'property':
        case 'prop':
        case 'p':
            return property(arg);
        case 'description':
        case 'desc':
        case 'd':
            return description(arg);
        case 'ruler':
        case 'rule':
        case 'hr':
        case 'divider':
            return ruler(arg);
        case 'text':
        case 'center':
        case 'justify':
        case 'right':
            return text(arg, arg.type);
        case 'bullet':
        case 'list':
        case 'item':
        case 'check':
        case 'todo':
            return list(arg);
        case 'section':
        case 'subsection':
        case 'heading':
            return section(arg);
        case 'tablehead':
        case 'tableheader':
        case 'table':
        case 'th':
            return tablerow(arg);
        case 'tablerow':
        case 'row':
        case 'tr':
            return tablerow(arg);
        case 'pftrait':
            // console.log(arg);

            return pftrait(arg);
        default:
            return '';
    }
};
