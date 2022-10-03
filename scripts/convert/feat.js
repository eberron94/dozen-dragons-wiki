const { kebabCase } = require('lodash');
const { markup } = require('../../src/helper/markup');
const { toDashCase } = require('../../src/util/stringHelper');
const {
    initCard,
    getTextEntries,
    classList,
    parseActivity,
    getMatchedAncestry,
    unpackText,
    cleanContent,
} = require('../util/crobiUtil');
const { DataUtil, SortUtil, Renderer } = require('../util/toolUtil');

exports.convertFeats2Save = async (items, saveFn) => {
    let singletonList;
    await Promise.all(
        items.map((item) => DataUtil.item.expandVariants(item))
    ).then(
        (result) =>
            (singletonList = result
                .flat()
                .filter((e) => e.generic !== 'G')
                .map(convertFeat))
    );

    // console.log(singletonList);
    saveFn(singletonList);
};

const convertFeat = (item) => {
    const card = initCard();
    // console.log('working on', item.name);

    // SET NAME
    card.title = item.name;
    if (item.add_hash) card.title += ` (${item.add_hash})`;

    if (item.activity) card.title += ` ${parseActivity(item.activity)}`;

    // SET CODE
    card.code = 'feat ' + (item.level || '1');

    // SET ICON
    card.icon_front = getIcon(item);

    // SET ID
    card.id = getId(item);

    // SET CONTENT
    card.contents = getContent(item);

    // SET EXTRA
    card.level = item.level;
    if (item.special || item.leadsTo) card.extra = getExtra(item);

    return card;
};

const getExtra = ({ special, leadsTo }) => {
    const lineArr = [];

    if (special) {
        lineArr.push(getTextEntries({ entries: (special) }));
    }

    if (leadsTo) {
        lineArr.push('section | Leads to');
        lineArr.push(leadsTo.map((e) => `bullet | ${cleanContent([unpackText(e)]).join('')}`));
    }

    return lineArr.flat();
};

const getContent = ({
    traits,
    trigger,
    prerequisites,
    requirements,
    special,
    ...item
}) => {
    const lineArr = [];
    let line = '';

    if (traits?.length)
        lineArr.push(
            'pftrait | ' +
                traits
                    .map((t) => (t === 'half-elf' ? 'khoravar' : t))
                    .sort(SortUtil.sortTraits)
                    .join(' | ')
        );

    if (prerequisites) {
        lineArr.push(
            'property | Prerequisites | ' + Renderer.stripTags(prerequisites)
        );
    }

    if (requirements) {
        lineArr.push(
            'property | Requirements | ' + Renderer.stripTags(requirements)
        );
    }

    if (trigger) {
        lineArr.push('property | Trigger | ' + Renderer.stripTags(trigger));
    }

    lineArr.push('rule');

    return lineArr.concat(getTextEntries(item));
};

const getIcon = ({ traits }) => {
    let featType = 'ancestry';

    //Check for Class Feats
    if (traits.some((t) => classList.includes(t))) {
        featType = 'class';
    }

    // Check for Archetype
    if (traits.includes('archetype')) {
        featType = 'archetype';
    }

    // Check for General
    if (traits.includes('general')) {
        featType = 'general';
    }

    // Check for skill
    if (traits.includes('skill')) {
        featType = 'skill';
    }

    // Check for Archetype
    if (traits.includes('dragonmark')) {
        featType = 'dragonmark';
    }

    switch (featType) {
        case 'dragonmark':
        case 'class':
            return 'rank-2';
        case 'archetype':
            return 'rank-1';
        case 'general':
        case 'skill':
            return 'moebius-star';
        default:
            return 'azul-flake';
    }
};

const getId = ({ name, traits, featType: fta, source }) => {
    const idArr = ['feat'];
    let featType = 'ancestry';
    let className;

    //Check for Class Feats
    if (traits.some((t) => classList.includes(t))) {
        featType = 'class';
        className = traits.find((t) => classList.includes(t));
    }

    // Check for Archetype
    if (traits.includes('archetype')) {
        featType = 'archetype';
        // console.log(fta?.archetype);
        if (fta?.archetype && Array.isArray(fta.archetype))
            className = fta.archetype?.join('-') || String(fta.archetype);
    }

    // Check for General
    if (traits.includes('general')) {
        featType = 'general';
    }

    // Check for skill
    if (traits.includes('skill')) {
        featType = 'skill';
    }

    // Check for Archetype
    if (traits.includes('dragonmark')) {
        featType = 'dragonmark';
    }

    idArr.push(featType);

    const ancestryMatch = getMatchedAncestry(traits);
    if (ancestryMatch && ancestryMatch.length) idArr.push(ancestryMatch[0]);

    if (className) idArr.push(className);

    idArr.push(source.toLowerCase());

    idArr.push(name);

    return idArr
        .flat()
        .map((e) => kebabCase(unpackText(e)))
        .join('.');
};
