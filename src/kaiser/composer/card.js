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
const {
    filterUniqueByObjectKey,
    isSubset,
    notSubset,
} = require('../../util/arrays');
const { toCamelCase } = require('../../util/stringHelper');

const iconMap = require('../../iconMap.json');
// const ignoreList = require('../ignoreList.json');
const refList = require('../refList.json');
const { round } = require('lodash');

exports.composeCard = (original) => {
    const list = original
        .map(parse)
        // .filter((item) => !ignoreList.includes(item.id))
        .filter(filterUniqueByObjectKey());

    // console.log(list);

    const find = (id) => list.find((item) => item.id === id);

    const findPartials = (id) => {
        const pid = id
            .replace('P', '')
            .split('::')
            .filter((e) => e);
        let foundList = list.filter((item) =>
            pid.every((ppid) => item.id.includes(ppid))
        );

        if (foundList.length) return foundList;

        const hasFilter = [];
        const notFilter = [];
        pid[0]
            .split('|')
            .map((e) => e.trim())
            .map((e) => {
                if (e.startsWith('!')) notFilter.push(e.replace('!', ''));
                else hasFilter.push(e);
            });

        foundList = list.filter(
            (item) =>
                isSubset(item.filtering, hasFilter) &&
                notSubset(item.filtering, notFilter)
        );

        return foundList;
    };

    const findWithComplexSearch = (searchStr) => {
        console.log('COMPLEX SEARCHING', searchStr);
        // ATTEMPT ID BASED SEARCH
        let found = find(searchStr);
        if (found) return found;

        // ATTEMPT NAME BASED SEARCH
        found =
            list.find((item) => item.data.title === searchStr) ||
            list.find((item) => item.data.title.startsWith(searchStr)) ||
            list.find((item) => item.data.title.includes(searchStr));
        if (found) return found;

        // BREAK INTO SEARCH PARAMS
        const foundList = findPartials(searchStr);

        if (foundList.length && foundList[0]) return foundList[0];

        // handle individual terms

        return null;
    };

    list.forEach(matchReferences);

    return {
        list,
        find,
        findPartials,
        findWithComplexSearch,
        buildBlocks: (buildFn) => buildFn(list, 'item-card.hbs'),
        buildInlineRefs: (buildFn) => buildFn(list, 'item-card.hbs'),
        print: () => {
            const kMap = {};

            list.forEach(({ id, data }) => (kMap[id] = { id, ...data }));

            return `const kaiser = ${JSON.stringify(kMap, null, 4)};`;
        },
        sort: (a, b) => {
            if (a?.level < b?.level) return -1;
            if (a?.level > b?.level) return 1;

            if (a?.data?.title < b?.data?.title) return -1;
            if (a?.data?.title > b?.data?.title) return 1;

            if (a?.id < b?.id) return -1;
            if (a?.id > b?.id) return 1;

            return 0;
        },
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
        reference = [],
        level,
        filtering = [],
    } = item;

    const id = item.id || toCamelCase(title);

    // const formattedContent = contents.split('\n')
    // console.log('************', contents);

    const contentLines = contents
        // .concat(extra)
        .map((cl) => cl.split('|').map((e) => e.trim()))
        .map(([type, ...args]) => ({ type, params: args || [] }))
        .map(matchLines);

    // console.log(contentLines);

    return {
        id,
        type: 'item-card',
        level,
        filtering,
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
            contents: groupTableLines(contentLines),
            icon: iconMap[icon_front || 'ace'].path,
            code: code,
            reference,
        },
    };
};

const matchReferences = (item) => {
    if (item?.id in refList) {
        console.log('MATCHING REFERENCES FOR', item.id);
        item.card.reference = item.card.reference.concat(refList[item.id]);
    }
    return item;
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
            return tablerow(arg, 'header');
        case 'tablerow':
        case 'row':
        case 'tr':
            return tablerow(arg, 'row');
        case 'pftrait':
            // console.log(arg);

            return pftrait(arg);
        default:
            return '';
    }
};

const groupTableLines = (lines) => {
    if (lines.length === 0) return [];

    const groups = [];

    let queue = [];
    lines.forEach((line) => {
        if (line.startsWith('<t')) {
            queue.push(line);
        } else {
            if (queue.length) {
                groups.push(queue);
                queue = [];
            }
            groups.push([line]);
        }
    });

    return groups.map((group) => {
        if (group.length === 1) return group[0];
        const [header, ...rows] = group;
        return `<table class='card-element card-table'>
            <thead>${header}</thead>
            <tbody>${rows.join('\n')}</tbody>
        </table>`;
    });
};
