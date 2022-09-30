const { kebabCase } = require('lodash');
const { toDashCase } = require('../../src/util/stringHelper');
const {
    initCard,
    getTextEntries,
    unpackText,
    parseActivity,
    parseSavingThrow,
    nthStr,
    cleanContent,
} = require('../util/crobiUtil');
const { DataUtil, SortUtil, Renderer } = require('../util/toolUtil');

const convertSpell2Save = async (items, saveFn) => {
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

    // SET CODE
    card.code = 'spell ' + item.level;

    if (item.traits.includes('cantrip')) {
        card.code = 'cantrip ' + item.level;
    }

    if (item.focus === true) {
        card.code = 'focus ' + item.level;
    }

    // SET ICON
    card.icon_front = 'ace';
    if (item.traits.includes('abjuration'))
        card.icon_front = 'spell-abjuration';
    if (item.traits.includes('conjuration'))
        card.icon_front = 'spell-conjuration';
    if (item.traits.includes('divination'))
        card.icon_front = 'spell-divination';
    if (item.traits.includes('enchantment'))
        card.icon_front = 'spell-enchantment';
    if (item.traits.includes('evocation')) card.icon_front = 'spell-evocation';
    if (item.traits.includes('illusion')) card.icon_front = 'spell-illusion';
    if (item.traits.includes('necromancy'))
        card.icon_front = 'spell-necromancy';
    if (item.traits.includes('transmutation'))
        card.icon_front = 'spell-transmutation';

    // SET ID
    card.id = getId(item);

    // SET CONTENT
    card.contents = cleanContent(getContent(item));

    return card;
};

const getContent = ({
    traits,
    traditions,
    components,
    cast,
    requirements,
    frequency,
    activity,
    trigger,
    range,
    targets,
    area,
    duration,
    savingThrow,
    heightened,
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

    if (traditions?.length)
        lineArr.push('property | Traditions | ' + traditions.join(', '));

    if (cast) {
        line = 'property | Cast | ' + parseActivity(cast);

        if (components?.length)
            line +=
                ' ' +
                components
                    .map((e) => e.join(' '))
                    .map((e) => `[${e}]`)
                    .join(' ');

        if (trigger) line += '; **Trigger** ' + trigger;
        if (requirements) line += '; **Requirements** ' + requirements;

        lineArr.push(line);
        line = '';
    }

    if (duration) lineArr.push(`property | Duration | ${duration.entry}`);

    if (savingThrow)
        lineArr.push(
            'property | Saving Throw | ' + parseSavingThrow(savingThrow)
        );

    if (range || targets || area) {
        line = 'property';

        if (range) {
            line += ' | Range | ';
            if (range.entry) line += range.entry;
            else if (range.unit === 'touch') line += 'touch';
            else line += `${range.number} ${range.unit}`;
        }

        if (area && targets) {
            line += ' | Area | ' + area.entry + ' **Targets** ' + targets;
        } else if (targets) {
            line += ' | Targets | ' + targets;
        } else if (area) line += `| Area | ${area.entry}`;

        lineArr.push(line);
    }

    

    lineArr.push('rule');

    // Handle Heightened Entries

    return lineArr
        .concat(getTextEntries(item))
        .concat(handleHeightened(heightened || {}));
};

const handleHeightened = ({ plusX, X: x }) => {
    const arr = ['fill', 'section | Heightened Spellcasting'];
    if (x) {
        return arr.concat(
            Object.keys(x).map((lvl) => {
                return `property | Heightened (${nthStr(lvl)}) | ${x[lvl]
                    .map((txt) =>
                        typeof txt === 'string' ? Renderer.stripTags(txt) : ''
                    )
                    .filter((e) => e)
                    .join('^^')}`;
            })
        );
    }

    if (plusX) {
        return arr.concat(
            Object.keys(plusX).map((lvl) => {
                return `property | Heightened (+${lvl}) | ${plusX[lvl]
                    .map((txt) =>
                        typeof txt === 'string' ? Renderer.stripTags(txt) : ''
                    )
                    .filter((e) => e)
                    .join('^^')}`;
            })
        );
    }

    return [];
};

const getId = ({ traits, source, focus, ...item }) => {
    const idArr = ['spell'];

    if (traits.includes('cantrip') && focus === true) {
        idArr.push('focus-cantrip');
    } else if (traits.includes('cantrip')) {
        idArr.push('cantrip');
    } else if (focus === true) {
        idArr.push('focus');
    } else {
        idArr.push('slot');
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
    convertSpell2Save,
};
