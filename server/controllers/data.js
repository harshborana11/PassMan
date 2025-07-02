import pkg from 'pg';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { Buffer } from 'node:buffer';
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
  return { encryptedData, iv: iv.toString('base64'), tag: tag.toString('base64') }
}
const decrypt = async (key, encryptedData, iv, tag) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(key, 'base64'),
    Buffer.from(iv, 'base64')
  );
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  let plaintext = decipher.update(encryptedData, 'base64', 'utf8');
  plaintext += decipher.final('utf8');
  return plaintext;
}



export const dataDecrypt = async (req, res) => {
  try {
    const { uuid, site, key } = req.body;
    const result = await pool.query(
      'select data ,iv, tag from vault where uuid = $1 AND site = $2 ', [uuid, site]
    );

    const { data: encryptedData, iv, tag } = result.rows[0];
    const decryptedResult = await decrypt(key, encryptedData, iv, tag);
    res.status(201).json(decryptedResult);
  } catch (err) {
    console.error('error inserting user:', err);
    res.status(500).json({ error: 'database error' });
  }
};

export const sitesData = async (req, res) => {
  try {
    const { uuid } = req.body;
    const result = await pool.query(
      'select site from vault where uuid = $1 ', [uuid]
    );
    res.status(201).json(result.rows);
  } catch (err) {
    console.error('error inserting user:', err);
    res.status(500).json({ error: 'database error' });
  }
};



export const dataEncrypt = async (req, res) => {
  const { site, username, password, key, uuid } = req.body;
  const data = encrypt(key, username, password)
  res.json(data);
  try {
    const result = await pool.query(
      'insert into vault (uuid, iv, tag, site, data) values ($1, $2 , $3 , $4, $5) returning *',
      [uuid, data.iv, data.tag, site, data.encryptedData]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('error inserting user:', err);
    res.status(500).json({ error: 'database error' });
  }
};



