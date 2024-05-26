const fs = require('fs').promises;
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

module.exports = {
    copyFile
}