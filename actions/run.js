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

    var store_url;

    if (fs.existsSync(path.join(wkdir, 'theme.json'))) {
        const theme = JSON.parse(fs.readFileSync(path.join(wkdir, 'theme.json'), 'utf8'));
        store_url = theme.store;
    } else {
        store_url = store + '.taojaa.shop'
    }

    /** 
     * Configures port to run the app and if port not available 
     * it switches to default - 2157
    */
    const PORT = port !== undefined ? port : 2157;

    /**
     * List of required enviroment variables names with
     * their values 
     */
    const envs = {
        "STORE_DOMAIN": store_url,
        "THEME_PORT": PORT,
        "THEME_DIR": process.cwd(),
        "THEMES_ENDPOINT": 'https://themes-service-prod.taojaa.com/api/v1',
        "STORE_SERVICE_ENDPOINT": 'https://storefront-service-prod.taojaa.com/api/v1',
        "MARKETING_SERVICE": 'https://marketing-service-prod.taoaa.com',
        "SECURE_CHECKOUT_ENDPOINT": 'https://secure-checkout-prod.taojaa.com/api/v1',
        "STORE_MANAGER_ENDPOINT": 'https://store-manager-production.taojaa.com/api/v1',
        'MAILTRAP_USERNAME': 'api',
        'MAILTRAP_PASSWORD': '67dc695fd9358c1b3a336b17548eaac0'
    }

    if (store_url === undefined) {
        return console.log("Error, kindly provide development store name");
    }

    try {
        const credentials = getDeveloperCredentials();
        if (!credentials) {
            return console.log(chalk.bold.red('Authencation required!'));
        }

        await axios.post(`${process.env.AUTH_SERVER_URL}/api/v1/validate/store/access`, { store }, {
            headers: {
                'Accept': 'application/json',
                ...credentials
            }
        });


        /**
         * Set all enviroments variables after access 
         * has been validated.
         */
        for (const key in envs) {
            if (Object.hasOwnProperty.call(envs, key)) {
                process.env[key] = envs[key];

            }
        }
        process.env['AUTH_SECRET_KEY'] = credentials.SECRET_KEY;

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


    const app = require('taojaa-storefront');

    app.listen(process.env.THEME_PORT, () => {
        console.log(chalk.green.bold(`\nAccess on local @ http://127.0.0.1:${process.env.THEME_PORT}`));
        console.log('');
        console.log(chalk.white('To preview on your development store:'));
        console.log('');
        console.log(chalk.blue.bold('taojaa') + ' theme push [--store <store-name>]');
        console.log('');
        console.log(chalk.green.bold(`Access your develoment store @ https://${store_url}`));
    })
}

module.exports = {
    runProject
}