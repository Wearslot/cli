// import chalk from "chalk";
// import shell from 'shelljs';
// import path from 'path';

const path = require('path');
const shell = require('shelljs');
const chalk = require("chalk");


const createProject = (type, name) => {
    if (type === "theme") {
        createThemeProject(name);
    } else if (type === "app") {

    }
}


function createThemeProject(name) {

    console.log(chalk.green('Creating new theme using affluent...'));

    const directory = process.cwd();
    /**
     * Change directory to cwd and clone affluent
     * */
    shell.cd(directory)
    shell.exec(`git clone https://github.com/Wearslot/affluent ${name}`)

    /**
     * Remove .git folder from the clone
     * */
    shell.cd(path.join(directory, name));
    shell.rm('-rf', '.git');

    /**
     * Upon clone success out success message
     * */

    console.log('');
    console.log(chalk.bold.green('Theme initlized succesfully!\n'));
    console.log(chalk.white('Start building amazing e-commerce experience.\n'));
    console.log(chalk.white('To start the app:'));
    console.log('');
    console.log(chalk.bold.green('taojaa') + ' ' + chalk.white('theme dev --store <name>'));
}


module.exports = {
    createProject
}