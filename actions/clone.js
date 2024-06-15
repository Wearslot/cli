const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { getDeveloperCredentials } = require("../helpers");
const { downloadZipFile, unzipDirectory } = require("@Wearslot/store-front-app/helpers");

const clone = (type, options) => {
    const credentials = getDeveloperCredentials();

    switch (type) {
        case 'theme':
            cloneTheme(options, credentials);
            break;

        case 'app':
            pullFromStore(options);
            break;

        default:
            console.log(chalk.blue.bold(`Unindefined action or command ${action}`));
            break;
    }
}


const cloneTheme = async ({ store, name, version }, credentials, pull = false) => {

    var wkdir = process.cwd();


    if (fs.existsSync(path.join(wkdir, 'theme.json')) && pull) {
        const theme = JSON.parse(fs.readFileSync(path.join(wkdir, 'theme.json'), 'utf8'));
        store = theme.store; version = theme.version; name = theme.name;
    }

    if (pull) {
        if (!fs.existsSync(path.join(wkdir, 'components'))) {
            return console.log(chalk.red.bold('Not a valid theme directory'));
        }
    }

    try {

        if (!store) {
            return console.log(chalk.red.bold('Store must be specified'));
        }

        if (!name) {
            return console.log(chalk.red.bold('Theme name is required'));
        }

        if (store.indexOf('.') > -1) {
            store = store.split('.')[0];
        }

        console.log(chalk.blue.bold(`Cloning ${name} from ${store} ....`));

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...credentials
            },
            body: JSON.stringify({
                store, name, version: version || '1.0.0'
            })
        }

        const outputPath = path.join(__dirname, 'theme.zip');
        await downloadZipFile(`${process.env.THEME_SERVER_URL}/api/v1/download/theme`, outputPath, options)
        await unzipDirectory(outputPath, `${wkdir}/${name}/`)

        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }

        return console.log(chalk.green.bold('Theme cloned successfully'));

    } catch (error) {
        if (error.response) {
            if (error.response.status === 'error') {
                var message = error.response.message;
                console.log(chalk.red.bold(message));
            }
        } else {
            console.log(chalk.red.bold(error));
        }
    }
}


module.exports = { clone, cloneTheme };