import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { Buffer } from 'node:buffer';
const router = express.Router();
dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


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


(async () => {
  const key = crypto.randomBytes(32);
  console.log(key)
  const username = 'lorem';
  const password = 'ipsum';

  const result = await encrypt(key.toString('base64'), username, password);

  console.log(result);
})();
