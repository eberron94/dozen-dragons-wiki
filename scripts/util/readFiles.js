const fs = require('fs');
const path = require('path');
const { flatten } = require('lodash');

/**
 * @description Read files synchronously from a folder, with natural sorting
 * @param {String} dir Absolute path to directory
 * @returns {Object[]} List of object, each object represent a file
 * structured like so: `{ filepath, name, ext, stat }`
 */

const getFilePaths = dir => {
    const files = [];
    const folders = [];
    fs.readdirSync(dir).forEach(filename => {
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
exports.readFilesSync = dir => {
    const files = getFilePaths(dir);

    const content = files
        .filter(f => f.ext === '.json')
        .flatMap(({ filepath }) => {
            console.log('found', filepath);
            const raw = fs.readFileSync(filepath);
            const json = JSON.parse(raw);
            return json;
        })
        .filter(x => typeof x === 'object');

    return content.filter(x => x && !x.hidden);
};

const walkSync = (dir, filelist) => {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(dir + file).isDirectory()) {
            filelist = walkSync(dir + file + '/', filelist);
        } else {
            const path = dir.replace('./static', '') + file;
            filelist.push(path);
        }
    });
    return filelist;
};

exports.readFileNamesSync = walkSync;
