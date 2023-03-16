const { template, compile } = require('handlebars');
const { list } = require('../card/parts/list');
const { colatePages } = require('../pageManager/colatePages');
const { arrayToObject, bucketArray } = require('../util/arrays');
const { cape } = require('../util/cape');
const { PageNode } = require('./classes');
const { composeAsset } = require('./composer/asset');
const { composeCard } = require('./composer/card');
const { composeDefinition } = require('./composer/definition');
const { composeMDX } = require('./composer/mdx');

const navigationDividers = [
    {
        id: 'character-options',
        name: 'Character Options',
        slug: '',
        depth: 1,
        weight: 1_000,
        children: [],
    },
    {
        id: 'magic',
        name: 'Magic',
        slug: '',
        depth: 1,
        weight: 2_000,
        children: [],
    },
    {
        id: 'alchemy',
        name: 'Alchemy',
        slug: '',
        depth: 1,
        weight: 3_000,
        children: [],
    },
    {
        id: 'gear',
        name: 'Adventuring Gear',
        slug: '',
        depth: 1,
        weight: 4_000,
        children: [],
    },
    {
        id: 'wonderous-items',
        name: 'Magical Equipment',
        slug: '',
        depth: 1,
        weight: 5_000,
        children: [],
    },
    {
        id: 'eberron',
        name: 'Eberron',
        slug: '',
        depth: 1,
        weight: 10_000,
        children: [],
    },
];

class Kaiser {
    constructor() {
        const target = process.argv[2] || 'dd';
        console.time('kaiser-constructor');
        const coreData = colatePages(target);

        console.log('Parsing', Object.keys(coreData));

        this.data = {
            definition: composeDefinition(coreData.definition || []),
            itemCard: composeCard(coreData.item || []),
            mdx: composeMDX(coreData.mdx || []),
            asset: composeAsset(coreData.asset || []),
        };

        /* Prepare Navigation Sidebar data */

        //Create flat array of all pageNodes
        const nodeArr = Object.values(this.data)
            .flatMap((e) => e.list.map((x) => x.node))
            .filter((e) => e)
            .sort(sortBreadcrumb);

        //Place children with parent pages
        for (var i = 1; i < 10; i++) {
            const currLevel = nodeArr.filter((e) => e.path.length === i);
            console.log(
                'working on level',
                i,
                currLevel.map((n) => n.name)
            );
            currLevel.forEach((n) =>
                nodeArr.forEach((fullNode) => n.putChild(fullNode))
            );
        }

        //Build navigation template-usable array
        this.navigationTree = nodeArr
            .filter((e) => e.path.length === 1)
            .sort(PageNode.sort)
            .map(makeChildNode)
            .concat(navigationDividers)
            .sort(PageNode.sort);

        //Flatten nav tree for paging

        this.pagingMap = this.navigationTree
            .flatMap((n) => flattenNavTree(n, []))
            .filter((n) => n.slug)
            .reduce((mp = {}, curr, i, arr) => {
                const pIndex = i - 1 < 0 ? arr.length - 1 : i - 1;
                const nIndex = i + 1 >= arr.length ? 0 : i + 1;
                const prev = arr[pIndex];
                const next = arr[nIndex];
                mp[curr.slug] = { prev, next, slug: curr.slug };
                return mp;
            }, {});

        console.timeEnd('kaiser-constructor');
    }

    fillMDX(compileFn) {
        this.data.mdx.fillPages(compileFn, this.data.itemCard);
    }

    buildPages(compileFn) {
        Object.values(this.data)
            .filter((e) => e.buildPages && typeof e.buildPages === 'function')
            .forEach(({ buildPages }) => buildPages(buildPagesFn(compileFn)));

        this.pageList = Object.values(this.data)
            .flatMap((e) => e.list)
            .filter((e) => {
                const { id, html } = e;
                if (html && typeof html === 'string') {
                    // console.log('--- page', id, html.length);
                    // if (temp.id === 'detectChaos') console.log(html);
                }
                return e?.node?.slug;
            });
    }

    buildBlocks(compileFn) {
        Object.values(this.data)
            .filter((e) => e.buildBlocks && typeof e.buildBlocks === 'function')
            .forEach(({ buildBlocks }) =>
                buildBlocks(buildBlocksFn(compileFn))
            );

        const blockList = Object.values(this.data)
            .flatMap((e) => e.list)
            .map((e) => {
                const { id, block } = e;
                if (block && typeof block === 'string') {
                    // console.log('--- block', id, block.length);
                }
                return block;
            })
            .filter((e) => typeof e === 'object');

        this.blockBucket = bucketArray(blockList, 'type');
    }

    buildTooltips(compileFn) {
        Object.values(this.data)
            .filter(
                (e) => e.buildTooltips && typeof e.buildTooltips === 'function'
            )
            .forEach(({ buildTooltips }) => {
                buildTooltips(buildTooltipsFn(compileFn));
            });

        const tooltipList = Object.values(this.data)
            .flatMap((e) => e.list)
            .map((e) => {
                const { id, tooltip } = e;
                if (tooltip && typeof tooltip === 'string') {
                    // console.log('--- tooltip', id, tooltip.length);
                }
                return tooltip;
            })
            .filter((e) => typeof e === 'object');

        this.tooltipBucket = bucketArray(tooltipList, 'type');
    }

    buildInlineRefs(compileFn) {
        Object.values(this.data)
            .filter(
                (e) =>
                    e.buildInlineRefs && typeof e.buildInlineRefs === 'function'
            )
            .forEach(({ buildInlineRefs }) => {
                buildInlineRefs(buildInlineRefsFn(compileFn));
            });

        const inlineRefList = Object.values(this.data)
            .flatMap((e) => e.list)
            .map((e) => {
                const { id, inlineRef } = e;
                if (inlineRef && typeof inlineRef === 'string') {
                    // console.log('--- inlineRef', id, inlineRef.length);
                }
                return inlineRef;
            })
            .filter((e) => typeof e === 'object');

        this.inlineRefBucket = bucketArray(inlineRefList, 'type');
    }

    applyReferences2Cards() {
        const refableCards = this.data.itemCard.list.filter(
            (e) =>
                Array.isArray(e.card.reference) && e.card.reference.length > 0
        );

        refableCards.forEach((rCard) => {
            // console.log('REFING', rCard.id, rCard.card.reference);
            rCard.card.reference = rCard.card.reference
                .flatMap((r) => this.data.itemCard.findWithComplexSearch(r))
                .filter((r) => r)
                .map((r) => `<div>${r.inlineRef.index}</div>`);
        });

        refableCards.map((rCard) => {
            if (rCard.block.index.includes(`<div class='reference'></div>`))
                // console.log('FOUND REFERENCE PART', rCard.id);
                rCard.block.index = rCard.block.index.replace(
                    `<div class='reference'></div>`,
                    `<svg class="card-element card-ruler-line" height="1" width="100" viewBox="0 0 100 1" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="0,0 100,0.5 0,1" fill="{color}"></polyline>
                </svg>
                <div class='reference'>
                    ${rCard.card.reference.join('\n')}
                </div>`
                );
        });
    }

    getTooltip(match) {
        const tipDef = prepareTipDef(match);

        /* Fix TYPE shortcuts to standard lookup */

        if (!tipDef || typeof tipDef !== 'object' || !tipDef.id) {
            console.error('TOOLTIP ERROR', match);
            return 'TOOLTIP ERROR';
        }
        const { type: _type = '', id: tipId = '', options = [] } = tipDef;

        //Switch type to default value of definition
        let type = fixTypeShortcuts(_type);

        let tipTypeArr = this.tooltipBucket[type];
        if (!tipTypeArr) return '[' + type + '.' + tipId + ']';

        const matchedTooltip = tipTypeArr.find(
            ({ id, altId }) => id === tipId || altId.includes(tipId)
        );

        const optionStr = options
            .filter((e) => 'afp'.includes(e))
            .sort()
            .join('');
        console.log('TOOLTIP MATCHED', matchedTooltip.index, optionStr);
        switch (optionStr) {
            case 'a': // abbreviation
            case 'f': // formal
            case 'p': // plural

            case 'af': // abbreviation + formal
            case 'ap': // abbreviation + plural

            case 'fp': // formal + plural

            case 'afp': // abbreviation + formal + plural
                return matchedTooltip[optionStr];
        }

        return matchedTooltip.index;
    }

    getBlock(match) {
        const tipDef = prepareTipDef(match);

        /* Fix TYPE shortcuts to standard lookup */

        if (!tipDef || typeof tipDef !== 'object' || !tipDef.id) {
            console.error('BLOCK ERROR', match);
            return 'BLOCK ERROR';
        }
        const { type: _type = '', id: tipId = '', options = [] } = tipDef;

        //Switch type to default value of definition
        let type = fixTypeShortcuts(_type);

        let tipTypeArr = this.blockBucket[type];
        if (!tipTypeArr) return '[' + type + '.' + tipId + ']';

        const matchedBlock = tipTypeArr.find(
            ({ id, altId }) => id === tipId || altId.includes(tipId)
        );

        const optionStr = options
            .filter((e) => e)
            .sort()
            .join('');
        console.log('BLOCK MATCHED', matchedBlock.index, optionStr);

        // TODO handle block options

        return matchedBlock.index;
    }
}

const makeChildNode = (n) => ({
    id: n.slug,
    name: n.navName,
    slug: n.slug,
    depth: n.depth - 1,
    weight: n.weight,
    children: n.navigationArray.map(makeChildNode),
});

const flattenNavTree = (node, arr = []) => {
    arr.push(node);
    node.children.forEach((c) => flattenNavTree(c, arr));

    return arr;
};

const sortBreadcrumb = (a, b) => {
    const apl = a?.path?.length;
    const bpl = b?.path?.lengthl;
    if (!(apl > 0)) return 1;
    if (!(bpl > 0)) return -1;
    return bpl - apl;
};

const prepareTipDef = (match) => {
    const args = match.split('|');
    if (args.length === 0) return match;

    const actions = splitAt(args[0]);
    if (actions.length !== 2) return null;

    const options = args[1] ? splitAt(args[1]) : [];

    return {
        type: actions[0].trim(),
        id: actions[1].trim(),
        options,
        match,
    };
};

const splitAt = (str, pattern = ' ') => {
    const index = str.indexOf(pattern);
    return [str.substr(0, index).trim(), str.substr(index + 1).trim()];
};

const fixTypeShortcuts = (type) => {
    switch (type) {
        case '':
        case 'define':
        case 'def':
            return 'definition';
        case 'ct':
            return 'creatureType';
        case 'dt':
            return 'downtime';
        default:
            return type;
    }
};

const buildPagesFn = (compileFn) => (list, templateFileName) => {
    const renderTemplate = compileFn('templates/page/' + templateFileName);

    list.forEach((e) => (e.html = renderTemplate(e)));

    console.log(
        'compiled',
        String(list.length).padStart(3),
        templateFileName.padEnd(20),
        'pages'
    );

    return list;
};

const buildBlocksFn = (compileFn) => (list, templateFileName) => {
    const renderTemplate = compileFn('templates/block/' + templateFileName);

    list.forEach(
        (e) =>
            (e.block = {
                id: e.id,
                altId: cape(e.altId) || [],
                type: e.type,
                index: renderTemplate(e),
            })
    );

    console.log(
        'compiled',
        String(list.length).padStart(3),
        templateFileName.padEnd(20),
        'blocks'
    );

    return list;
};

const buildTooltipsFn = (compileFn) => (list, templateFileName) => {
    const renderTemplate = compileFn('templates/tooltip/' + templateFileName);

    list.forEach(
        (e) =>
            (e.tooltip = {
                id: e.id,
                altId: cape(e.altId) || [],
                type: e.type,
                index: renderTemplate({ ...e, tag: e?.tag?.toFormat() }),
                a: renderTemplate({ ...e, tag: e.tag.toFormat('a') }),
                f: renderTemplate({ ...e, tag: e.tag.toFormat('f') }),
                p: renderTemplate({ ...e, tag: e.tag.toFormat('p') }),
                af: renderTemplate({ ...e, tag: e.tag.toFormat('af') }),
                ap: renderTemplate({ ...e, tag: e.tag.toFormat('ap') }),
                fp: renderTemplate({ ...e, tag: e.tag.toFormat('fp') }),
                afp: renderTemplate({ ...e, tag: e.tag.toFormat('afp') }),
            })
    );

    console.log(
        'compiled',
        String(list.length).padStart(3),
        templateFileName.padEnd(20),
        'tooltips'
    );

    return list;
};

const buildInlineRefsFn = (compileFn) => (list, templateFileName) => {
    const renderTemplate = compileFn(
        'templates/inline-ref/' + templateFileName
    );

    list.forEach(
        (e) =>
            (e.inlineRef = {
                id: e.id,
                type: e.type,
                index: renderTemplate(e),
            })
    );

    console.log(
        'compiled',
        String(list.length).padStart(3),
        templateFileName.padEnd(20),
        'inlineRefs'
    );

    return list;
};

exports.kaiser = new Kaiser();
