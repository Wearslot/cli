const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const chalk = require("chalk");


exports.init = (type, name) => {
    if (type === "theme") {
        createThemeProject(name);
    } else if (type === "app") {

    }
}


function createThemeProject(name) {

    console.log(chalk.blue.bold('Creating new theme using affluent...'));

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

    const baseDir = `${directory}/${name}`;

    if (fs.existsSync(baseDir)) {
        const theme = {
            name,
            store: "",
            version: "1.0.0"
        };
        fs.writeFileSync(path.join(baseDir, 'theme.json'), JSON.stringify(theme, undefined, 2))
    }

    /**
     * Upon clone success out success message
     * */

    console.log(chalk.bold.green('\nTheme initlized succesfully!\n'));
    console.log(chalk.white('Start building amazing e-commerce experience.\n'));
    console.log(chalk.white('To start the app:'));
    console.log('');
    console.log(chalk.bold.blue('taojaa') + ' ' + chalk.white('theme dev --store <name>'));
}