const { toInteger } = require('lodash');
const { Renderer } = require('./toolUtil');

const initCard = () => ({
    id: '',
    color: '',
    name: '',
    title: '',
    icon_front: '',
    code: '',
    contents: [],
    reference: [],
});

const skillList = [
    'acrobatics',
    'arcana',
    'athletics',
    'crafting',
    'deception',
    'diplomacy',
    'insight',
    'intimidation',
    'medicine',
    'nature',
    'occultism',
    'performance',
    'religion',
    'society',
    'stealth',
    'survival',
    'thievery',
];

const classList = [
    'alchemist',
    'barbarian',
    'bard',
    'champion',
    'cleric',
    'druid',
    'fighter',
    'gunslinger',
    'inventor',
    'investigator',
    'magus',
    'monk',
    'oracle',
    'psychic',
    'ranger',
    'rogue',
    'sorcerer',
    'summoner',
    'swashbuckler',
    'thaumaturge',
    'witch',
    'wizard',
];

getMatchedClass = (traits) => {
    return classList.filter((e) => traits.includes(e));
};

const ancestryList = [
    'dwarf',
    'elf',
    'gnome',
    'goblin',
    'half-orc',
    'halfling',
    'human',
    'half-elf',
    'bugbear',
    'changeling',
    'hobgoblin',
    'kobold',
    'orc',
    'shifter',
    'warforged',
    'catfolk',
    'dragonborn',
    'gnoll',
    'lizardfolk',
    'automaton',
    'fleshwarp',
    'sprite',
    'aasimar',
    'kalashtar',
    'tiefling',
];

getMatchedAncestry = (traits) => {
    return ancestryList.filter((e) => traits.includes(e));
};
const getTextEntries = ({ entries = [] }) => {
    const lineArr = [];

    if (Array.isArray(entries))
        entries
            .map((e) => (typeof e === 'string' ? parseUp(e) : e))
            .forEach((e) => {
                if (typeof e === 'string')
                    lineArr.push('text | ' + Renderer.stripTags(String(e)));

                if (typeof e === 'object')
                    switch (e.type) {
                        case 'list':
                            e.items.forEach((l) =>
                                lineArr.push(
                                    'bullet | ' + Renderer.stripTags(String(l))
                                )
                            );
                            break;
                        case 'successDegree':
                            lineArr.push('fill');
                            Object.entries(e.entries).forEach(([key, value]) =>
                                lineArr.push(
                                    `property | ${key} | ${Renderer.stripTags(
                                        value
                                    )}`
                                )
                            );
                            lineArr.push('fill');
                            break;
                        case 'affliction':
                            lineArr.push('fill');
                            lineArr.push('section | Affliction');
                            lineArr.push(
                                `table | Saving Throw | Onset | Max Dur.`
                            );
                            lineArr.push(
                                `row | ${e.savingThrow} DC ${e.DC} | ${
                                    e.onset || 'immediate'
                                } | ${e.maxDuration}`
                            );
                            e.stages.forEach(({ stage, duration, entry }) =>
                                lineArr.push(
                                    `bullet | Stage ${stage} | ${Renderer.stripTags(
                                        entry
                                    )} (${duration | '???'})`
                                )
                            );
                            lineArr.push('rule');
                            lineArr.push('fill');
                            break;
                        case 'ability':
                            lineArr.push('fill');
                            let line = (e.name || 'Activate') + ' ';
                            if (e.activity) line += parseActivity(e.activity);
                            if (e.components)
                                line +=
                                    ' ' +
                                    e.components
                                        .map((c) =>
                                            Renderer.stripTags(
                                                c.replace(/[()]/g, '')
                                            )
                                        )
                                        .join(', ');
                            lineArr.push(
                                `section | ` + line.replace(/ +/g, ' ')
                            );

                            if (e.trigger)
                                lineArr.push(
                                    `property | Trigger | ${Renderer.stripTags(
                                        e.trigger
                                    )}`
                                );
                            if (e.frequency)
                                lineArr.push(parseFrequency(e.frequency));
                            if (e.entries) {
                                lineArr.push(getTextEntries(e));
                            }
                            lineArr.push('rule');
                            lineArr.push('fill');
                            break;
                        case 'table':
                            //
                            if (e.rows.every((row) => Array.isArray(row)))
                                e.rows.forEach((row, i) => {
                                    lineArr.push(
                                        (i === 0 ? 'tablehead | ' : 'row | ') +
                                            row.join(' | ')
                                    );
                                });
                            else lineArr.push('text | See book for table');

                            break;
                    }
            });

    return lineArr.flat().map((str) => str.replace(/[<>]/g, ''));
};

const parseActivity = ({ number, unit, entry }) => {
    switch (number + unit) {
        case '1action':
            return '[[one-action]]';
        case '2action':
            return '[[two-action]]';
        case '3action':
            return '[[three-action]]';
        case '1free':
            return '[[free-action]]';
        case '1reaction':
            return '[[reaction]]';
    }

    if (entry) return parseUp(entry);
    return number + ' ' + unit;
};

const parseSavingThrow = ({ type, basic }) => {
    return (
        (basic ? 'basic ' : '') +
        type
            .map((t) => {
                switch (t.toLowerCase()) {
                    case 'f':
                    case 'fortitude':
                        return 'Fortitude';
                    case 'r':
                    case 'reflex':
                        return 'Reflex';
                    case 'w':
                    case 'will':
                        return 'Will';
                }
            })
            .join(' or ')
    );
};

const parseUp = (str) => {
    str = str.replace(/{@as 1}/g, '[[one-action]]');
    str = str.replace(/{@as 2}/g, '[[two-action]]');
    str = str.replace(/{@as 3}/g, '[[three-action]]');

    return str;
};

const parseFrequency = (frequency) => {
    if (frequency?.unit) {
        if (frequency.interval > 1)
            return `property | Frequency | once per ${frequency.interval} ${frequency.unit}s`;
        else return `property | Frequency | once per ${frequency.unit}`;
    } else if (frequency?.entry) {
        return `property | Frequency | ${frequency.entry}`;
    }

    return `property | Frequency | unknown`;
};

const parseDuration = ({ entry, number, unit, sustained }) => {
    if (entry) return entry;

    let str = '';

    if (number) {
        if (number > 1) str = `${number} ${unit}s`;
        else str = `${number} ${unit}`;
    } else str = `${unit}`;

    return str + (sustained ? ' sustained' : '');
};

const nthStr = (num) => {
    switch (parseInt(num)) {
        case 1:
            return '1st';
        case 2:
            return '2nd';
        case 3:
            return '3rd';
        case NaN:
            return '?th';
        default:
            return num + 'th';
    }
};

const cleanContent = (arr) => {
    return arr.map((e) => parseUp(e)).map((e) => Renderer.stripTags(e));
};

const cape = (arr) => (Array.isArray(arr) ? arr : [arr]);

module.exports = {
    initCard,
    getTextEntries,
    classList,
    skillList,
    getMatchedAncestry,
    parseActivity,
    unpackText: (str) =>
        typeof str === 'string' ? str.split('|')[0].trim() : str,
    parseUp,
    parseSavingThrow,
    nthStr,
    cleanContent,
    cape,
    parseDuration,
    parseFrequency,
};
