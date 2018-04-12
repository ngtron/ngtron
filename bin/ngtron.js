var wizard = require('../lib/wizard');
var program = require('commander');
const chalk = require('chalk');
const log = console.log;

log();
log(chalk.blue.bold('  -------- Angutron --------'));
log();

program
    .description('Angutron')
    .option('-n, new', 'Create app')
    .version('1.0.0') // @TODO adjust dynamically
    .parse(process.argv);

if (!program.args.length) { program.help(); }
if (program.new) {
    var options = {
        name: program.args[0]
    };
    wizard(options);
}
