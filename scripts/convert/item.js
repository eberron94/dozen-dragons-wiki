const { kebabCase } = require('lodash');
const { toDashCase } = require('../../src/util/stringHelper');
const { initCard, getTextEntries } = require('../util/crobiUtil');
const { DataUtil, SortUtil, Renderer } = require('../util/toolUtil');

const convertItems2Save = async (items, saveFn) => {
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

    // SET NAME
    card.title = item.name;

    if (item.type === 'Rune') card.title += ' Rune';

    // SET CODE
    if (item.type === 'Equipment') card.code = 'equipment';
    else card.code = 'item ' + (item.level || '0');

    // SET ICON
    card.icon_front = getIcon(item);

    // SET ID
    card.id = getId(item);

    // SET CONTENT
    card.contents = getContent(item);

    return card;
};

const getContent = ({
    traits,
    bulk,
    hands,
    category,
    subCategory,
    weaponData,
    armorData,
    price,
    ...item
}) => {
    const lineArr = [];
    let line = '';

    if (traits?.length)
        lineArr.push(
            'pftrait | ' + traits.sort(SortUtil.sortTraits).join(' | ')
        );

    line = 'property';
    if (hands) line += ` | Hands | ${hands}`;
    if (bulk) line += ` | Bulk | ${bulk}`;
    if (price) line += ` | Price | ${price.amount} ${price.coin}`;
    if (line !== 'property') lineArr.push(line);

    if (category === 'Weapon') {
        line = 'property';
        if (category) line += ` | Category | ${subCategory} ${category}`;
        if (weaponData?.group)
            line += ` | Group | ${weaponData.group.split('|')[0]}`;

        if (line !== 'property') lineArr.push(line);
    }

    if (category === 'Armor' && armorData) {
        line = 'property';
        if (armorData.ac) line += ` | AC Bonus | +${armorData.ac}`;
        if (armorData.dexCap) line += ` | Dex Cap | +${armorData.dexCap}`;
        if (line !== 'property') lineArr.push(line);

        line = 'property';
        if (armorData.str) line += ` | Str Req. | ${armorData.str}`;
        if (armorData.checkPen)
            line += ` | Check Penalty | --${armorData.checkPen}`;
        if (armorData.speedPen)
            line += ` | Speed Penalty | --${armorData.speedPen} ft.`;
        if (line !== 'property') lineArr.push(line);

        line = 'property';
        if (armorData.ac) line += ` | Category | ${subCategory} Armor`;
        if (armorData?.group) line += ` | Group | ${armorData.group}`;
        if (line !== 'property') lineArr.push(line);
    }

    lineArr.push('rule');

    return lineArr.concat(getTextEntries(item));
};

const getId = ({
    generic,
    genericItem,
    variantType,
    category,
    subCategory,
    type,
    ...item
}) => {
    const idArr = [type?.toLowerCase() || 'item', category.toLowerCase()];

    if (idArr[0] === idArr[1]) {
        idArr[0] = 'item';
    }

    if (subCategory) idArr.push(subCategory.toLowerCase());

    // Add name
    idArr.push(item.name);

    return idArr.map((e) => kebabCase(e)).join('.');
};

const getIcon = ({ category, subCategory, usage, weaponData, ...item }) => {
    switch (category.toLowerCase()) {
        case 'bomb':
            return 'unlit-bomb';
        case 'material':
            return 'gold-bar';
        case 'shield':
            return 'shield';
        case 'adventuring gear':
            return 'backpack';
        case 'snare':
            return 'wolf-trap';
        case 'oil':
            return 'water-flask';
        case 'rune':
            return 'triple-corn';
        case 'staff':
            return 'crystal-cluster';
        case 'apex':
            return 'twirl-center';
        case 'elixir':
            return 'round-bottom-flask';
        case 'ammunition':
            return 'ammo-box';
        case 'poison':
            return 'poison-bottle';
        case 'held':
            return 'usable';
        case 'companion':
            return 'wolf-head';
        case 'potion':
            return 'potion-ball';
        case 'talisman':
            return 'linked-rings';
        case 'wand':
            return 'lunar-wand';
        case 'tool':
            return 'tinker';
        case 'scroll':
            return 'tied-scroll';
        case 'consumable':
            return 'card-burn';
        case 'structure':
            return 'defensive-wall';

        case 'armor':
            switch (subCategory?.toLowerCase()) {
                case 'unarmored':
                    return 'ninja-armor';
                case 'light':
                    return 'leather-armor';
                case 'medium':
                    return 'abdominal-armor';
                case 'heavy':
                    return 'lamellar';
            }
            return 'chain-mail';

        case 'weapon':
            switch (weaponData?.group.toLowerCase()) {
                case 'axe':
                    return 'sharp-axe';
                case 'firearm|g&g':
                    return 'blunderbuss';
                case 'club':
                    return 'wood-club';
                case 'bow':
                    return 'crossbow';
                case 'sword':
                    return 'broadsword';
                case 'sling':
                    return 'sling';
                case 'knife':
                    return 'daggers';
                case 'flail':
                    return 'flail';
                case 'dart':
                    return 'dart';
                case 'polearm':
                    return 'bo';
                case 'spear':
                    return 'trident';
                case 'brawling':
                    return 'brass-knuckles';
                case 'pick':
                    return 'war-pick';
                case 'hammer':
                    return 'warhammer';
                case 'shield':
                    return 'bordered-shield';
            }
            return 'wave-strike';

        case 'worn':
            switch (usage.replace('worn', '').trim()) {
                case 'eyepiece':
                    return 'steampunk-goggles';
                case 'armbands':
                    return 'arm-bandage';
                case 'belt':
                    return 'belt-armor';
                case 'cloak':
                    return 'cloak';
                case 'shoes':
                    return 'boots';
                case 'bracers':
                    return 'bracers';
                case 'garment':
                    return 'sleeveless-jacket';
                case 'collar':
                    return 'spiked-collar';
                case 'mask':
                    return 'curly-mask';
                case 'gloves':
                    return 'gloves';
                case 'headwear':
                    return 'hood';
                case 'backpack':
                    return 'backpack';
                case 'circlet':
                    return 'crenel-crown';
            }
            return 'anatomy';
    }
};

module.exports = {
    convertItems2Save,
};