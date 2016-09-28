const CryptoJS = require('crypto-js');

class Vault {
    constructor({ passwords, password, salt }) {
        try {
            const unlockKey = CryptoJS.PBKDF2(password, salt, { keySize: 512/32 }).toString();
            passwords  = CryptoJS.AES.decrypt(passwords, unlockKey).toString(CryptoJS.enc.Utf8);
            passwords = JSON.parse(passwords);
            Object.assign(this, { passwords, password, salt, unlockKey });
        } catch (e) {
            console.log('Invalid password');
            process.exit();
        }
    }
    encrypt() {
        return {
            salt: this.salt,
            passwords: CryptoJS.AES.encrypt(JSON.stringify(this.passwords), this.unlockKey).toString()
        };
    }
}

Vault.initialize = ({ password }) => {
    const salt = CryptoJS.lib.WordArray.random(128/8).toString();
    const unlockKey = CryptoJS.PBKDF2(password, salt, { keySize: 512/32 }).toString();
    return {
        salt,
        passwords: CryptoJS.AES.encrypt(JSON.stringify([]), unlockKey).toString()
    };
}

module.exports = Vault;

