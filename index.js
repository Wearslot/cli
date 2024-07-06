#! /usr/bin/env node
const process = require('process');
const { program } = require('commander');
const { init } = require('./actions/init');
const { actions } = require('./actions/actions');
const { auth } = require('./actions/auth');
const { clone } = require('./actions/clone');

process.removeAllListeners('warning');

process.env['APP_ENV'] = "development";
process.env['AUTH_SERVER_URL'] = 'https://auth-service-prod.taojaa.com';
process.env['THEME_SERVER_URL'] = 'https://themes-service-prod.taojaa.com';

program
    .command('init <type> <name>')
    .description('Initialize new project')
    .action(init);

program
    .command('theme <action>')
    .description('Perform a push, pull, publish, validate action the app.')
    .option('--name <name>', 'To specify the theme name.')
    .option('--store <store>', 'The name of the development store.')
    .option('--version <version>', 'To specify a new version release.')
    .option('--publish', 'To set theme as default store theme after push.')
    .action(actions)

program
    .command('clone <type>')
    .description('Clone exitings themes, app and plugins.')
    .option('--store <name>', 'The name of the development store.')
    .option('--name <theme>', 'The name of the theme.')
    .option('--version <version>', 'To target a particular version.')
    .action(clone)

program
    .command('authenticate')
    .description('Authenticate cli access for push, pull and publish actions')
    .option('--accesstoken <token>', 'Your Taojaa developer access token.')
    .option('--secretkey <secret>', 'Your Taojaa developer secret key.')
    .action(auth);



program.parse(process.argv);