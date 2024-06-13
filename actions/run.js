const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { getDeveloperCredentials } = require('../helpers');
const { default: axios } = require('axios');

const runProject = async (dev, { store, port }) => {
    var wkdir = process.cwd();
    if (!fs.existsSync(path.join(wkdir, 'components'))) {
        return console.log(chalk.red.bold('Not a valid taojaa theme directory'));
    }

    const PORT = port !== undefined ? port : 2157;

    process.env["APP_ENV"] = "cli";
    process.env["STORE_NAME"] = store;
    process.env["STORE_DOMAIN"] = store + '.localhost';
    process.env["THEME_PORT"] = PORT;
    process.env["THEME_DIR"] = process.cwd();
    process.env["THEMES_ENDPOINT"] = 'https://themes-service-prod.taojaa.com/api/v1';
    process.env["STORE_SERVICE_ENDPOINT"] = 'https://storefront-service-prod.taojaa.com/api/v1';
    process.env["MARKETING_SERVICE"] = 'https://marketing-service-prod.taoaa.com';
    process.env["SECURE_CHECKOUT_ENDPOINT"] = 'https://secure-checkout-prod.taojaa.com/api/v1';
    process.env["STORE_MANAGER_ENDPOINT"] = 'https://store-manager-production.taojaa.com/api/v1';
    process.env['MAILTRAP_USERNAME'] = 'api';
    process.env['MAILTRAP_PASSWORD'] = '67dc695fd9358c1b3a336b17548eaac0';

    if (store === undefined) {
        return console.log("Error, kindly provide development store name");
    }

    try {
        const credentials = getDeveloperCredentials();
        if (!credentials) {
            return console.log(chalk.bold.red('Authencation reuired!'));
        }

        const response = await axios.post(`${process.env.AUTH_SERVER_URL}/api/v1/validate/store/access`, { store }, {
            headers: {
                'Accept': 'application/json',
                ...credentials
            }
        });

    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                var message = error.response.data.message;
                if (message === 'Invalid request') {
                    message = 'Invalid theme push request received';
                }
                return console.log(chalk.red.bold(message));
            }
            return;
        } else {
            return console.log(chalk.red.bold("Error occured, kindly confirm cli is properly configure."));
        }
    }



    const app = require('@Wearslot/store-front-app');

    app.listen(process.env.THEME_PORT, () => {
        console.log(chalk.green.bold(`\nAccess on local @ http://127.0.0.1:${process.env.THEME_PORT}`));
        console.log('');
        console.log(chalk.white('To preview on your development store:'));
        console.log('');
        console.log(chalk.blue.bold('taojaa') + ' theme push --store <store-name>');
        console.log('');
        console.log(chalk.green.bold(`Access your develoment store @ https://${process.env.STORE_NAME}.taojaa.shop`));
    })
}

module.exports = {
    runProject
}