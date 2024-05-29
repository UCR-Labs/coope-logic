const crypto = require('crypto');

class Encryption {

  /**
 * Constructor de la clase que define valores globales usados por los métodos, como la key y 
 * el algoritmo que será utilizado
 * @param {string} key - Key que será utilizada tanto para encriptar como para
 * desencriptar información
 */
  constructor(key) {
    if (!key) {
      throw new Error('A key is required for encryption');
    }
    if (key.length !== 64) {
      throw new Error('Key must be 64 hexadecimal characters long');
    }
    this.key = Buffer.from(key, 'hex');
    this.algorithm = 'aes-256-cbc';
  }

  /**
 * Encripta información que recibe por parametro y retorna dicho valor
 * encriptado.
 * @param {string} text - Texto que será encriptado
 * @returns {string} - Texto encriptado usando el algoritmo elegido
 */
  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
 * Desencripta información que recibe por parametro y retorna dicho valor
 * desencriptado.
 * @param {string} text - Texto que será desencriptado
 * @returns {string} - Texto desencriptado usando el algoritmo elegido y la llave
 * definida
 */
  decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = textParts.join(':');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

module.exports = Encryption;
