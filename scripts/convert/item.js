const { kebabCase } = require('lodash');
const { notSubset } = require('../../src/util/arrays');
const { toDashCase } = require('../../src/util/stringHelper');
const {
    initCard,
    getTextEntries,
    unpackText,
    parseFrequency,
} = require('../util/crobiUtil');
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
    card.reference = item.reference || [];

    // card.original = item;
    card.filtering = [`level-${item.level || 0}`];

    if (Array.isArray(item.traits))
        card.filtering = card.filtering.concat(item.traits);

    // SET NAME
    card.name = item.name;
    card.title = item.name;

    // SET CODE
    if (item.type === 'Rune') {
        card.title += ' Rune';
        card.code = 'rune ' + (item.level || '0');
        card.filtering.push('rune');
    } else if (item.type === 'Equipment') {
        card.code = 'equipment';
        card.filtering.push('equipment');
    } else {
        card.filtering.push('item');
        card.code = 'item ' + (item.level || '0');
    }

    // SET ICON
    card.icon_front = getIcon(item);

    // SET COLOR
    card.color = '#43A047';

    // SET ID
    card.id = getId(item);

    // SET CONTENT
    card.contents = getContent(item);

    // SET EXTRA
    if (notSubset(item.traits || [], ['unique', 'rare', 'uncommon']))
        card.filtering.push('common');
    if (item.category) {
        card.filtering.push(item.category);
        card.filtering.push(item.category+'-category');
    }
    if (item.subCategory) card.filtering.push(item.subCategory);
    if (item?.weaponData?.group)
        card.filtering.push(item.weaponData.group.split('|')[0]);
    if (item?.armorData?.group) card.filtering.push(item.armorData.group);
    card.level = item.level || 0;
    if (item?.appliesTo)
        item.appliesTo.forEach((app) =>
            card.filtering.push(`apply-${app.toLowerCase()}`)
        );

    card.filtering = card.filtering.filter((e) => e).map(toDashCase);
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
    shieldData,
    price,
    frequency,
    dragonmark,
    craftReq,
    usage,
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
    if (line !== 'property') lineArr.push(line);

    line = 'property';
    if (usage) {
        line += ` | Usage | ${usage}`;
        if (item.appliesTo) {
            line += ` | Application | ${item.appliesTo
                .map((app) => app.toLowerCase())
                .join(', ')}`;
        }
    }
    if (line !== 'property') lineArr.push(line);

    line = 'property';
    if (price) {
        line += ` | Price | ${price.amount} ${price.coin}`;
        line += ` | Crafting | ${Math.floor(Number(price.amount) * 0.75)} ${
            price.coin
        }${craftReq ? ` (${craftReq})` : ''}`;
    }
    if (line !== 'property') lineArr.push(line);

    if (category === 'Weapon') {
        line = 'property';
        if (category) line += ` | Category | ${subCategory} ${category}`;
        if (weaponData?.group)
            line += ` | Group | ${weaponData.group.split('|')[0]}`;

        if (line !== 'property') lineArr.push(line);

        line = 'property';
        if (weaponData?.damage)
            line += ` | Damage | ${weaponData.damage} ${weaponData.damageType}`;
        if (weaponData?.reload) line += ` | Reload | ${weaponData.reload}`;
        if (line !== 'property') lineArr.push(line);
    }

    if (category === 'Armor' && armorData) {
        line = 'property';
        if (armorData.ac) line += ` | Category | ${subCategory} Armor`;
        if (armorData?.group) line += ` | Group | ${armorData.group}`;

        if (line !== 'property') lineArr.push(line);

        let armorHead = 'tablehead';
        line = 'row';
        if (armorData.ac || armorData.ac === 0) {
            line += ` | +${armorData.ac}`;
            armorHead += ` | AC Bonus`;
        }
        if (armorData.dexCap || armorData.dexCap === 0) {
            line += ` | +${armorData.dexCap}`;
            armorHead += ` | Dex Cap`;
        }
        if (armorData.str) {
            line += ` | ${armorData.str}`;
            armorHead += ` | Str Req.`;
        }
        if (armorData.checkPen) {
            line += ` | --${armorData.checkPen}`;
            armorHead += ` | Check Pen.`;
        }
        if (armorData.speedPen) {
            line += ` | --${armorData.speedPen} ft.`;
            armorHead += ` | Spd Pen.`;
        }
        if (line !== 'row') {
            lineArr.push(armorHead);
            lineArr.push(line);
        }
    }

    if (category === 'Shield' && shieldData) {

        let shieldHead = 'tablehead';
        line = 'row';
        if (shieldData.ac || shieldData.ac === 0) {
            line += ` | +${shieldData.ac}`;
            shieldHead += ` | AC Bonus`;
        }
        if (shieldData.hardness) {
            line += ` | +${shieldData.hardness}`;
            shieldHead += ` | Hardness`;
        }
        if (shieldData.hp) {
            line += ` | ${shieldData.hp}`;
            shieldHead += ` | HP`;
        }
        if (shieldData.bt) {
            line += ` | ${shieldData.bt}`;
            shieldHead += ` | BT.`;
        }
        if (shieldData.speedPen) {
            line += ` | --${shieldData.speedPen} ft.`;
            shieldHead += ` | Spd Pen.`;
        }
        if (line !== 'row') {
            lineArr.push(shieldHead);
            lineArr.push(line);
        }
    }

    if (frequency) lineArr.push(parseFrequency(frequency));

    lineArr.push('rule');

    return lineArr
        .concat(getTextEntries(item))
        .concat(handleDragonmarkHeightened(dragonmark || {}))
        .map(reduceDC(item.level));
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

const reduceDC =
    (level = 0) =>
    (line) => {
        const dcReg =
            /(flat |flat check )?(DC|DC is) ([0-9]+)( flat| flat check)?/g;
        return line.replace(dcReg, (match, p1, p2, p3, p4) => {
            if (p1 || p4) return match;
            const oldDC = Number(p3);
            const levelBonus = Math.max(0, Math.floor((level - 4) / 3));

            if (oldDC)
                return `${p2} ${oldDC - (level || 0) + levelBonus}^[${oldDC}]^`;

            return match;
        });
    };

const getId = ({
    generic,
    genericItem,
    variantType,
    category,
    subCategory,
    type,
    source,
    ...item
}) => {
    const idArr = [
        type?.toLowerCase() || 'item',
        String(category).toLowerCase(),
    ];

    if (idArr[0] === idArr[1]) {
        idArr[0] = 'item';
    }

    if (subCategory) idArr.push(subCategory.toLowerCase());

    // Add name
    idArr.push(source.toLowerCase());
    idArr.push(item.name);

    return idArr
        .flat()
        .map((e) => kebabCase(unpackText(e)))
        .join('.');
};

const getIcon = ({ category, subCategory, usage, weaponData, ...item }) => {
    // if (typeof category !== 'string') return 'ERROR';
    switch (String(category).toLowerCase()) {
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
