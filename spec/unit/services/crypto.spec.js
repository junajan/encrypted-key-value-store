import { expect } from 'chai';
import * as crypto  from '../../../src/services/crypto';

describe('Crypto', () => {
  it('should create a random string with defined length', async () => {
    const len = 10;
    const str1 = await crypto.randomString(len);
    const str2 = await crypto.randomString(len);

    expect(str1).to.have.length(len);
    expect(str2).to.have.length(len);
    expect(str1).to.not.equal(str2);
  });

  it('should encrypt a string', async () => {
    const str = 'abcd';
    const salt = 'salt';
    const key = 'secretKey';
    const expectedBase64 = '4FBqgmEfZlI9Gh3mpv0Kgw==';

    const encrypted = await crypto.encrypt(key, str, salt);
    expect(encrypted).to.equal(expectedBase64);
  });

  it('should decrypt a string', async () => {
    const salt = 'salt';
    const key = 'secretKey';
    const encrypted = '4FBqgmEfZlI9Gh3mpv0Kgw==';
    const expected = 'abcd';

    const decrypted = await crypto.decrypt(key, encrypted, salt);
    expect(decrypted).to.equal(expected);
  });
});