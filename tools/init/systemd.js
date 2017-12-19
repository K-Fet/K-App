#!/usr/bin/env node
const inquirer = require('inquirer');


async function askQuestions(configObj) {
    const questions = [
        {
            type: 'input',
            name: 'instanceNum',
            message: 'How many instances?',
            default: 4,
            validate: input => {
                if (input >>> 0 === parseFloat(input)) return true;
                return 'You must enter a positive integer';
            }
        },
        {
            type: 'input',
            name: 'firstPort',
            message: 'What is the port of the first instance?',
            default: 3000,
            validate: input => {
                if (input >>> 0 === parseFloat(input)) return true;
                return 'You must enter a positive integer';
            }
        }
    ];

    const answers = await inquirer.prompt(questions);

    configObj.app = {
        instances: answers.instanceNum,
        firstPort: answers.firstPort
    };

}


async function configure(config) {
    const root = path.resolve(__dirname, '..', '..');
}

module.exports = {
    askQuestions,
    configure
};
