const { unescape } = require('lodash');
const { filterUniqueByObjectKey, bucketArray } = require('../../util/arrays');
const { toCamelCase } = require('../../util/stringHelper');
const { PageNode } = require('../classes');

exports.composeMDX = (original) => {
    const list = original
        .map(parse)
        .filter(filterUniqueByObjectKey())
        .sort(sortItems);

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

    const slugMap = bucketArray(list, 'slug');

    return {
        list,
        slugMap,
        find: (id) => {
            const found = list.find((item) => item.id === id);
            return found ? { ...found } : null;
        },
        fillPages: (compileFn, contentList) => {
            list.forEach((page) => {
                const contentFill = {};

                //Check if page has Content array
                if (typeof page?.data?.frontMatter?.content === 'object') {
                    const contentOfPage = page.data.frontMatter.content;
                    // Handle each entry in object

                    //Handle Root level content
                    if (Array.isArray(contentOfPage)) {
                        //TODO
                    } else {
                        // Else, content of page is an object
                        Object.entries(contentOfPage).forEach(([key, ids]) => {
                            contentFill[key] = ids
                                .flatMap((id) => {
                                    if (id.startsWith('P::')) {
                                        console.log(
                                            'searching for partials w/',
                                            id,
                                            'for',
                                            page.id + ':' + key
                                        );
                                        return contentList.findPartials(id);
                                    } else {
                                        console.log(
                                            'searching for item',
                                            id,
                                            'for',
                                            page.id + ':' + key
                                        );
                                        return contentList.find(id);
                                    }
                                })
                                .sort((a, b) => {
                                    if (a?.level < b?.level) return -1;
                                    if (a?.level > b?.level) return 1;

                                    if (a?.data?.title < b?.data?.title)
                                        return -1;
                                    if (a?.data?.title > b?.data?.title)
                                        return 1;

                                    if (a?.id < b?.id) return -1;
                                    if (a?.id > b?.id) return 1;

                                    return 0;
                                });
                        });
                    }

                    // console.log(contentFill);
                }

                page.html = compileFn(unescape(page.html))(contentFill);
                page.sidebar = compileFn(unescape(page.sidebar))(contentFill);

                const headers = [
                    ...page.html.matchAll(
                        /<h([1-4])\s*(?:id=["']([^"']+)["']|)[^>]*>\s*([^<]+)/g
                    ),
                ].map(([match, headingLevel, id, str]) => {
                    
                    return {
                        h: Number(headingLevel),
                        id: unescape(unescape(id)),
                        str: unescape(unescape(str.trim())),
                        match,
                    };
                });

                if(page.node.name === 'Alchemist') console.log(headers)

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
        slug: node.slug,
        type: 'mdx',
        node,
        data,
        html: item.html,
        sidebar: item.sidebar,
    };
};

const sortItems = (a, b) => {
    if (
        typeof a?.node?.weight === 'number' &&
        typeof b?.node?.weight === 'number'
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
