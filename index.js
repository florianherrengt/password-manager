#!/usr/bin/env node
const fs = require('fs');
const inquirer = require('inquirer');
const Vault = require('./vault');
const generatePasswordPrompt = require('./actions/generatePassword');
const saveNewPasswordPrompt = require('./actions/saveNewPassword.js');

function run () {
    let vaultExists = true;

    try {
        fs.accessSync('./vault.json', fs.constants.R_OK);
    } catch (e)  {
        vaultExists = false;
    }

    let vault;

    inquirer.prompt([{
        type: 'password',
        name: 'password',
        message: 'Lock password'
    }, {
        type: 'confirm',
        name: 'createNew',
        message: 'No local vault found. Create new?',
        default: true,
        when: !vaultExists
    }]).then(({ createNew, password }) => {
        if (createNew) {
            const vault = new Vault(Object.assign(Vault.initialize({ password }), { password }));
            fs.writeFileSync('./vault.json', JSON.stringify(vault.encrypt()));
            console.log('Vault created.');
        }
        const choices = ['Generate'];
        if (password.length) {
            const { passwords, salt } = require('./vault.json');
            vault = new Vault({ passwords, salt, password });
            //console.log(vault);
        }
        return inquirer.prompt([{
            type: 'rawlist',
            name: 'action',
            message: 'What do you want to do?',
            choices: ['Search', 'Save a new password', 'Generate'],
            when: vaultExists
        }]);
    }).then(answers => {
        switch (answers.action) {
            case 'Search':
                console.log('search not implemented yet');
                break;
            case 'Save a new password':
                saveNewPasswordPrompt();
                break;
            case 'Generate':
                generatePasswordPrompt();
                break;
        }
    }).catch(error => {
        console.log(error);
    });
}

run();

module.exports = run;
