const fs = require('fs');
const stringify = require('json-stable-stringify');
const { readFilesSync } = require('./readFiles');
const { parseFile } = require('./parseFile');
const { bucketByType } = require('./bucketByType');

const keyPosition = require('../../.vscode/settings.json')[
    'sortJSON.orderOverride'
].reverse();

exports.parseMaker = target => {
    const dest = './data-stage/' + target + '/parse/';

    const makeName = name => dest + name + '.json';
    const saveFinal = async (name, data) => {
        try {
            fs.writeFile(
                makeName(name),
                stringify(data, {
                    cmp: sortJson,
                    space: 4,
                }),
                err => {
                    if (err) return console.log(err);
                    console.log('saved ' + name);
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    const fileContent = readFilesSync('./data/' + target + '/');

    const content = fileContent
        .flatMap(parseFile)
        .filter(e => e.id && e.hidden !== true);
    const buckets = bucketByType(content);

    Object.keys(buckets).forEach(name => saveFinal(name, buckets[name]));
};

const sortJson = (a, b) => {
    const aa = keyPosition.indexOf(a.key);
    const bb = keyPosition.indexOf(b.key);
    if (aa === -1 && bb === -1) return a.key < b.key ? 1 : -1;
    return aa < bb ? 1 : -1;
};
