#! /usr/bin/env node
const { program } = require('commander');
const { runProject } = require('./actions/run');
const { createProject } = require('./actions/new');
const actions = require('./actions/actions');
const auth = require('./actions/auth');

process.env['SERVER_URL'] = 'http://localhost:8002';
process.env['SERVER_HOSTNAME'] = 'localhost';
process.env['SERVER_PORT'] = 8002;

program.command('new <type> <name>')
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
    .command('authenticate')
    .description('Authenticate cli access for push, pull and publish actions')
    .option('--accesstoken <token>', 'Your Taojaa developer access token.')
    .option('--secretkey <secret>', 'Your Taojaa developer secret key.')
    .action(auth);



program.parse(process.argv);