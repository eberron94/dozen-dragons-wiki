var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');

const { registerEntryTypes, markup, entryMarkup } = require('./helper/entry');
const { kaiser } = require('./kaiser');
const { bucketArray } = require('./util/arrays');
const { nthNumber, toDashCase } = require('./util/stringHelper');
const { unescape } = require('lodash');

exports.buildSite = () => {
    registerHandlebars();

    /** CREATE COMMON PAGE BODY
     * html template shared by all pages, only process it once.
     */

    const renderPageBody = compileHandlebarTemplate(
        'templates/common/body.hbs'
    );

    const renderNavigation = compileHandlebarTemplate(
        'templates/common/navigation.hbs'
    );

    const navHTML = renderNavigation(kaiser.navigationTree);

    /**
     * Build non-mdx pages
     */
    kaiser.buildTooltips(compileHandlebarTemplate);
    kaiser.buildBlocks(compileHandlebarTemplate);
    kaiser.buildPages(compileHandlebarTemplate);

    /**
     * Fill MDX pages with content blocks
     */
    kaiser.fillMDX(Handlebars.compile);

    /**
     * Write pages to build folder
     */

    kaiser.pageList.forEach((pageData) => {
        const { node } = pageData;
        pageData.html = entryMarkup(pageData.html);
        pageData.sidebar = entryMarkup(pageData.sidebar);
        const { prev, next } = kaiser.pagingMap[node.slug] || {};
        const completeHTML =
            '<!DOCTYPE html>' +
            renderPageBody({
                ...pageData,
                navigation: navHTML,
                prev,
                next,
            });
        ensureDirectoryExistence('./build/' + node.slug);
        fs.writeFile('./build/' + node.slug + '.html', completeHTML, (err) => {
            if (err) console.error(err, pageData.html);
            else console.log(node.slug, 'file written successfully');
        });
    });

    ensureDirectoryExistence('./build/js');
    fs.writeFile(
        './build/js/kaiser.js',
        kaiser.data.itemCard.print(),
        (err) => {
            if (err) console.error(err);
            else console.log('/js/kaiser.js', 'file written successfully');
        }
    );

    /**
     * DEBUG: write kaiser to file
     */

    // const kaiserString = JSON.stringify(kaiser, null, 4);
    // ensureDirectoryExistence('./build/DEBUG/kaiser.json');
    // fs.writeFile('./build/DEBUG/kaiser.json', kaiserString, (err) => {
    //     if (err) console.error(err);
    //     else console.log('DEBUG: KAISER file written successfully');
    // });
};

const registerHandlebars = () => {
    // REGISTER HELPERS AND PARTIALS

    Handlebars.registerHelper(
        'navChild',
        compileHandlebarTemplate('templates/common/navigation-child.hbs')
    );

    Handlebars.registerHelper(
        'one_action',
        compileHandlebarTemplate('templates/game/one-action.hbs')
    );

    Handlebars.registerHelper(
        'two_action',
        compileHandlebarTemplate('templates/game/two-action.hbs')
    );

    Handlebars.registerHelper(
        'three_action',
        compileHandlebarTemplate('templates/game/three-action.hbs')
    );

    Handlebars.registerHelper(
        'free_action',
        compileHandlebarTemplate('templates/game/free-action.hbs')
    );

    Handlebars.registerHelper(
        'reaction',
        compileHandlebarTemplate('templates/game/reaction.hbs')
    );

    Handlebars.registerHelper(
        'traits',
        compileHandlebarTemplate('templates/game/traits.hbs')
    );

    Handlebars.registerHelper('breadcrumb', (context, options) => {
        const compileBread = compileHandlebarTemplate(
            'templates/common/breadcrumb.hbs'
        );
        if(context.slug === '/index') return ''

        if (options.hash.isYoungest) console.log(context.slug, options.hash);
        return compileBread(
            { ...context, isYoungest: Boolean(options.hash.isYoungest) },
            options
        );
    });

    Handlebars.registerHelper('card', (context, options) => {
        const cardFind = kaiser.data.itemCard.find(context.trim());

        if (cardFind && cardFind?.block?.index) return cardFind.block.index;

        // console.warn('MISSING ID', context);
        return 'ERROR: INVALID ID';
    });

    Handlebars.registerHelper('featureClass', (context, options) => {
        return compileHandlebarTemplate('templates/game/feature.hbs')(
            {
                name: context,
                level: options.hash.level,
                code: options.hash.code,
                id: toDashCase(
                    (
                        context.replace(/[^a-zA-Z]/g, '') +
                        ' ' +
                        (options.hash.id || '')
                    ).trim()
                ),
                dagger: options.hash.altered,
            },
            {}
        );
    });

    Handlebars.registerHelper('deck', (context, options) => {
        const buildDeck = compileHandlebarTemplate('templates/page/deck.hbs');

        if (options.hash.levelHeading && Array.isArray(context)) {
            const hl = Number(options.hash.levelHeading) || 2;
            const levelBuckets = bucketArray(
                context.filter((e) => e),
                'level'
            );
            return Object.keys(levelBuckets)
                .sort((a, b) => a - b)
                .map((lvl) => {
                    const nth = nthNumber(lvl);
                    return (
                        `<div class='level-head'><h${hl} id="level-${nth}">${nth} Level</h${hl}></div>` +
                        buildDeck(levelBuckets[lvl], options)
                    );
                })
                .join('\n');
        }

        return compileHandlebarTemplate('templates/page/deck.hbs')(
            context,
            options
        );
    });

    registerEntryTypes();
};

const compileHandlebarTemplate = (templatePath) => {
    return Handlebars.compile(
        fs.readFileSync(path.resolve(templatePath), 'utf-8')
    );
};

function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}
