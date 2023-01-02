const { kebabCase, cloneDeep } = require('lodash');
const { markup } = require('../../src/helper/markup');
const { notSubset } = require('../../src/util/arrays');
const { toDashCase } = require('../../src/util/stringHelper');
const {
    initCard,
    getTextEntries,
    classList,
    parseActivity,
    getMatchedAncestry,
    unpackText,
    cleanContent,
    skillList,
} = require('../util/crobiUtil');
const { DataUtil, SortUtil, Renderer } = require('../util/toolUtil');

exports.convertFeats2Save = async (items, archetypes, saveFn) => {
    let singletonList;

    await Promise.all(
        items.map((item) => DataUtil.item.expandVariants(item))
    ).then((result) =>
        (singletonList = result
            .flat()
            .filter((e) => e.generic !== 'G')
            .concat(accordionArchetype(items, archetypes))
            .map(convertFeat)).sort((a, b) => a.id.localeCompare(b.id))
    );

    // console.log(singletonList);
    saveFn(singletonList);
};

const accordionArchetype = (items, archetypes) => {
    const archetypeExtras = archetypes
        .filter((archetype) => archetype?.extraFeats?.length)
        .flatMap(parseArchetypeExtra);

    return archetypeExtras
        .flatMap(populateArchetypeExtra(items))
        .filter((e) => e);
};

const parseArchetypeExtra = ({ name: dedicationName, extraFeats }) => {
    const parsedFeats = [];

    extraFeats.forEach((str) => {
        const [level, name, source] = str.split('|');
        parsedFeats.push({ dedicationName, level, name, source });
    });

    return parsedFeats;
};

const populateArchetypeExtra =
    (items) =>
    ({ dedicationName, level, name, source }) => {
        // console.log(`Looking for ${name} ${source}`);
        const foundFeat = items.find((item) => {
            const cannonName = item.add_hash
                ? `${item.name} (${item.add_hash})`
                : item.name;
            return (
                cannonName.toLowerCase() === name.toLowerCase() &&
                item.source.toLowerCase() === source.toLowerCase()
            );
        });

        if (!foundFeat) {
            console.log(
                `Match FAILED for ${name} to ${dedicationName} archetype`
            );
            return null;
        }
        const archFeat = cloneDeep(foundFeat);
        if (!archFeat.traits) console.log(archFeat);

        // Apply Trait changes
        archFeat.traits.push('archetype');
        archFeat.traits = archFeat.traits.filter((t) => !classList.includes(t));

        // Update Level
        archFeat.level = level;

        // Add or update prereq
        if (archFeat.prerequisites)
            archFeat.prerequisites =
                dedicationName + ' Dedication, ' + archFeat.prerequisites;
        else archFeat.prerequisites = dedicationName + ' Dedication';

        // Add Feat Type
        archFeat.featType = { archetype: [dedicationName] };

        // console.log(`Matched ${name} to ${dedicationName} archetype`);

        return archFeat;
    };

const convertFeat = (item) => {
    const card = initCard();
    // console.log('working on', item.name);
    card.reference = item.reference || [];

    card.filtering = ['feat', `feat-${item.level}`];
    if (Array.isArray(item.traits))
        card.filtering = card.filtering.concat(item.traits);

    // SET NAME
    card.name = item.name;
    card.title = item.name;
    // if (item.add_hash) card.title += ` (${item.add_hash})`;

    if (item.activity) card.title += ` ${parseActivity(item.activity)}`;

    // SET COLOR
    card.color = getColor(item);

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
    if (notSubset(item.traits, ['unique', 'rare', 'uncommon']))
        card.filtering.push('common');
    if (getFeatType(item) === 'skill') {
        // Add tags for Prereq skill
        skillList
            .filter(
                (skill) =>
                    item.prerequisites &&
                    item.prerequisites.toLowerCase().includes(skill)
            )
            .forEach((skill) => card.filtering.push(skill));
    }
    // if (item.special || item.leadsTo) card.extra = getExtra(item);

    return card;
};

const getFeatType = ({ traits }) => {
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

    return featType;
};

const getColor = (item) => {
    switch (getFeatType(item)) {
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
    access,
    prerequisites,
    requirements,
    frequency,
    special,
    dragonmark,
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

    if (access) {
        lineArr.push('property | Access | ' + Renderer.stripTags(access));
    }

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
    } else if (frequency?.entry) {
        lineArr.push(`property | Frequency | ${frequency.entry}`);
    }

    lineArr.push('rule');

    return lineArr
        .concat(getTextEntries(item))
        .concat(handleDragonmarkHeightened(dragonmark || {}));
};

const handleDragonmarkHeightened = ({
    least,
    lesser,
    greater,
    grand,
    siberys,
}) => {
    const arr = ['fill', 'section | Power of the Dragonmark'];

    if (least)
        arr.push(`property | Least Dragonmark | ${Renderer.stripTags(least)}`);
    if (lesser)
        arr.push(
            `property | Lesser Dragonmark | ${Renderer.stripTags(lesser)}`
        );
    if (greater)
        arr.push(
            `property | Greater Dragonmark | ${Renderer.stripTags(greater)}`
        );
    if (grand)
        arr.push(`property | Grand Dragonmark | ${Renderer.stripTags(grand)}`);
    if (siberys)
        arr.push(
            `property | Siberys Dragonmark | ${Renderer.stripTags(siberys)}`
        );

    if (arr.length > 2) return arr;
    else return [];
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
