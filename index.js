const fs = require('fs-extra');
const { buildSite } = require('./src/buildMaster');

// CLEAN OUT OLD FILES

const rmDir = (dirPath) => {
    try {
        var files = fs.readdirSync(dirPath);
    } catch (e) {
        return;
    }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (filePath.startsWith('build/icons/')) {
                break;
            }
            if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath);
            else rmDir(filePath);
        }
    // fs.rmdirSync(dirPath);
};

fs.emptyDir('build', (err) => {
    if (err) return console.error(err);

    // COPY STATIC FILES INTO BUILD
    fs.copy('static', 'build', (err) => {
        if (err) return console.error(err);
        console.log('static files copied into build folder');
        buildSite();
    });
});

// rmDir('build');
// // COPY STATIC FILES INTO BUILD
// fs.copy('static', 'build', (err) => {
//     if (err) return console.error(err);
//     console.log('static files copied into build folder');
//     buildSite();
// });
