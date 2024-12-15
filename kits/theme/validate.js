const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

exports.validateTheme = async (ctx) => {

    let results = [];

    const header_group = path.join(ctx.dir, `/sections/header-group.json`);
    if (fs.existsSync(header_group)) {
        results.push(validateFile(header_group, 'header-group.json', 'sections/', ctx.output));
    }

    const footer_group = path.join(ctx.dir, `/sections/footer-group.json`);
    if (fs.existsSync(footer_group)) {
        results.push(validateFile(footer_group, 'footer-group.json', 'sections/', ctx.output))
    }

    const fullpath = path.join(ctx.dir, `/templates`);
    var response = await validation(fullpath, '', ctx.output);

    results = [...results, ...response];

    const invalid = results.filter((r) => r == false).length;
    const valid = results.length - invalid;

    ctx.output && console.log('\nSuccess: '+ chalk.bold.green(`${valid}`) + ', Error(s): ' + chalk.bold.red(`${invalid}`));

    if (results.includes(false)) {
        return false;
    }

    return true;
}

const validation = async (src, prefix = '', output = true) => {
    var entries = fs.readdirSync(src, { withFileTypes: true });
    return await Promise.all(entries.map(entry => {

        const srcPath = path.join(src, entry.name);
        if (srcPath.indexOf('.git') > -1) {
            return;
        }

        const stat = fs.statSync(srcPath);
        if (stat.isDirectory()) {
            validation(srcPath, entry.name + "/", output);
        } else {
            return validateFile(srcPath, entry.name, prefix, output);
        }
    }));
}

const validateFile = (file, name, prefix = '', output = true) => {
    const template = fs.readFileSync(file, 'utf-8');
    if (template == '') {
        console.log(chalk.red(`${prefix}${name} is not a valid template ❌`));
        return false;
    }

    if (JSON.parse(template)) {
        output && console.log(chalk.green(`${prefix}${name} is a valid template ✅`))
    }

    return true;
}