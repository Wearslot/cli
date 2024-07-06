const fs = require('fs');
const path = require('path');
const chalk = require("chalk");

exports.createContext = (options, use_theme_file = true) => {

    var context = {
        dir: process.cwd(),
        theme: {},
        output: true
    };

    if(use_theme_file) {
        const filepath = path.join(context.dir, 'theme.json')
    
        if (fs.existsSync(filepath)) {
            context.theme = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        }
    }

    for (const key in options) {
        if (['store', 'name', 'version', 'publish'].includes(key)) {
            context.theme[key] = options[key];
        }
    }

    if (!context.theme?.store) {
        console.log(chalk.red.bold('Development store name is required'));
        return false;
    }

    if (!context.theme?.name) {
        console.log(chalk.red.bold('Development theme name is required'));
        return false;
    }

    if (context.theme.store.indexOf('.') > -1) {
        context.theme.store = context.theme.store.split('.')[0];
    }

    context.theme.version = context.theme.version || '1.0.0';

    context.output = true;

    return context;
}