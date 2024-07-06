const chalk = require("chalk");
const { createContext } = require("../kits/context");
const { getDeveloperCredentials } = require("./auth");
const { downloadTheme } = require("../kits/theme/download");

exports.clone = (type, options) => {

    const credentials = getDeveloperCredentials();
    const context = createContext(options, false)

    if (context) {
        switch (type) {
            case 'theme':
                return downloadTheme(context, credentials);

            default:
                return console.log(chalk.blue.bold(`Unindefined action or command ${action}`));
        }
    }


}