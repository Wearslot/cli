const fs = require('fs');
const chalk = require('chalk');
const https = require('https'), http = require('http');

const prompt = require('prompt-sync')({ sigint: true });

const auth = ({accesstoken, secretkey}) => {
    const accessToken = accesstoken || prompt('Enter Access Token: ')
    const secretKey = secretkey || prompt('Enter Secret Key: ')

    if (!accessToken || !secretKey) {
        return console.log(chalk.bold.red('Access token and secret cannot be empty!'))
    }

    const path = '/api/v1/cli/auth';
    const data = JSON.stringify({ accessToken, secretKey });

    var options = {
        hostname: process.env.SERVER_HOSTNAME,
        port: process.env.SERVER_PORT,
        path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'Accept': 'application/json'
        }
    };

    var req = http.request(options, (res) => {
        res.on('data', (d) => {
            d = JSON.parse(d);
            if (res.statusCode === 500) {
                return console.log(chalk.bold.red('Authentication failed, error occured on the server'));
            }

            if (res.statusCode === 400) {
                return console.log(chalk.bold.red(d.message));
            }

            if(res.statusCode === 200 && d.success) {
                const path = require('path');
                fs.writeFileSync(path.join(__dirname, '.credentials'), `ACCESS_TOKEN=${accessToken}\nSECRET_KEY=${secretKey}`);
                return console.log(chalk.bold.green(d.message));
            }
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });

    req.write(data);
    req.end();
}

module.exports = auth;