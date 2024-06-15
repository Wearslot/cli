#! /usr/bin/env node
const { program } = require('commander');
const { runProject } = require('./actions/run');
const { createProject } = require('./actions/new');
const actions = require('./actions/actions');
const auth = require('./actions/auth');
const { clone } = require('./actions/clone');

process.env['AUTH_SERVER_URL'] = 'https://auth-service-prod.taojaa.com';
process.env['THEME_SERVER_URL'] = 'https://themes-service-prod.taojaa.com';

program
    .command('new <type> <name>')
    .description('Initialize new project')
    .action(createProject);


program
    .command('run dev')
    .description('Run the project')
    .option('--store <name>', 'The name of the development store.')
    .option('--port <port>', 'Specify port to run theme on local')
    .action(runProject)


program
    .command('theme <action>')
    .description('Perform a push, pull, publish, validate action the app.')
    .option('--name <name>', 'To specify the theme name.')
    .option('--store <store>', 'The name of the development store.')
    .option('--version <version>', 'To specify a new version release.')
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