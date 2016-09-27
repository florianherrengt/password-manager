const CryptoJS = require('crypto-js');
const passwords = [];
for (let i = 0; i < 100; i ++) {
    passwords.push({
        password: CryptoJS.lib.WordArray.random(128/8).toString()
    });
}
console.log(passwords);
const salt = CryptoJS.lib.WordArray.random(512/32);
const password = 'secret';
const unlockKey = CryptoJS.PBKDF2(password, salt, { keySize: 512/32 }).toString();
const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(passwords), unlockKey);
console.log(ciphertext.toString())
var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), unlockKey);
var plaintext = bytes.toString(CryptoJS.enc.Utf8);

console.log(plaintext);

class Vault {
    constructor({ encryptedVault, password, salt }) {
        const unlockKey = CryptoJS.PBKDF2(password, salt, { keySize: 512/32 }).toString();
        var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), unlockKey);
        this.vault = bytes.toString(CryptoJS.enc.Utf8);
    }
    get() {
        return this.vault;
    }
}
