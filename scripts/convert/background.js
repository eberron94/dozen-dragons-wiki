const { kebabCase } = require('lodash');
const { notSubset } = require('../../src/util/arrays');
const { toDashCase } = require('../../src/util/stringHelper');
const {
    initCard,
    getTextEntries,
    unpackText,
    cape,
} = require('../util/crobiUtil');
const { DataUtil, SortUtil, Renderer } = require('../util/toolUtil');

const convertBackground2Save = async (items, saveFn) => {
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
    card.reference = [];
    // console.log('working on', item.name);
    card.reference = item.reference || [];

    // card.original = item;
    card.filtering = ['background'];

    if (notSubset(item.traits || [], ['unique', 'rare', 'uncommon'])) {
        item.traits = ['common'].concat(item.traits || []);
    }

    // SET NAME
    card.name = item.name;
    card.title = item.name;

    // SET CODE
    card.code = 'background';

    // SET ICON
    card.icon_front = 'notebook';

    // SET COLOR
    card.color = '#826754';

    // SET ID
    card.id = getId(item);

    // SET EXTRA
    if (item.skills)
        item.skills.forEach((s) => card.filtering.push(s.toLowerCase()));
    if (item.feat) {
        cape(item.feat).forEach((f) => {
            card.reference.push(`P::feat.skill.::.${toDashCase(unpackText(f))}`);
            card.filtering.push(f)
        });
    }

    if (Array.isArray(item.traits))
        card.filtering = card.filtering.concat(item.traits);

    card.filtering = card.filtering.filter((e) => e).map(toDashCase);

    // SET CONTENT
    card.contents = getContent(item);

    return card;
};

const getContent = ({ boosts, skills, lore, feat, ...item }) => {
    return getTextEntries(item);
    const lineArr = getTextEntries(item).concat('rule');
    // let line = '';

    if (boosts?.length)
        lineArr.push(
            `text | Choose two ability boosts. One must be to ${bootss[0]} or ${bootss[1]}, and one is a free ability boost.`
        );

    lineArr.push(
        `text | You're trained in ${skills[0]} and ${lore[0]} Lore. You gain the ${feat} skill feat.`
    );

    lineArr.push('rule');

    return lineArr.concat(getTextEntries(item));
};

const getId = ({ source, ...item }) => {
    const idArr = ['background'];

    // Add name
    idArr.push(source.toLowerCase());
    idArr.push(item.name);

    return idArr
        .flat()
        .map((e) => kebabCase(unpackText(e)))
        .join('.');
};

module.exports = {
    convertBackground2Save,
};
