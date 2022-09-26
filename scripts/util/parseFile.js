const { camelCase, kebabCase } = require('lodash');
exports.parseFile = fileContent => {
    const { extra, ...item } = { ...fileContent };
    //Handle common alterations
    if ('id' in item === false) {
        item.id = camelCase(item.name);
    }

    if (extra && typeof extra === 'object') {
        const extraList = Object.values(extra)
            .flatMap(e => e)
            .map(e => ({ ...e, id: `${item.id}:${e.id || camelCase(e.name)}`, noPage:true }))
            .map(e => routeItem(e.type)(e));

        item.extra = extraList.map(e => ({ id: e.id, target: e.type }));
        return [routeItem(item.type)(item)].concat(extraList);
    }

    //Handle type specific
    return routeItem(item.type)(item);
};

const routeItem = type => {
    switch (type) {
        case 'action':
            return parseAction;
        case 'archetype':
            return parseArchetype;
        case 'armor':
            return parseArmor;
        case 'art':
            return parseArt;
        case 'creatureType':
        case 'ct':
            return parseCreatureType;
        case 'downtime':
            return parseDowntime;
        case 'feature':
            return parseFeature;
        case 'definition':
            return parseDefinition;
        case 'heritage':
            return parseHeritage;
        case 'martialArt':
            return parseMartialArt;
        case 'module':
            return parseModule;
        case 'phenom':
            return parsePhenom;
        case 'principle':
            return parsePrinciple;
        case 'quickstart':
            return parseQuickstart;
        case 'skill':
            return parseSkill;
        case 'spell':
            return parseSpell;
        case 'state':
            return parseState;
        case 'table':
            return parseTable;
        case 'talent':
            return parseTalent;
        case 'techEffect':
            return parseTechEffect;
        case 'techNegative':
            return parseTechNegative;
        case 'techTree':
            return parseTechTree;
        case 'weapon':
            return parseWeapon;
        case 'ritual':
            return parseRitual;
        case 'power':
            return parsePower;
        default:
            return x => x;
    }
};

const parseAction = item => ({
    name: 'Error',
    source: '',
    action: ['active'],
    ap: 10,
    flavor: [],
    description: ['Bad parsing'],
    ...item,
    type: 'action',
    slug: '/action/' + item.source + '/' + kebabCase(item.name),
});

const parseArchetype = item => ({
    name: 'Error',
    genus: ['fighter'],
    accelerated: {
        hidden: [],
    },
    limit: {
        martial: 50,
        magic: 50,
        manifest: 50,
    },
    devCost: [],
    innate: [],
    flavor: [],
    description: [],
    ...item,
    type: 'archetype',
    slug: '/archetype/' + kebabCase(item.name),
});

const parseArmor = item => ({
    name: 'Error',
    source: '',
    presence: 0,
    fortitude: 0,
    armor: {
        physical: 0,
        elemental: 0,
        energy: 0,
        resistance: 0,
    },
    armorClass: 'none',
    armorReq: 0,
    speedPenalty: 0,
    tip: [],
    description: [],
    ...item,
    type: 'armor',
    slug: '/equipment/armor/' + kebabCase(item.name),
});

const parseArt = item => ({
    name: 'Error',
    subtype: 'error',
    source: 'error',
    flavor: [],
    description: [],
    ...item,
    type: 'art',
    slug: '/martial/master-art/' + kebabCase(item.name),
});

const parseCreatureType = item => ({
    name: 'Error',
    flavor: [],
    description: [],
    ...item,
    type: 'creatureType',
    slug: '/creature-creation/creature-type',
});

const parseDowntime = item => ({
    name: 'Error',
    source: 'error',
    flavor: [],
    description: [],
    ...item,
    type: 'downtime',
    slug: '/downtime/' + kebabCase(item.name),
});

const parseFeature = item => {
    let subtypes = {};
    Object.entries(item.subtypes).forEach(([subtype, value]) => {
        let slug;
        switch (subtype) {
            case 'boon':
            case 'bane':
                slug = '/boon/' + value.source + '-' + subtype + '/';
                break;
            case 'trait':
            case 'flaw':
                slug = '/creature-creation/feature/';
                break;
            case 'define':
            default:
                slug = '/feature/common/';
                break;
        }
        subtypes[subtype] = {
            source: 'error',
            effect: [],
            ...value,
            slug: slug + kebabCase(item.name),
        };
    });

    return {
        name: 'Error',
        source: 'error',
        choice: false,
        default: 'define',
        flavor: [],
        ...item,
        type: 'feature',
        subtypes,
    };
};

const parseDefinition = item => ({
    name: 'Error',
    tip: ['error'],
    ...item,
    type: 'definition',
    slug: item.slug ? item.slug : '/glossary',
});

const parseHeritage = item => ({
    name: 'Error',
    flavor: [],
    description: [],
    ...item,
    type: 'heritage',
    slug: '/heritage/' + kebabCase(item.name),
});

const parseMartialArt = item => ({
    name: 'Error',
    level: 'basic',
    flavor: [],
    description: [],
    complexity: 1,
    ...item,
    type: 'martialArt',
    slug: '/martial/martial-art/' + kebabCase(item.name),
});

const parseModule = item => {
    let slug;
    switch (item.source) {
        case 'mind':
            slug = '/manifest/mind-module/';
            break;
        case 'skill':
            slug = '/general/skill-module/';
            break;
        case 'style':
            slug = '/martial/style-module/';
            break;
        case 'thaumic':
            slug = '/magic/thaumic-module/';
            break;
        case 'weapon':
            slug = '/martial/weapon-module/';
            break;
        default:
            return null;
    }
    return {
        name: 'Error',
        source: 'skill',
        group: 'general',
        requirements: [],
        investments: {},
        flavor: [],

        description: [],
        ...item,
        type: 'module',
        slug: slug + kebabCase(item.name),
    };
};

const parsePhenom = item => ({
    name: 'Error',
    subtype: 'power',
    source: 'general',
    level: 1,
    power: ['automatic'],
    action: 'active',
    target: [],
    maintTime: 'no',
    flavor: [],
    description: [],
    ...item,
    type: 'phenom',
    slug: '/manifest/phenom/' + item.source + '/' + kebabCase(item.name),
});

const parsePower = item => ({
    name: 'Error',
    power: ['automatic'],
    action: 'active',
    target: [],
    maintTime: 'no',
    flavor: [],
    description: [],
    ...item,
    type: 'power',
});

const parsePrinciple = item => ({
    name: 'Error',
    source: 'general',
    flavor: [],
    description: [],
    cells: [],
    ...item,
    type: 'principle',
    slug: '/magic/principle/' + kebabCase(item.name),
});

const parseQuickstart = item => ({
    name: 'Error',
    description: [],
    source: 'freelancer',
    ...item,
    type: 'quickstart',
});

const parseRitual = item => ({
    name: 'Error',
    flavor: [],
    description: [],
    ...item,
    slug: '/ritual/' + kebabCase(item.name),
    type: 'ritual',
});

const parseSkill = item => ({
    name: 'Error',
    group: 'general',
    subtype: 'skill',
    source: 'primary',
    flavor: [],
    description: [],
    slug: '/skill/' + item.group + '/' + kebabCase(item.name),
    ...item,
    type: 'skill',
});

const parseSpell = item => ({
    name: 'Error',
    subtype: 'power',
    source: 'general',
    level: 0,
    power: ['automatic'],
    action: 'active',
    target: [],
    maintTime: 'no',
    flavor: [],
    description: [],
    ...item,
    slug:
        '/magic/spell/' +
        (item.subspell ? 'sub-path/' : '') +
        item.source +
        '/' +
        kebabCase(item.name),
    type: 'spell',
});

const parseState = item => ({
    name: 'Error',
    source: 'man',
    description: [],
    ...item,
    type: 'state',
    slug:
        '/state/man-vs-' +
        (item.source || 'self') +
        '#' +
        kebabCase(item.name).replace(/-/g, ''),
    tip: [
        {
            entries: item.effect,
        },
    ],
});

const parseTable = item => ({
    name: 'Error',
    source: 'general',
    index: '0',
    ...item,
    slug: '/table/' + kebabCase(item.name),
    type: 'table',
});

const parseTalent = item => ({
    name: 'Error',
    requirements: ['{@talent useOfKi}'],
    investments: {
        sk: 0,
    },
    flavor: [],
    description: [],
    ...item,
    type: 'talent',
    slug: '/martial/talent/' + kebabCase(item.name),
});

const parseTechEffect = item => ({
    name: 'Error',
    group: 'offensive',
    action: ['attack'],
    frequency: 'action',
    description: [],
    ...item,
    type: 'techEffect',
    alterations: Array.isArray(item.alterations)
        ? item.alterations.map(a => ({
              ...a,
              id: item.id + '.' + camelCase(a.name),
              pid: item.id,
          }))
        : [],
    slug: '/martial/technique/tech-effect/' + kebabCase(item.name),
});

const parseTechNegative = item => ({
    name: 'Error',
    action: ['attack'],
    description: [],
    ...item,
    type: 'techNegative',
    alterations: Array.isArray(item.alterations)
        ? item.alterations.map(a => ({
              ...a,
              id: item.id + '.' + camelCase(a.name),
              pid: item.id,
          }))
        : [],
    slug: '/martial/technique/tech-negative/' + kebabCase(item.name),
});

const parseTechTree = item => ({
    ...item,
    type: 'techTree',
    slug: '/martial/technique/compendium/' + kebabCase(item.name),
});

const parseWeapon = item => ({
    name: 'Error',
    subtype: 'weapon',
    source: 'gear',
    group: ['classic'],
    category: ['handToHand'],
    weaponClass: ['shortArm'],
    weaponSize: 'small',
    damage: 0,
    presence: 0,
    fortitude: 0,
    breakage: 0,
    description: [],
    feature: [],
    str: [3],
    initPenalty: 0,
    primeDamage: ['cut'],
    secondDamage: [],
    ...item,
    type: 'weapon',
    slug: '/equipment/weapon/' + kebabCase(item.name),
});
