import dotenv from 'dotenv';
import crypto from 'crypto';
import { Buffer } from 'node:buffer';
dotenv.config();
const encrypt = (key, usernametext, passwordtext) => {
  const iv = crypto.randomBytes(12).toString('base64');
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(key, 'base64'),
    Buffer.from(iv, 'base64')
  );
  let jsonData = JSON.stringify({ usernametext, passwordtext });
  let encryptedData = cipher.update(jsonData, 'utf8', 'base64');
  encryptedData += cipher.final('base64');
  const tag = cipher.getAuthTag()
  return { encryptedData, iv, tag }
}

const decrypt = async (key, encryptedData, iv, tag) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(key, 'base64'),
    Buffer.from(iv, 'base64')
  );

  // set the authentication tag for the decipher object
  decipher.setAuthTag(Buffer.from(tag, 'base64'));

  // update the decipher object with the base64-encoded ciphertext
  let plaintext = decipher.update(encryptedData, 'base64', 'utf8');

  // finalize the decryption process
  plaintext += decipher.final('utf8');

  return plaintext;
}



(async () => {
  const key = crypto.randomBytes(32);
  const username = 'lorem';
  const password = 'ipsum';
  const result = await encrypt(key.toString('base64'), username, password);
  const decryptedResult = await decrypt(key.toString('base64'), result.encryptedData, result.iv.toString('base64'), result.tag.toString('base64'));
})();
