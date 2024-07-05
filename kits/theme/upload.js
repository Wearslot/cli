const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const formData = require('form-data');
const { copyThemeFile, zipDirectory } = require('..');

exports.uploadTheme = async (ctx, credentials) => {

    var base_path = path.basename(ctx.dir);

    if (!fs.existsSync(path.join(ctx.dir, 'components'))) {
        return console.log(chalk.red.bold('Not a valid theme directory'));
    }

    ctx.output && console.log(chalk.blue.bold('Bundling theme............'));

    const fullpath = path.join(__dirname, `${base_path}`);

    // Copy & zip files from local theme dirD 
    await copyThemeFile(ctx.dir, fullpath)
    await zipDirectory(fullpath, `${fullpath}.zip`);

    fs.rmSync(fullpath, { recursive: true, force: true });

    ctx.output && console.log(chalk.blue.bold('Pushing theme to store...'));

    const fileStream = fs.createReadStream(`${fullpath}.zip`);

    const form = new formData();
    for (const key in ctx.theme) {
        if (Object.hasOwnProperty.call(ctx.theme, key)) {
            form.append(key, String(ctx.theme[key]));
        }
    }
    form.append('theme_file', fileStream);

    try {
        const response = await axios.post(`${process.env.THEME_SERVER_URL}/api/v1/push/theme`, form, {
            headers: {
                'Accept': 'application/json',
                ...credentials,
                ...form.getHeaders(),
            },
        });

        if (response.data.status === 'success') {
            if (ctx.theme.id === undefined) {
                ctx.theme.id = response.data.theme.id;

                fs.writeFileSync(path.join(ctx.dir, 'theme.json'), JSON.stringify(ctx.theme, undefined, 2))
            }
            ctx.output && console.log(chalk.green.bold('Theme pushed successfully'));
        }

    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                var message = error.response.data.message;
                if (message === 'Invalid request') {
                    message = 'Invalid theme upload request';
                }
            }
        } else {
            message = error;
        }

        ctx.output && console.log(chalk.red.bold(message));
    } finally {
        fs.unlinkSync(`${fullpath}.zip`)
    }
}