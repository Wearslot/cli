const chalk = require("chalk");
const { createContext } = require("../kits/context");
const { getDeveloperCredentials } = require("./auth");

exports.clone = (type, options) => {

    const credentials = getDeveloperCredentials();
    const context = createContext(options)

    if (context) {
        switch (type) {
            case 'theme':
                return downloadTheme(options, credentials);

            default:
                return console.log(chalk.blue.bold(`Unindefined action or command ${action}`));
        }
    }


}