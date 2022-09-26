const fs = require('fs');
const { readFileNamesSync } = require('./util/readFiles');

const packer = () => {
    const dest = './src/';

    const content = readFileNamesSync('./static/icons/');

    console.log(`Found ${content.length} unique icons`);

    const iconMap = content
        .map((path) => ({
            path: path.replace('./static', ''),
            id: path.split('/').pop().replace('.svg', '').replace('.png', ''),
        }))
        .sort(function (a, b) {
            if (a.id < b.id) {
                return -1;
            }
            if (a.id > b.id) {
                return 1;
            }
            return 0;
        })
        .reduce(
            (obj, item) => {
                return {
                    ...obj,
                    [item.id]: item,
                };
            },
            {
                empty: { id: 'empty', path: '' },
                default: { id: 'default', path: '' },
            }
        );

    //.map(item => ({ ...item, origin: target }));
    saveFile(dest + 'iconMap.json', iconMap);
};
const saveFile = (name, data) => {
    try {
        fs.writeFile(name, JSON.stringify(data), (err) => {
            if (err) return console.log(err);
            console.log('saved ' + name);
        });
    } catch (err) {
        console.log(err);
    }
};

packer();
