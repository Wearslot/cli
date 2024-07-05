const chalk = require('chalk');


exports.dev = async (ctx, credentials) => {
    startDevServer(ctx, credentials);
}

const startDevServer = (ctx, credentials) => {
    //create a server object:

    process.env = {
        ...process.env,
        THEME_DIR: ctx.dir,
        TAOJAA_STOREFRONT_API: 'https://storefront-service-prod.taojaa.com/api/v1',
        AUTH_SECRET_KEY: credentials.SECRET_KEY
    }

    const app = require('taojaa-storefront');

    app.listen(ctx.port, () => {
        console.log(`
            ${chalk.green.bold(`Access on local http://127.0.0.1:${ctx.port}`)}\n
            To preview on your development store:\n
            ${chalk.blue.bold('taojaa')} theme push --store <store-name>\n
            ${chalk.green.bold(`Access your develoment store https://${ctx.theme.store}.taojaa.shop`)}
        `);
    })
}
