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

const convertLanguage2Save = async (items, saveFn) => {
    let singletonList;
    await Promise.all(
        items.filter(i=>i.source==='brew').map((item) => DataUtil.item.expandVariants(item))
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
    card.filtering = ['language'];

    if (notSubset(item.traits || [], ['unique', 'rare', 'uncommon'])) {
        item.traits = ['common'].concat(item.traits || []);
    }

    // SET NAME
    card.name = item.name;
    card.title = item.name;

    // SET CODE
    card.code = 'language';

    // SET ICON
    card.icon_front = 'pencil';

    // SET COLOR
    card.color = '#826754';

    // SET ID
    card.id = getId(item);

    // SET EXTRA

    if (Array.isArray(item.traits))
        card.filtering = card.filtering.concat(item.traits);

    card.filtering = card.filtering.filter((e) => e).map(toDashCase);

    // SET CONTENT
    card.contents = getContent(item);

    return card;
};

const getContent = ({
    traits,
    languageParent,
    languageScript,
    languagePractice,
    ...item
}) => {
    // return getTextEntries(item);
    const lineArr = [];
    // let line = '';

    if (traits?.length)
        lineArr.push(
            'pftrait | ' + traits.sort(SortUtil.sortTraits).join(' | ')
        );

    lineArr.push(`property | Parent Language | ${languageParent || 'none'}`);
    lineArr.push(`property | Script | ${languageScript || 'none'}`);
    lineArr.push(`property | Practices By | ${languagePractice || 'unknown'}`);

    lineArr.push('rule');

    return lineArr.concat(getTextEntries(item));
};

const getId = ({ source, ...item }) => {
    const idArr = ['language'];

    // Add name
    idArr.push(source?.toLowerCase() || 'brew');
    idArr.push(item.name);

    return idArr
        .flat()
        .map((e) => kebabCase(unpackText(e)))
        .join('.');
};

module.exports = {
    convertLanguage2Save,
};
