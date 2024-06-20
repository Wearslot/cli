const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const formData = require('form-data');
const { zipDirectory } = require('taojaa-storefront/helpers');
const { copyThemeFile, getDeveloperCredentials } = require('../helpers');
const { downloadTheme } = require('./clone');


const actions = (action, options) => {

    const credentials = getDeveloperCredentials();

    switch (action) {
        case 'push':
            pushToStore(options, credentials);
            break;

        case 'pull':
            downloadTheme(options, credentials, true);
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

    var data = options;
    data.version = options.version || '1.0.0';

    if (!fs.existsSync(path.join(wkdir, 'components'))) {
        return console.log(chalk.red.bold('Not a valid theme directory'));
    }

    if (fs.existsSync(path.join(wkdir, 'theme.json'))) {
        var theme = JSON.parse(fs.readFileSync(path.join(wkdir, 'theme.json'), 'utf8'));
        data = theme;
    }

    if (!data.store) {
        return console.log(chalk.red.bold('Store must be specified'));
    }

    if (!data.name) {
        return console.log(chalk.red.bold('Theme name is required'));
    }

    if (data.store.indexOf('.') > -1) {
        data.store = data.store.split('.')[0];
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
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            form.append(key, data[key]);

        }
    }
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
            if (theme !== undefined) {
                if (theme.id === undefined) {
                    theme.id = response.data.theme.id;

                    fs.writeFileSync(path.join(wkdir, 'theme.json'), JSON.stringify(theme, undefined, 2))
                }
            }
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