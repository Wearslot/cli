const chalk = require('chalk');
const { downloadTheme } = require('./clone');
const { uploadTheme } = require('../kits/theme/upload');
const { createContext } = require('../kits/context');
const { runTheme } = require('../kits/theme/run');
const { getDeveloperCredentials } = require('./auth');


exports.actions = (action, options) => {

    const credentials = getDeveloperCredentials();
    if (!credentials) {
        return console.log(chalk.bold.red('Authencation required!'));
    }

    const context = createContext(options);

    if (context) {
        switch (action) {
            case 'push':
                return uploadTheme(context, credentials);

            case 'pull':
                return downloadTheme(context, credentials, true);

            case 'dev':
                return runTheme(context, options, credentials);

            default:
                return console.log(chalk.blue.bold(`Unindefined action or command ${action}`));
        }
    }
}