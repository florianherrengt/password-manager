const inquirer = require('inquirer');
const generatePassword = require('password-generator');
const ncp = require('copy-paste');

function generatePasswordPrompt () {
    let generatedPassword = generatePassword(50, false);
    console.log(generatedPassword);
    return inquirer.prompt([{
        type: 'confirm',
        name: 'customize',
        message: 'Customize?',
        default: false
    }, {
        type: 'input',
        name: 'passwordlength',
        message: 'Length',
        when: (answers) => answers.customize
    }, {
        type: 'rawlist',
        name: 'option',
        message: 'Select an option',
        choices: ['Done', 'Letter only', 'Number only', 'No special char'],
        when: (answers) => {
            if (!answers.customize) { return false; }
            generatedPassword = generatePassword(answers.passwordlength, false);
            console.log(generatedPassword);
            return answers.passwordlength;
        }
    }]).then(answers => {
        switch (answers.option) {
            case 'Letter only':
                generatedPassword = generatePassword(answers.passwordlength, true);
                break;
            case 'Number only':
                generatedPassword = generatePassword(answers.passwordlength, false, /\d/);
                break;
            case 'No special char':
                generatedPassword = generatePassword(answers.passwordlength, false, /[a-zA-Z0-9_]/);
                break;
        }
        console.log(generatedPassword);
        ncp.copy(generatedPassword, () => console.log('Copied to clipboard!'))
    });
}

module.exports = generatePasswordPrompt;
