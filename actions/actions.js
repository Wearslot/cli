const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const formData = require('form-data');
const { zipDirectory } = require('../store-front-app/helpers');
const { copyFile, getDeveloperCredentials } = require('../helpers');


const actions = (action, options) => {

    const credentials = getDeveloperCredentials();

    switch (action) {
        case 'push':
            pushToStore(options, credentials);
            break;

        case 'pull':
            pullFromStore(options);
            break;

        default:
            break;
    }
}

const pushToStore = async ({ store, version, name }, credentials) => {
    var wkdir = process.cwd();
    var folder_paths = wkdir.split('\\');
    var folder_name = folder_paths[folder_paths.length - 1];

    if (!fs.existsSync(path.join(wkdir, 'components'))) {
        return console.log(chalk.red.bold('Directory is not a valid taojaa theme directory'));
    }

    console.log(chalk.white.bold('Bundling..................'));

    const fullpath = path.join(__dirname, `${folder_name}`);
    // Copy files from original folder 
    await copyFile(wkdir, fullpath)
    // Zip the copied folder
    await zipDirectory(fullpath, `${fullpath}.zip`);
    // Delete the copied folder
    fs.rmSync(fullpath, { recursive: true, force: true });


    console.log(chalk.green.bold('Theme bundled successfully.'));

    // Upload zipped folder
    console.log(chalk.white.bold('Pushing theme to theme store...'));


    const fileStream = fs.createReadStream(`${fullpath}.zip`);

    const form = new formData();
    form.append('store', store || '');
    form.append('name', name || '');
    form.append('slug', folder_name);
    form.append('version', version || 'development');
    form.append('theme_file', fileStream);

    try {
        const response = await axios.post(`${process.env.THEME_SERVER_URL}/api/v1/push/theme`, form, {
            headers: {
                'Accept': 'application/json',
                ...credentials,
                ...form.getHeaders(),
            },
        });

        if (response.data.status === 'success') {
            console.log(chalk.green.bold('Theme pushed successfully'));
        }

    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                var message = error.response.data.message;
                if (message === 'Invalid request') {
                    message = 'Invalid theme push request received';
                }
                console.log(chalk.red.bold(message));
            }
        } else {
            console.log(chalk.red.bold("Push failed"));
        }
    } finally {
        fs.unlinkSync(`${fullpath}.zip`)
    }


}

const pullFromStore = ({ store }) => {

}

module.exports = actions