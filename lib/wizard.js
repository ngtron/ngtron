var inquirer = require('inquirer');
var _ = require('lodash');
var install = require('./install');

module.exports = function (options) {

    function required(value) {
        return !!value.trim() || 'Required';
    }

    var questions = [{
        type: 'input',
        name: 'name',
        message: 'What is the angutron app name?',
        default: options.name,
        validate: required
    }];

    inquirer.prompt(questions).then(results => {
        _.assign(options, results);
        install(options);
    });
};
