import {Buffer} from 'node:buffer';
import test from 'ava';
import * as CryptoUtils from './crypto-util.mjs';

const encryptionKey32Bytes = 'W7EWmp213EaChaiJg1X93QdxQ9ZWHzEm';
const encryptionKeyTooLong = 'W7EWmp213EaChaiJg1X93QdxQ9ZWHzEmFk6oU4URgqA';
const plainText = 'My message to be encrypted';
const plainTextLatin1 = Buffer.from('My message to be encrypted', 'latin1').toString();

test('decrypt returns original plaintext', (t) => {
  const encryptedText = CryptoUtils.encrypt(plainText, encryptionKey32Bytes);
  const decryptedText = CryptoUtils.decrypt(encryptedText, encryptionKey32Bytes);

  t.is(decryptedText, plainText, 'The decrypted text should equal the original plaintext.');
});

test('encrypt and decrypt handle keys greater than 32 bytes', (t) => {
  t.notThrows(() => {
    const encryptedText = CryptoUtils.encrypt(plainText, encryptionKeyTooLong);
    const decryptedText = CryptoUtils.decrypt(encryptedText, encryptionKeyTooLong);

    t.is(
      decryptedText,
      plainText,
      'The decrypted text should equal the original plaintext even when using a key longer than 32 bytes.'
    );
  });
});

test('encrypt and decrypt handle non-utf8 input encoding', (t) => {
  t.notThrows(() => {
    const encryptedText = CryptoUtils.encrypt(plainTextLatin1, encryptionKeyTooLong);
    const decryptedText = CryptoUtils.decrypt(encryptedText, encryptionKeyTooLong);

    t.is(
      decryptedText,
      plainTextLatin1,
      'The decrypted text should equal the original plaintext even when using a non-utf8 input encoding.'
    );
  });
});