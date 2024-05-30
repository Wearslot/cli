const fs = require('fs');
const path = require('path');

async function copyFile(src, dest) {
    const stat = await fs.stat(src);

    if (stat.isDirectory()) {
        await fs.mkdir(dest, { recursive: true });
        const entries = await fs.readdir(src, { withFileTypes: true });
        await Promise.all(entries.map(entry => {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            if (srcPath.indexOf('.git') > -1) {
                return;
            }
            return copyFile(srcPath, destPath);
        }));
    } else {
        await fs.copyFile(src, dest);
    }
}


const getDeveloperCredentials = () => {

    if (!fs.existsSync(path.join(__dirname, '/../actions/.credentials'))) return false;

    var credentials = {};

    var credentials_file = fs.readFileSync(path.join(__dirname, '/../actions/.credentials'), 'utf8');
    credentials_file.split('\n').map(keyvalue => {
        keyvalue = keyvalue.split('=');
        credentials[keyvalue[0]] = keyvalue[1];
    });

    return credentials;
}

module.exports = {
    copyFile,
    getDeveloperCredentials
}