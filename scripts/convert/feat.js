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
    ).then((result) =>
        (singletonList = result
            .flat()
            .filter((e) => e.generic !== 'G')
            .map(convertFeat)).sort((a, b) => a.id.localeCompare(b.id))
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

    // SET COLOR

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

const getColor = ({ traits }) => {
    let featType = 'ancestry';

    //Check for Class Feats
    if (traits.some((t) => classList.includes(t))) {
        featType = 'class';
    }

    // Check for Archetype
    if (traits.includes('archetype')) {
        featType = 'archetype';
        if (traits.includes('dedication')) featType = 'dedication';
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
            return '#F57C00';
        case 'class':
        case 'archetype':
        case 'dedication':
            return '#37474F';
        case 'general':
        case 'skill':
            return '#E64A19';
        default:
            return '#F57C00';
    }
};

const getExtra = ({ special, leadsTo }) => {
    const lineArr = [];

    if (special) {
        lineArr.push(getTextEntries({ entries: special }));
    }

    if (leadsTo) {
        lineArr.push('section | Leads to');
        lineArr.push(
            leadsTo.map(
                (e) => `bullet | ${cleanContent([unpackText(e)]).join('')}`
            )
        );
    }

    return lineArr.flat();
};

const getContent = ({
    traits,
    trigger,
    prerequisites,
    requirements,
    frequency,
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

    if (frequency?.unit) {
        if (frequency.interval > 1)
            lineArr.push(
                `property | Frequency | once per ${frequency.interval} ${frequency.unit}s`
            );
        else lineArr.push(`property | Frequency | once per ${frequency.unit}`);
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
        if (traits.includes('dedication')) featType = 'dedication';
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
            return 'abstract-119';
        case 'class':
            return 'rank-1';
        case 'archetype':
            return 'rank-2';
        case 'dedication':
            return 'rank-3';
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
    let subFeatType = '';
    let className;

    //Check for Class Feats
    if (traits.some((t) => classList.includes(t))) {
        featType = 'class';
        className = traits.find((t) => classList.includes(t));
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

    // Check for Archetype
    if (traits.includes('archetype')) {
        featType = 'archetype';
        subFeatType = traits.includes('skill')
            ? 'skill'
            : traits.includes('dedication')
            ? 'dedication'
            : 'class';

        // console.log(fta?.archetype);
        if (fta?.archetype && Array.isArray(fta.archetype))
            className = fta.archetype?.join('-') || String(fta.archetype);
    }

    idArr.push(featType);

    const ancestryMatch = getMatchedAncestry(traits);
    if (ancestryMatch && ancestryMatch.length) idArr.push(ancestryMatch[0]);

    if (className) idArr.push(className);
    if (subFeatType) idArr.push(subFeatType);

    idArr.push(source.toLowerCase());

    idArr.push(name);

    return idArr
        .flat()
        .map((e) => kebabCase(unpackText(e)))
        .join('.');
};
