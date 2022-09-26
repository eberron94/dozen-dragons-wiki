const element = (elem, classNameCommon) => (children, className) => {
    return `<${elem} class='${joinClass(
        classNameCommon,
        className
    )}'>${children}</${elem}>`;
};

const getIconObject = (iconString, iconMap) => {
    const icon = { icon: 'ace', rotation: 0, color: '', path: '' };

    if (!iconString) return icon;

    // Extract (icon id) (#rotation) and (%color) from icon string
    const result = (iconString ? iconString : '').match(
        /([-a-z0-9]+)((?:#|%)[-a-z0-9]+)?((?:#|%)[-a-z0-9]+)?/
    );

    const [_, iconName, op1, op2] = result;

    if (iconName) icon.icon = iconName;

    // Update icon rotation and color based on matches, if they exist
    [op1, op2]
        .filter((e) => e && typeof e === 'string')
        .forEach((match) => {
            const code = match.charAt(0);
            const value = match.substring(1);

            switch (code) {
                case '#':
                    icon.rotation = Number(value);
                    break;
                case '%':
                    icon.color = String(value);
                    break;
            }
        });

    // Add icon asset path
    const iconBase = iconMap[iconName] || {};

    return { ...icon, ...iconBase };
};

const splitParams = (value) => {
    return String(value)
        .replace(/(\\\|)/g, '~#~')
        .split('|')
        .map((str) => str.replace(/~#~/g, '|').trim());
};

const colorFront = ({ cardData, options }) => {
    return (
        cardData.color_front ||
        cardData.color ||
        options.default_color ||
        'black'
    );
};

const colorBack = ({ cardData, options }) => {
    return (
        cardData.color_back ||
        cardData.color ||
        options.default_color ||
        'black'
    );
};

const iconFront = ({ cardData, options, iconMap }) => {
    const iconString = cardData.icon_front || options.default_icon || 'ace';

    return getIconObject(iconString, iconMap);
};

const iconBack = ({ cardData, options, iconMap }) => {
    const iconString =
        cardData.icon_back ||
        cardData.icon_front ||
        options.default_icon ||
        'ace';

    return getIconObject(iconString, iconMap);
};

const iconQR = ({ cardData, options }) => {
    return cardData.qr || options.default_qr || 'https://kaisercard.github.io/';
};

const iconInline = ({ params, cardData, options, iconMap }) => {
    const iconString = params[0] || '';
    const size = params[1] || '6';
    const align = params[2] || '';
    const count = Number(params[3]) || 1;
    const rounded = Boolean(params[4]) ? 2 : 0;
    const color = colorFront({ cardData, options });

    const iconObject = getIconObject(iconString, iconMap);

    return {
        ...iconObject,
        size,
        align,
        color,
        count,
        rounded,
    };
};

const cardCount = ({ cardData, options }) => {
    return Number(cardData.count) || Number(options.default_count) || 1;
};

const titleCodeString = ({ cardData, options }) => {
    return cardData.code || '';
};

const titleTextString = ({ cardData, options }) => {
    return cardData.title || '';
};

const titleTextFont = ({ cardData, options }) => {
    return (
        Number(
            cardData.title_font_size || options.default_title_font_size || '16'
        ) * Number(options.scale)
    );
};

const bodyTextFont = ({ cardData, options }) => {
    return (
        Number(
            cardData.body_font_size || options.default_body_font_size || '8'
        ) * Number(options.scale)
    );
};

const subtitleTextString = ({ params, cardData, options }) => {
    return params[0] || '';
};

const subtitleTextFont = (data) => {
    return (parseFloat(bodyTextFont(data)) + 2).toString;
};

const sectionTextFont = (data) => {
    return (parseFloat(bodyTextFont(data)) + 2).toString;
};

const sectionTextArray = ({ params }) => {
    return params.map((e) => e || '');
};

const pictureUrl = ({ params, cardData, options }) => {
    return params[0] || '';
};

const pictureSize = ({ params, cardData, options }) => {
    return params[1] || '';
};

const boxCount = ({ params }) => {
    return Number(params[0]) || 1;
};

const boxSize = ({ params }) => {
    return Number(params[1]) || 6;
};

const d20AbilityScores = ({ params }) => {
    const [str = 10, dex = 10, con = 10, int = 10, wis = 10, cha = 10] = params;
    return [str, dex, con, int, wis, cha];
};

const titleFormat = ({ cardData, options, iconMap }) => {
    return options.title_format || 'name-icon';
};

const propertyTextArray = ({ params }) => {
    const [name1, value1, name2, value2] = params;
    const arr = [
        {
            name: name1,
            text: value1 || '',
        },
    ];

    if (name2 || value2) arr.push({ name: name2, text: value2 || '' });
    return arr;
};

const descriptionNameString = ({ params }) => {
    return params[0];
};

const descriptionTextString = ({ params }) => {
    return params[1];
};

const textTextString = ({ params }) => {
    return params[0];
};

const listNameString = ({ params }) => {
    return params[1] ? params[0] : '';
};

const listTextString = ({ params }) => {
    return params[1] ? params[1] : params[0];
};

const tableStyles = ({ cellStyle, rowStyle }) => {
    return { cell: cellStyle, row: rowStyle };
};

const tableCellTextArray = ({ params }) => {
    return params.map((e) => e || '');
};

const traitTextArray = ({ params }) => {
    return params.map((e) => e || '').map((e) => String(e).toLowerCase());
};
const fillFlex = ({ params }) => {
    return params[0] || 1;
};

const joinClass = (...args) => {
    return args
        .flatMap((e) =>
            typeof e === 'object' && 'className' in e ? e.className : e
        )
        .flatMap((e) => (typeof e === 'string' ? e.split(' ') : e))
        .filter((e) => typeof e === 'string' && e)
        .map((e) => e.trim())
        .join(' ');
};

const scale = ({ params, options }) => {
    return options.scale || 1;
};

module.exports =  {
    element,
    splitParams,
    colorFront,
    colorBack,
    iconFront,
    iconBack,
    titleCodeString,
    titleTextString,
    titleTextFont,
    bodyTextFont,
    subtitleTextFont,
    sectionTextFont,
    iconQR,
    subtitleTextString,
    iconInline,
    pictureSize,
    pictureUrl,
    boxSize,
    boxCount,
    d20AbilityScores,
    propertyTextArray,
    descriptionNameString,
    descriptionTextString,
    textTextString,
    listNameString,
    listTextString,
    sectionTextArray,
    tableStyles,
    tableCellTextArray,
    traitTextArray,
    fillFlex,
    cardCount,
    joinClass,
    scale,
    titleFormat,
};
