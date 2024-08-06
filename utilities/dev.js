const chalk = require('chalk');


exports.dev = async (ctx, credentials) => {
    startDevServer(ctx, credentials);
}

const startDevServer = (ctx, credentials) => {

    process.env = {
        ...process.env,

        /**
         * Set environment to development
        */
        APP_ENV: "development",

        /**
         * Adding app PORT environtment
        */
        PORT: ctx.port,

        /**
         * Declearing app root dir in envrioment
        */
        THEME_DIR: `${ctx.dir}/`,

        /**
         * Adding storefront api base url environtment
        */
        TAOJAA_STOREFRONT_API: 'https://storefront-service-prod.taojaa.com/api/v1',

        /**
         * Adding authentication credentials secret to enviroment 
        */
        AUTH_SECRET_KEY: credentials.SECRET_KEY,

        /**
         * Adding store domain name environtment
        */
        STORE_DOMAIN: `${ctx.theme.store}.taojaa.shop`
    };

    console.log(`
    ${chalk.green.bold(`Access on local http://127.0.0.1:${ctx.port}`)}\n
    To preview on your development store:\n
    ${chalk.blue.bold('taojaa')} theme push --store <store-name>\n
    ${chalk.green.bold(`Access your develoment store https://${ctx.theme.store}.taojaa.shop`)}
    `);

    require('taojaa-storefront');
}
