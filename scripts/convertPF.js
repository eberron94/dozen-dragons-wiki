const fs = require('fs');
const { convertFeats2Save } = require('./convert/feat');
const { convertItem, convertItems2Save } = require('./convert/item');
const { readFilesSync } = require('./util/readFiles');

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
        for (const key of Object.keys(fileData)) {
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
            file.map((e) => '        - ' + e.id).join('\n')
        );
    };

    // Handle Key: item
    convertItems2Save(content.item, saveFn('item'));
    convertItems2Save(content.baseitem, saveFn('base-item'));

    convertFeats2Save(content.feat, saveFn('feat'));

    // console.log(`found ${content.length} unique items`);

    // saveFile(dest + 'temp.json', content);
};

packer();
