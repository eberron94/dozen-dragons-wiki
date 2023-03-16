const { bucketArray } = require('../util/arrays');
const { toCamelCase, escapeStr } = require('../util/stringHelper');
const { readMarkdownFilesSync, readJsonFilesSync } = require('./importData');
const md = require('markdown-it')().use(require('markdown-it-anchor'), {});

exports.colatePages = (target) => {
    const mdxFiles = {
        ...readMarkdownFilesSync('pages'),
        ...readMarkdownFilesSync('pages_' + target),
    };
    const mdxPages = Object.entries(mdxFiles).map(
        ([filePath, { content, metadata }]) => {
            const [contentPrime, sidebarContent] = extractSidebar(content);
            // console.log(typeof contentPrime, typeof sidebarContent);
            var resultPrime = md.render(contentPrime);
            var resultSidebar = md.render(sidebarContent);
            let index = filePath.indexOf('/pages/');
            if(index === -1) index = filePath.indexOf(`/pages_${target}/`);

            return {
                id: 'mdx' + toCamelCase(metadata.name),
                frontMatter: metadata,
                slug: filePath
                    .substring(index + 6)
                    .split('/')
                    .filter((folderName) => !folderName.startsWith('_'))
                    .join('/'),

                html: resultPrime
                    .replace(/\<p/g, `<div class="p"`)
                    .replace(/<\/p/g, `</div`),
                sidebar: resultSidebar
                    .replace(/\<p/g, `<div class="p"`)
                    .replace(/<\/p/g, `</div`),
            };
        }
    );

    const jsonFiles = readJsonFilesSync('data');

    // console.log(mdxPages);

    return { ...bucketArray(jsonFiles, 'type'), mdx: mdxPages };
};

const extractSidebar = (content) => {
    const index = content.indexOf('+++');
    if (index < 0) return [content, ''];
    const top = content.substring(0, index) || '';
    const footer = content.substring(index + 3) || '';

    return [top, footer];
};
