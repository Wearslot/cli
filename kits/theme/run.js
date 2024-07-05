const chalk = require('chalk');
const { dev } = require('../../utilities/dev');

exports.runTheme = async (ctx, options, credentials) => {

    ctx.output = false;

    /** 
     * Configures port to run the app and if port not available 
     * it switches to default - 2157
    */
    ctx.port = options.port !== undefined ? options.port : 2157;

    dev(ctx, credentials);
}