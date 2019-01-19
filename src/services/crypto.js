const crypto = require('crypto-promise');

export async function randomString (len = 16) {
  const buffer = await crypto.randomBytes(len);
  return buffer.toString('hex').slice(0, len);
}

export async function encrypt (secret, value, salt = '') {
  const buffer = await crypto.cipher('aes256', secret)(`${value}${salt}`);
  return buffer.toString('Base64');
}

export async function decrypt (secret, encryptedValue, salt = '') {
  const buffer = Buffer.from(encryptedValue, 'Base64');
  const res = await crypto.decipher('aes256', secret)(buffer, 'hex');
  const decrypted = res.toString();

  return salt.length
    ? decrypted.slice(0, -salt.length)
    : decrypted;
}
