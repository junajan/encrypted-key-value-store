import crypto from 'crypto-promise';
import * as constants from '../constants';

export async function randomString (len = 16) {
  const buffer = await crypto.randomBytes(len);
  return buffer.toString('hex').slice(0, len);
}

export async function encrypt (secret, value, salt = '') {
  const buffer = await crypto.cipher(constants.ENCRYPTION_ALGORITHM, secret)(`${value}${salt}`);
  return buffer.toString('Base64');
}

export async function decrypt (secret, encryptedValue, salt = '') {
  const buffer = Buffer.from(encryptedValue, 'Base64');
  const decrypted = await crypto.decipher(constants.ENCRYPTION_ALGORITHM, secret)(buffer, 'hex');

  return decrypted.toString().slice(0, -salt.length);
}
