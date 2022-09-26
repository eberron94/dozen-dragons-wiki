const { filterUniqueByObjectKey } = require('../../util/arrays');
const { toCamelCase } = require('../../util/stringHelper');
const { PageNode } = require('../classes');

exports.composeMDX = (original) => {
    const list = original.map(parse).filter(filterUniqueByObjectKey());

    // list.forEach((page) => {
    //     const headers = [
    //         ...page.html.matchAll(
    //             /<h([1-4])\s*(?:id="([^"]+)"|)[^>]*>\s*([^<]+?)\s*<\/h[1-4]\s*>/g
    //         ),
    //     ].map(([match, headingLevel, id, str]) => {
    //         return {
    //             h: Number(headingLevel),
    //             id,
    //             str,
    //         };
    //     });

    //     page.toc = headers.filter((e) => e.h <= page.data.frontMatter.tocLevel);
    // });

    return {
        list,
        find: (id) => {
            const found = list.find((item) => item.id === id);
            return found ? { ...found } : null;
        },
        fillPages: (compileFn, contentList) => {
            list.forEach((page) => {
                //Check if page has Content array
                if (typeof page?.data?.frontMatter?.content === 'object') {
                    const contentOfPage = page.data.frontMatter.content;
                    // Handle each entry in object
                    const contentFill = {};

                    //Handle Root level content
                    if (Array.isArray(contentOfPage)) {
                        //TODO
                    } else {
                        // Else, content of page is an object
                        Object.entries(contentOfPage).forEach(([key, ids]) => {
                            contentFill[key] = ids
                                .map((id) => {
                                    console.log(
                                        'searching for item',
                                        id,
                                        'for',
                                        page.id + ':' + key
                                    );
                                    return contentList.find(id);
                                })
                                .sort(sortItems);
                        });
                    }

                    // console.log(contentFill);

                    page.html = compileFn(page.html)(contentFill);
                    page.sidebar = compileFn(page.sidebar)(contentFill);
                }

                const headers = [
                    ...page.html.matchAll(
                        /<h([1-4])\s*(?:id="([^"]+)"|)[^>]*>\s*([^<]+?)\s*<\/h[1-4]\s*>/g
                    ),
                ].map(([match, headingLevel, id, str]) => {
                    return {
                        h: Number(headingLevel),
                        id,
                        str,
                    };
                });

                // console.log(page.metadata.frontMatter.tocLevel, headers);

                page.toc = headers.filter(
                    (e) => e.h <= page.data.frontMatter.tocLevel
                );
            });
            return list;
        },
    };
};

const parse = (item) => {
    const node = new PageNode(
        item.slug,
        item.frontMatter.weight,
        item.frontMatter.title,
        null,
        item.frontMatter.metaTitle
    );

    const data = {
        frontMatter: item.frontMatter,
    };

    return {
        id: toCamelCase('page' + node.slug.replace(/\//g, ' ')),
        type: 'mdx',
        node,
        data,
        html: item.html,
        sidebar: item.sidebar,
    };
};

const sortItems = (a, b) => {
    if (
        typeof a.node.weight === 'number' &&
        typeof b.node.weight === 'number'
    ) {
        if (a.node.weight < b.node.weight) return -1;
        if (a.node.weight > b.node.weight) return 1;
    }

    if (typeof a.name === 'string' && typeof b.name === 'string') {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    }
    return 0;
};
