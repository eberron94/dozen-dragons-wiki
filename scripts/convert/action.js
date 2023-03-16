const { kebabCase } = require('lodash');
const { toDashCase } = require('../../src/util/stringHelper');
const {
    initCard,
    getTextEntries,
    unpackText,
    parseActivity,
} = require('../util/crobiUtil');
const { DataUtil, SortUtil, Renderer } = require('../util/toolUtil');

const convertActions2Save = async (items, saveFn) => {
    let singletonList;
    await Promise.all(
        items.map((item) => DataUtil.item.expandVariants(item))
    ).then(
        (result) =>
            (singletonList = result
                .flat()
                .filter((e) => e.generic !== 'G')
                .map(convertItem))
    );

    // console.log(singletonList);
    saveFn(singletonList);
};

const convertItem = (item) => {
    const card = initCard();
    // console.log('working on', item.name);

    // card.original = item;
    card.reference = item.reference || [];

    card.filtering = ['action'];
    if (Array.isArray(item.traits))
        card.filtering = card.filtering.concat(item.traits);


    const act = item.activity ? parseActivity(item.activity) : '';

    // SET NAME
    card.name = item.name;
    card.title = item.name;
    if (act.includes('[[')) card.title += ' ' + act;

    // SET CODE
    card.code = 'action';

    // SET COLOR
    card.color = '#B71C1C';

    // SET ICON
    card.icon_front = 'expander';

    // SET ID
    card.id = getId(item);

    // SET CONTENT
    card.contents = getContent(item);

    return card;
};

const getContent = ({
    traits,
    prerequisites,
    requirements,
    frequency,
    activity,
    trigger,
    teamwork,
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
    } else if (frequency?.entry) {
        lineArr.push(`property | Frequency | ${frequency.entry}`);
    }

    lineArr.push('rule');

    return lineArr.concat(getTextEntries(item));
};

const getId = ({ actionType, type, source, ...item }) => {
    const idArr = ['action'];

    if(item?.traits?.includes('downtime')) {
        idArr.push('downtime')
    }

    if (actionType) {
        Object.keys(actionType).forEach((key) => {
            switch (key) {
                case 'basic':
                    idArr.push('basic');
                    return;
                case 'skill':
                    idArr.push('skill');
                    if (actionType.skill.untrained) idArr.push('untrained');
                    if (actionType.skill.trained) idArr.push('trained');
                    if (actionType.skill.expert) idArr.push('expert');
                    if (actionType.skill.master) idArr.push('master');
                    if (actionType.skill.legendary) idArr.push('legendary');
                    return;
                case 'ancestry':
                    idArr.push(['ancestry', actionType.ancestry.pop()]);
                    return;
                case 'class':
                    idArr.push(['class', actionType.class.pop()]);
                    return;
                case 'subclass':
                    idArr.push(['subclass', actionType.subclass.pop()]);
                    return;
            }
        });
    }

    // Add name
    idArr.push(source.toLowerCase());
    idArr.push(item.name);

    return idArr
        .flat()
        .map((e) => kebabCase(unpackText(e)))
        .join('.');
};

module.exports = {
    convertActions2Save,
};
