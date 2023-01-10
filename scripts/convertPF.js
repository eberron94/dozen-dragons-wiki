const fs = require('fs');
const { convertActions2Save } = require('./convert/action');
const { convertBackground2Save } = require('./convert/background');
const { convertFeats2Save } = require('./convert/feat');
const { convertItem, convertItems2Save } = require('./convert/item');
const { convertLanguage2Save } = require('./convert/language');
const { convertSpell2Save } = require('./convert/spell');
const { readFilesSync } = require('./util/readFiles');

const workingKeys = [
    'spell',
    'baseitem',
    'item',
    'action',
    'feat',
    'archetype',
    'background',
    'language',
];

const saveFile = (name, data) => {
    try {
        if (typeof data === 'object') {
            const jsonStr = JSON.stringify(data, null, 4).replace(/[<>]/g, '');
            fs.writeFile(name, jsonStr, (err) => {
                if (err) return console.log(err);
                console.log('saved ' + name);
            });
        } else if (typeof data === 'string')
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
    const ignoreList = readFilesSync('./data-tool/ignore/');

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

    const saveFn = (fileName) => (data) => {
        const saveData = data.filter((d) => !ignoreList.includes(d.id));
        saveFile(dest + fileName + '.json', saveData);
        saveFile(
            yaml + fileName + '.yaml',
            saveData
                .map((e) => e.id)
                .sort()
                .map((e) => '        - ' + e)
                .join('\n')
        );
    };

    // Handle Key: item
    convertItems2Save(content.item, saveFn('item'));
    convertItems2Save(content.baseitem, saveFn('base-item'));

    convertFeats2Save(content.feat, content.archetype, saveFn('feat'));

    convertActions2Save(content.action, saveFn('action'));
    convertSpell2Save(content.spell, saveFn('spell'));

    convertBackground2Save(content.background, saveFn('background'));
    convertLanguage2Save(content.language, saveFn('language'));

    // console.log(`found ${content.length} unique items`);

    // saveFile(dest + 'temp.json', content);
};

packer();
