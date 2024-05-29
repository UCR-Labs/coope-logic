const assert = require('assert');
const Encryption = require('../../src/encryption/encryption');

describe('Encryption', () => {
  const key = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; 
  let encryption;

  before(() => {
    encryption = new Encryption(key);
  });

  it('should encrypt a string', () => {
    const plaintext = 'Hello, world!';
    const encrypted = encryption.encrypt(plaintext);
    assert.strictEqual(typeof encrypted, 'string');
    assert.notStrictEqual(encrypted, plaintext);
  });

  it('should decrypt an encrypted string', () => {
    const plaintext = 'Hello, world!';
    const encrypted = encryption.encrypt(plaintext);
    const decrypted = encryption.decrypt(encrypted);
    assert.strictEqual(decrypted, plaintext);
  });

  it('should produce different encrypted strings for different inputs', () => {
    const plaintext1 = 'Hello, world!';
    const plaintext2 = 'Goodbye, world!';
    const encrypted1 = encryption.encrypt(plaintext1);
    const encrypted2 = encryption.encrypt(plaintext2);
    assert.notStrictEqual(encrypted1, encrypted2);
  });

  it('should throw an error if no key is provided', () => {
    assert.throws(() => new Encryption(), /A key is required for encryption/);
  });

  it('should throw an error if the key is not 64 hexadecimal characters long', () => {
    assert.throws(() => new Encryption('123456789'), /Key must be 64 hexadecimal characters long/);
  })
});
