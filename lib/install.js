const series = require('async-series');
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const process = require('process');
const chalk = require('chalk');
const log = console.log;

module.exports = function (options) {

    try {
        series([
            function (done) {
                log();
                log(chalk.blue('> Cloning git repository into'), chalk.cyan(path.resolve(options.name)), chalk.blue('...'));
                log();
                clone(options, done);
            },
            function (done) {
                log();
                log(chalk.blue('> Installing libs ...'));
                log();
                installLibs(options, done);
            },
            function (done) {
                log();
                log(chalk.blue('> Renaming git remote ...'));
                log();
                renameRemote(options, done);
            },
            function (done) {
                log();
                log(chalk.blue('> Parsing package.json ...'));
                log();
                parsePackageJson(options);
            }
        ]);
    } catch (e) {
        log(chalk.red.bold('! Error !'), chalk.red.bold(e));
        log();
    }

    function clone(options, done) {
        const url = 'https://github.com/FonteSolutions/angutron-app.git';
        const cmd = 'git clone ' + url + ' "' + options.name + '"';

        if (fs.existsSync(path.resolve(options.name))) {
            throw 'Directory ' + path.resolve(options.name) + ' already exists.';
        }

        shell.exec(cmd, (status, output) => {
            if (status) {
                console.log('>>>> cloning:', status, output)
            }
            done();
        });
    }

    function installLibs(options, done) {
        process.chdir(path.resolve(options.name));
        const cmd = 'npm i && npm run rebuild-lib';
        shell.exec(cmd, (status, output) => {
            if (status) {
                console.log('>>>> installing libs:', status, output)
            }
            done();
        });
    }

    function renameRemote(options, done) {
        const cmd = 'git remote rename origin upstream';
        shell.exec(cmd, (status, output) => {
            if (status) {
                console.log('>>>> renaming git remote:', status, output)
            }
            done();
        });
    }

    function parsePackageJson(options) {
        const packageJsonFile = process.cwd() + '/package.json';
        fs.readFile(packageJsonFile, (err, data) => {
            if (err) {
                throw err.message;
            }
            data = JSON.parse(data);
            for (var key in options) {
                data[key] = options[key];
            }
            fs.writeFileSync(packageJsonFile, JSON.stringify(data, null , 4));
            log(chalk.green.bold('  Finished! Now you can use your Angutron app on ' +  process.cwd()));
            log();
        });
    }

};