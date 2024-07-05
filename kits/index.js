const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const fetch = require('node-fetch');


exports.copyThemeFile = async (src, dest) => {
    const stat = fs.statSync(src);

    if (stat.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        const entries = fs.readdirSync(src, { withFileTypes: true });
        await Promise.all(entries.map(entry => {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            if (srcPath.indexOf('.git') > -1) {
                return;
            }
            return this.copyThemeFile(srcPath, destPath);
        }));
    } else {
        fs.copyFileSync(src, dest);
    }
}


exports.zipDirectory = async (sourceDir, outputFilePath) => {
    const zip = new AdmZip();
    zip.addLocalFolder(sourceDir);
    await zip.writeZipPromise(outputFilePath);
};


exports.unzipDirectory = async (inputFilePath, outputDirectory) => {
    const zip = new AdmZip(inputFilePath);
    return zip.extractAllToAsync(outputDirectory, true, (error) => {
        if (error) {
            console.log(error);
        } else {
        }
    });
};


exports.downloadZipFile = async (url, outputPath, options = {}) => {
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