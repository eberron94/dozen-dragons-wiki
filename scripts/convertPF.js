const fs = require('fs');
const { convertActions2Save } = require('./convert/action');
const { convertFeats2Save } = require('./convert/feat');
const { convertItem, convertItems2Save } = require('./convert/item');
const { convertSpell2Save } = require('./convert/spell');
const { readFilesSync } = require('./util/readFiles');

const workingKeys = ['spell', 'baseitem', 'item', 'action', 'feat'];

const saveFile = (name, data) => {
    try {
        if (typeof data === 'object')
            fs.writeFile(name, JSON.stringify(data, null, 4), (err) => {
                if (err) return console.log(err);
                console.log('saved ' + name);
            });
        else if (typeof data === 'string')
            fs.writeFile(name, data, (err) => {
                if (err) return console.log(err);
                console.log('saved ' + name);
            });
    } catch (err) {
        console.log(err);
    }
};

const packer = () => {
    const dest = './data/converted/';
    const yaml = './output/';

    const rawContent = readFilesSync('./data-raw/');

    const content = {};

    for (const fileData of rawContent) {
        for (const key of Object.keys(fileData).filter((k) =>
            workingKeys.includes(k)
        )) {
            console.log(
                `working on "${key}" with ${fileData[key].length} values`
            );
            for (const value of fileData[key]) {
                if (Array.isArray(content[key])) {
                    content[key].push({ ...value, key });
                } else {
                    content[key] = [{ ...value, key }];
                }
            }
        }
    }

    const saveFn = (fileName) => (file) => {
        saveFile(dest + fileName + '.json', file);
        saveFile(
            yaml + fileName + '.yaml',
            file
                .map((e) => e.id)
                .sort()
                .map((e) => '        - ' + e)
                .join('\n')
        );
    };

    // Handle Key: item
    convertItems2Save(content.item, saveFn('item'));
    convertItems2Save(content.baseitem, saveFn('base-item'));

    convertFeats2Save(content.feat, saveFn('feat'));

    convertActions2Save(content.action, saveFn('action'));
    convertSpell2Save(content.spell, saveFn('spell'));

    // console.log(`found ${content.length} unique items`);

    // saveFile(dest + 'temp.json', content);
};

packer();
