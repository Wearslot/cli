const chalk = require('chalk');

const runProject = (dev, { store, port }) => {

    /**
     * Copy all files in cwd to the project views path
     * */

    const PORT = port !== undefined ? port : 2157;

    process.env["APP_ENV"] = "cli";
    process.env["STORE_NAME"] = store;
    process.env["STORE_DOMAIN"] = store + '.localhost';
    process.env["THEME_PORT"] = PORT;
    process.env["THEME_DIR"] = process.cwd();
    process.env["THEMES_ENDPOINT"] = 'https://themes-service-dev.taojaa.com/api/v1';
    process.env["STORE_SERVICE_ENDPOINT"] = 'https://storefront-service-dev.taojaa.com/api/v1';
    process.env["MARKETING_SERVICE"] = 'https://marketing-service-dev.taoaa.com';
    process.env["SECURE_CHECKOUT_ENDPOINT"] = 'https://secure-checkout-dev.taojaa.com/api/v1';
    process.env["STORE_MANAGER_ENDPOINT"] = 'https://store-manager-dev.taojaa.com/api/v1';

    const app = require('../store-front-app/app');

    app.listen(process.env.THEME_PORT, () => {
        console.log(chalk.green.bold(`Access on local @ http://127.0.0.1:${process.env.THEME_PORT}`));
        console.log('');
        console.log(chalk.white('To preview on your development store.'));
        console.log(chalk.white('Push the theme'));
        console.log(chalk.blue.bold('taojaa') + ' theme push --store <store-name>');
        console.log(chalk.white(`Access your devloment store @ https://${process.env.STORE_NAME}.taojaa.shop`));
    })
}

module.exports = {
    runProject
}