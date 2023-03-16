const { exec } = require('child_process');
exec('git branch --show-current', (err, stdout, stderr) => {
    if (err) {
        // handle your error
    }
});