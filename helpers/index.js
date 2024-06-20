const fs = require('fs');
const path = require('path');

async function copyThemeFile(src, dest) {
    const stat = fs.statSync(src);

    if (stat.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        const entries = await fs.readdirSync(src, { withFileTypes: true });
        await Promise.all(entries.map(entry => {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            if (srcPath.indexOf('.git') > -1) {
                return;
            }
            return copyThemeFile(srcPath, destPath);
        }));
    } else {
        fs.copyFileSync(src, dest);
    }
}


const getDeveloperCredentials = () => {

    if (!fs.existsSync('../actions/.credentials')) return false;

    var credentials = {};

    var credentials_file = fs.readFileSync('../actions/.credentials', 'utf8');
    credentials_file.split('\n').map(keyvalue => {
        keyvalue = keyvalue.split('=');
        credentials[keyvalue[0]] = keyvalue[1];
    });

    return credentials;
}

module.exports = {
    copyThemeFile,
    getDeveloperCredentials
}