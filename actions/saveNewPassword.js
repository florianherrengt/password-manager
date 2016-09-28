const inquirer = require('inquirer');
const parseDomain = require('parse-domain');

function saveNewPassword () {
    inquirer.prompt([{
        type: 'input',
        message: 'Url or domain',
        name: 'url'
    }, {
        type: 'password',
        message: 'Password',
        name: 'password'
    }, {
        type: 'input',
        message: 'Comment',
        name: 'comment'
    }]).then(({ url, password, comment }) => {
        const { domain } = parseDomain(url);
        console.log({ domain, password, comment });
    });
}

module.exports = saveNewPassword;
