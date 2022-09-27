var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
const { cape } = require('../../util/cape');
const { kaiser } = require('../../kaiser');
const { markup } = require('../markup');

const registerEntryTypes = () => {
    const reg = (key, file) => {
        var template = fs.readFileSync(path.resolve(file), 'utf-8');

        Handlebars.registerHelper(key, Handlebars.compile(template));
    };
    Handlebars.registerHelper('entry', handlebarEntry);

    reg('line', 'templates/entry/line.hbs');
    reg('list', 'templates/entry/list.hbs');
    reg('link', 'templates/entry/anchor.hbs');
    reg('table', 'templates/entry/table.hbs');

    reg('b', 'templates/entry/bold.hbs');
    reg('i', 'templates/entry/italics.hbs');
    reg('bi', 'templates/entry/bold-italics.hbs');

    // reg('tag', 'templates/entry/tag.hbs');
};

const handlebarEntry = (entries = []) => {
    return cape(entries).map(handleEntry).join('');
};

const handleEntry = (entry) => {
    var value = 'ERROR';
    switch (typeof entry) {
        case 'string':
            value = entryMarkup(entry);
            break;
        case 'bigint':
        case 'boolean':
        case 'number':
            value = String(entry);
            break;
        case 'object':
            if (Array.isArray(entry)) {
                value = entry.map(handleEntry).join('');
            } else {
                value = handleComplexEntry(entry);
            }
            break;
        default:
            break;
    }

    return value;
};

const entryMarkup = (str) => {
    str = markup(str);

    // Handle Headers
    str = str.replace(/^ *(#+) +([^\n]+)/gm, (string, pound, match) =>
        handleHeader({
            entries: [match],
            toc: true,
            level: String(pound).length,
        })
    );

    str = str.replace(/\{@([^\}]+)\}/g, (_, match) => {
        // console.log('tag found', match);

        return kaiser.getTooltip(match);
    });

    str = str.replace(/\{#([^\}]+)\}/g, (_, match) => {
        console.log('block found', match);

        return kaiser.getBlock(match);
    });

    return str;
};

const handleComplexEntry = ({ type = '', ...props }) => {
    switch (type) {
        case 'h1':
            return handleHeader({ level: 1, ...props });
        case 'h2':
            return handleHeader({ level: 2, ...props });
        case 'h3':
            return handleHeader({ level: 3, ...props });
        case 'h4':
            return handleHeader({ level: 4, ...props });
        case 'h5':
            return handleHeader({ level: 5, ...props });

        case 'a':
        case 'anchor':
        case 'link':
            return Handlebars.helpers.link(props);
        case 'line':
        case 'result':
            return Handlebars.helpers.line(props);
        case 'list':
            return Handlebars.helpers.list(props);
        case 'table':
            return Handlebars.helpers.table(props);
    }

    return 'UNKNOWN ENTRY TYPe';
};

const handleHeader = ({ level, toc, entries = [], href }) => {
    var element = 'h1';
    var elementClass = '';
    var elementChildren = '';
    switch (level) {
        case 1:
        case '1':
            element = 'h1';
            elementClass += 'heading-1';
            break;
        case 2:
        case '2':
            element = 'h2';
            elementClass += 'heading-2';
            break;
        case 3:
        case '3':
            element = 'h3';
            elementClass += 'heading-3';
            break;
        case 4:
        case '4':
            element = 'h4';
            elementClass += 'heading-4';
            break;
        case 5:
        case '5':
            element = 'h5';
            elementClass += 'heading-5';
            break;
    }

    if (toc) {
        elementClass += ' toc-header';
    }

    if (href) {
        elementChildren = Handlebars.helpers.link({ entries, href });
    } else {
        elementChildren = handleEntry(entries, null);
    }

    return `<${element} class='${elementClass.trim()}'>${elementChildren}</${element}>`;
};

/////////////////////
/***** EXPORTS *****/
/////////////////////

module.exports = { registerEntryTypes, entryMarkup };
