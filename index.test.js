const { expect } = require('chai');
const path = require('path');
const child = require('child_process');
const exec = path.join(__dirname, 'index.js');
const proc = child.spawn('./index.js', {stdio: 'pipe'});

proc.stdin.setEncoding('utf-8');
proc.stdout.pipe(process.stdout);

const commands = [{
    input: '3',
    test: (output, callback) => {
        //console.log(output)
        expect(output).to.contains('Customize');
        callback();
    }
}];

const subscribe = (() => {
    let index = -1;
    function sendNextCommand() {
        const command = commands[index];
        if (command) {
            proc.stdin.write(command.input + '\r');
        }
    }
    return (result) => {
        console.log(result);
        index++;
        if (index !== 0) {
            const { test } = commands[index -1 ] || { test: null };
            test && test(result, sendNextCommand);
        }
        sendNextCommand();
    }
})();

proc.stdout.on('data', output => {
    subscribe(output.toString('utf-8'));
});

//proc.stdin.write('3\r')
