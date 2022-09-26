var Handlebars = require('handlebars');
const markup = (str) => {
    switch (typeof str) {
        case 'object':
            if (Array.isArray(str)) {
                return str.map(markup);
            }
        case 'string':
            break;
        default:
            return str;
    }

    //Handle Lists
    str = str.replace(/\n- +([^\n]+)/g, '\n<li>$1</li>');
    str = str.replace(/(\<li>.+?\<\/li>\n*)+,?/gs, (match) => {
        return `<ul class="list-body">\n${match.trim()}\n</ul>\n\n`;
    });

    // Handle Headers
    str = str.replace(/^ *(#+) +([^\n]+)/gm, (string, pound, match) =>
        handleHeader({
            entries: [match],
            toc: true,
            level: String(pound).length,
        })
    );

    //Handle Link
    str = str.replace(/(\[[^\[]+\]\(.*\))/g, (string, match) => {
        const matches = match.match(/\[([^\[]+)\]\((.*)\)/);

        return `<a href='${matches[2]}' rel='noopener'>${matches[1]}</a>`;
    });

    //Handle styling
    str = str.replace(
        /\*\*\*([^\*]+)\*\*\*/g,
        (string, match) =>
            `<strong class='text-bold-italics'><em>${match}</em></strong>`
    );

    str = str.replace(
        /\*\*([^\*]+)\*\*/g,
        (string, match) => `<strong class='text-bold'>${match}</strong>`
    );

    str = str.replace(
        /\*([^\*]+)\*/g,
        (string, match) => `<em class='text-italics'>${match}</em>`
    );

    str = str.replace(/-----/g, '<hr />');

    str = str.replace(/ *--- */g, '&mdash;');

    str = str.replace(/ *-- */g, '&ndash;');

    str = str.replace(/&nbsp;/g, ' ');

    str = str.replace(/&rsquo;/g, "'");

    str = str.replace(
        /(\{one-action\}|\[\[one-action\]\])/g,
        () => `<span class="pf2e-action one-action">1</span>`
    );

    str = str.replace(
        /(\{two-action\}|\[\[two-action\]\])/g,
        () => `<span class="pf2e-action two-action">2</span>`
    );

    str = str.replace(
        /(\{three-action\}|\[\[three-action\]\])/g,
        () => `<span class="pf2e-action three-action">3</span>`
    );

    str = str.replace(
        /(\{reaction\}|\[\[reaction\]\])/g,
        () => `<span class="pf2e-action reaction">R</span>`
    );

    str = str.replace(
        /(\{free-action\}|\[\[free-action\]\])/g,
        () => `<span class="pf2e-action free-action">F</span>`
    );

    str = str.replace(/  +/g, ' ');

    return str;
};

/////////////////////
/***** EXPORTS *****/
/////////////////////

module.exports = { markup };
