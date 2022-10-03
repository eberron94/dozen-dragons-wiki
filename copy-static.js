const fs = require('fs-extra');


// COPY STATIC FILES INTO BUILD
fs.copy('static/css', 'build/css', (err) => {
    if (err) return console.error(err);
    console.log('static css files copied into build folder');
});

fs.copy('static/js', 'build/js', (err) => {
    if (err) return console.error(err);
    console.log('static js files copied into build folder');
});