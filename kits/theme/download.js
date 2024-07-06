const fs = require('fs');
const path = require('path');
const chalk = require("chalk");
const { downloadZipFile, unzipDirectory } = require("..");

exports.downloadTheme = async (ctx, credentials, pull = false) => {

    if (ctx.output === true) {
        pull
            ? console.log(chalk.blue.bold(`Pulling ${ctx.theme.name} from ${ctx.theme.store} ....`))
            : console.log(chalk.blue.bold(`Cloning ${ctx.theme.name} from ${ctx.theme.store} ....`));
    }

    try {

        const reqData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...credentials
            },
            body: JSON.stringify(ctx.theme)
        }

        var finalDir = pull ? `${ctx.dir}` : `${ctx.dir}/${ctx.theme.name.replaceAll(' ', '-').toLowerCase()}/`;

        const outputPath = path.join(__dirname, 'theme.zip');
        await downloadZipFile(`${process.env.THEME_SERVER_URL}/api/v1/download/theme`, outputPath, reqData)
        await unzipDirectory(outputPath, finalDir)

        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }

        if (ctx.output === true) {
            return pull
                ? console.log(chalk.green.bold('Theme updates pulled successfully'))
                : console.log(chalk.green.bold('Theme cloned successfully'));
        }

    } catch (error) {
        var message;

        if (error.response) {
            if (error.response.data.status === 'error') {
                message = error.response.data.message;
            }
        } else {
            message = error;
        }

        if (ctx.output === true) {
            console.log(chalk.red.bold(message));
        }
    }
}