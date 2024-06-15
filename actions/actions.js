const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const formData = require('form-data');
const { zipDirectory } = require('@Wearslot/store-front-app/helpers');
const { copyThemeFile, getDeveloperCredentials } = require('../helpers');
const { cloneTheme } = require('./clone');


const actions = (action, options) => {

    const credentials = getDeveloperCredentials();

    switch (action) {
        case 'push':
            pushToStore(options, credentials);
            break;

        case 'pull':
            cloneTheme(options, credentials, true);
            break;

        default:
            console.log(chalk.blue.bold(`Unindefined action or command ${action}`));
            break;
    }
}

const pushToStore = async (options, credentials) => {
    var wkdir = process.cwd();
    var folder_paths = wkdir.split('\\');
    var folder_name = folder_paths[folder_paths.length - 1];

    if (!fs.existsSync(path.join(wkdir, 'components'))) {
        return console.log(chalk.red.bold('Not a valid theme directory'));
    }

    let store, version, name = undefined;

    if (fs.existsSync(path.join(wkdir, 'theme.json'))) {
        const theme = JSON.parse(fs.readFileSync(path.join(wkdir, 'theme.json'), 'utf8'));
        store = theme.store; version = theme.version; name = theme.name;
    }

    if (options.store !== undefined) {
        store = options.store;
    }

    if (options.version !== undefined) {
        version = options.version;
    }

    if (options.name !== undefined) {
        name = options.name;
    }

    if (!store) {
        return console.log(chalk.red.bold('Store not specified'));
    }

    if (!name) {
        return console.log(chalk.red.bold('Theme name is required'));
    }

    if (store.indexOf('.') > -1) {
        store = store.split('.')[0];
    }

    console.log(chalk.blue.bold('Bundling..................'));

    const fullpath = path.join(__dirname, `${folder_name}`);
    // Copy files from original folder 
    await copyThemeFile(wkdir, fullpath)
    // Zip the copied folder
    await zipDirectory(fullpath, `${fullpath}.zip`);
    // Delete the copied folder
    fs.rmSync(fullpath, { recursive: true, force: true });


    console.log(chalk.green.bold('Theme bundled successfully.'));

    // Upload zipped folder
    console.log(chalk.blue.bold('Pushing theme to store...'));

    const fileStream = fs.createReadStream(`${fullpath}.zip`);

    const form = new formData();
    form.append('store', store);
    form.append('name', name);
    form.append('version', version || '1.0.0');
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
            console.log(chalk.red.bold(error));
        }
    } finally {
        fs.unlinkSync(`${fullpath}.zip`)
    }
}

module.exports = actions