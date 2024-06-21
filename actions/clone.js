const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { getDeveloperCredentials, downloadZipFile, unzipDirectory } = require("../helpers");

const clone = (type, options) => {
    const credentials = getDeveloperCredentials();

    switch (type) {
        case 'theme':
            downloadTheme(options, credentials);
            break;

        case 'app':
            pullFromStore(options);
            break;

        default:
            console.log(chalk.blue.bold(`Unindefined action or command ${action}`));
            break;
    }
}


const downloadTheme = async (options, credentials, pull = false) => {

    var wkdir = process.cwd();

    var data = options;
    data.version = options.version || '1.0.0';

    if (fs.existsSync(path.join(wkdir, 'theme.json')) && pull) {
        const theme = JSON.parse(fs.readFileSync(path.join(wkdir, 'theme.json'), 'utf8'));
        data = theme;
    }

    if (pull) {
        if (!fs.existsSync(path.join(wkdir, 'components'))) {
            return console.log(chalk.red.bold('Not a valid theme directory'));
        }
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

    pull
        ? console.log(chalk.blue.bold(`Pulling ${data.name} from ${data.store} ....`))
        : console.log(chalk.blue.bold(`Cloning ${data.name} from ${data.store} ....`));

    try {

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...credentials
            },
            body: JSON.stringify(data)
        }

        var finalDir = pull ? `${wkdir}` : `${wkdir}/${data.name.replaceAll(' ', '-').toLowerCase()}/`;

        const outputPath = path.join(__dirname, 'theme.zip');
        await downloadZipFile(`${process.env.THEME_SERVER_URL}/api/v1/download/theme`, outputPath, options)
        await unzipDirectory(outputPath, finalDir)

        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }

        return pull
            ? console.log(chalk.green.bold('Theme updates pulled successfully'))
            : console.log(chalk.green.bold('Theme cloned successfully'));

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


module.exports = { clone, downloadTheme };