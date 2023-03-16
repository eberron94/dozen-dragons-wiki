const fs = require('fs');
const path = require('path');
const markdownMetaParser = require('markdown-yaml-metadata-parser');
const { flatten } = require('../util/flatten');

const getFilePaths = (dir) => {
    const files = [];
    const folders = [];
    fs.readdirSync(dir).forEach((filename) => {
        const name = path.parse(filename).name;
        const ext = path.parse(filename).ext;
        const filepath = path.resolve(dir, filename);
        const stat = fs.statSync(filepath);
        const isFile = stat.isFile();
        const isFolder = stat.isDirectory();

        if (isFile) files.push({ filepath, name, ext, stat });
        if (isFolder) folders.push(filepath);
    });

    return files.concat(flatten(folders.map(getFilePaths)));
};

exports.readJsonFilesSync = (dir) => {
    const files = getFilePaths(dir);

    const content = files
        .filter((f) => f.ext === '.json')
        .flatMap(({ filepath }) => {
            // console.log('found', filepath);
            const raw = fs.readFileSync(filepath);
            const json = JSON.parse(raw);
            return json;
        })
        .filter((x) => typeof x === 'object');

    return content.filter((x) => x && !x.hidden);
};

exports.readMarkdownFilesSync = (dir) => {
    const files = getFilePaths(dir);

    const content = {};
    files
        .filter((f) => f.ext === '.md' || f.ext === '.mdx')
        .forEach(({ filepath, ...other }) => {
            if (dir !== 'pages') console.log('found', filepath);

            const raw = fs.readFileSync(filepath, 'utf8');
            const md = markdownMetaParser(raw);
            const startIndex = filepath.lastIndexOf('content');
            const key = filepath
                .slice(startIndex - filepath.length + 8)
                .replace('.mdx', '')
                .replace('.md', '');

            content[key] = { ...md, type: 'markdown' };
        });

    return content;
};
