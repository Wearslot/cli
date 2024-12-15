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

    const templates = path.join(ctx.dir, `/templates`);
    var response1 = await validation(templates, 'templates/', ctx.output);

    const locales = path.join(ctx.dir, `/locales`);
    var response2 = await validation(locales, 'locales/', ctx.output);

    const configs = path.join(ctx.dir, `/configs`);
    var response3 = await validation(configs, 'configs/', ctx.output);

    results = [...results, ...response1, ...response2, ...response3];

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
            validation(srcPath, prefix + entry.name + "/", output);
        } else {
            return validateFile(srcPath, entry.name, prefix, output);
        }
    }));
}

const validateFile = (file, name, prefix = '', output = true) => {
    const template = fs.readFileSync(file, 'utf-8');
    if (template == '') {
        console.log(`${prefix}${name} ........` + chalk.red(` invalid ❌`));
        return false;
    }

    if (JSON.parse(template)) {
        output && console.log(`${prefix}${name} ........` + chalk.green(` validated ✅`))
    }

    return true;
}