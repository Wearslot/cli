const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');
const prompt = require('prompt-sync')({ sigint: true });

const auth = async ({ accesstoken, secretkey }) => {

    const accessToken = accesstoken || prompt('Enter Access Token: ')
    const secretKey = secretkey || prompt('Enter Secret Key: ')

    if (!accessToken || !secretKey) {
        return console.log(chalk.bold.red('Access token and secret cannot be empty!'))
    }

    const data = { accessToken, secretKey };

    try {
        const response = await axios.post(`${process.env.AUTH_SERVER_URL}/api/v1/cli/auth`, data, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.data.success) {
            const path = require('path');
            fs.writeFileSync(path.join(__dirname, '.credentials'), `ACCESS_TOKEN=${accessToken}\nSECRET_KEY=${secretKey}`);
            return console.log(chalk.bold.green(response.data.message));
        }

    } catch (error) {
        if (error.response.status === 500) {
            return console.log(chalk.bold.red('Authentication failed, error occured on the server'));
        }

        if (error.response.status === 400) {
            return console.log(chalk.bold.red(error.response.data.message));
        }

        return console.log(chalk.bold.red(error.message || 'Somethinng went wrong'));
    }
}

module.exports = auth;