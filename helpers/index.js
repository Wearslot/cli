const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const fetch = require('node-fetch');

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

const zipDirectory = async (sourceDir, outputFilePath) => {
    const zip = new AdmZip();
    zip.addLocalFolder(sourceDir);
    await zip.writeZipPromise(outputFilePath);
};

const unzipDirectory = async (inputFilePath, outputDirectory) => {
    const zip = new AdmZip(inputFilePath);
    return zip.extractAllToAsync(outputDirectory, true, (error) => {
        if (error) {
            console.log(error);
        } else {
        }
    });
};


async function downloadZipFile(url, outputPath, options = {}) {
    try {
        // Make a GET request to the URL
        const response = await fetch(url, options);
        // Check if the request was successful
        if (!response.ok) {
            const data = await response.json();

            const error = new Error(`Unexpected response ${response.statusText}`);
            error.response = data;

            throw error;
        }

        // Create a writable stream to save the file
        const writer = fs.createWriteStream(outputPath);

        // Pipe the response body to the writable stream
        response.body.pipe(writer);

        // Return a promise that resolves when the stream is finished
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        throw error;
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
    copyThemeFile,
    unzipDirectory,
    zipDirectory,
    downloadZipFile,
    getDeveloperCredentials
}