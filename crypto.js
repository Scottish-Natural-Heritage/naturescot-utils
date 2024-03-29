const Crypto = require('node:crypto');
const Buffer = require('node:buffer').Buffer;

const algorithm = 'aes256';
// The key must be 32 bytes for the aes256 algorithm.
const keyLength = 32;
const inputEncoding = 'utf8';
const outputEncoding = 'hex';
const ivLength = 16;

/**
 * Encrypts plaintext with the specified password.
 *
 * @param {string} plaintext The plain text to encrypt.
 * @param {string} password The password to use in encrypting the plaintext.
 * @returns {string} The encrypted text.
 */
const encrypt = (plaintext, password) => {
  const key = Buffer.from(password.slice(0, keyLength), inputEncoding);
  const iv = Crypto.randomBytes(ivLength);
  const cipher = Crypto.createCipheriv(algorithm, key, iv);
  const ciphered = cipher.update(plaintext, inputEncoding, outputEncoding) + cipher.final(outputEncoding);
  const ciphertext = iv.toString(outputEncoding) + ':' + ciphered;
  return ciphertext;
};

/**
 * Decrypts encrypted text with the specified password.
 *
 * @param {string} ciphertext The encrypted text to decrypt.
 * @param {string} password The password to use in decrypting the ciphertext.
 * @returns {string} The decrypted text.
 */
const decrypt = (ciphertext, password) => {
  const key = Buffer.from(password.slice(0, keyLength), inputEncoding);
  const components = ciphertext.split(':');
  const ivFromCiphertext = Buffer.from(components.shift() ?? '', outputEncoding);
  const decipher = Crypto.createDecipheriv(algorithm, key, ivFromCiphertext);
  const deciphered =
    decipher.update(components.join(':'), outputEncoding, inputEncoding) + decipher.final(inputEncoding);
  return deciphered;
};

module.exports = {encrypt, decrypt};
