import pkg from 'pg';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { Buffer } from 'node:buffer';
import jwt from 'jsonwebtoken';
dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


const decryptToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded
}

const fixurl = (url) => {
  url = url.replace(/^https?:\/\//, '');
  url = url.replace(/\/$/, '');
  return url;
}

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
    const { token, site, iv } = req.body;
    const jwtData = await decryptToken(token)
    const result = await pool.query(
      'select data,tag from vault where uuid = $1 AND site = $2 AND iv = $3', [jwtData.uuid, site, iv]
    );
    const { data: encryptedData, tag } = result.rows[0];
    const decryptedResult = await decrypt(jwtData.key, encryptedData, iv, tag);
    res.status(201).json(decryptedResult);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'database error' });
  }
};

export const sitesData = async (req, res) => {
  try {
    const { token } = req.body;
    const jwtData = await decryptToken(token)
    const result = await pool.query(
      'select site, iv, created_at from vault where uuid = $1 ', [jwtData.uuid]
    );
    res.status(201).json(result.rows);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'database error' });
  }
};



export const dataEncrypt = async (req, res) => {
  const { site, username, password, token } = req.body;
  const jwtData = await decryptToken(token)
  const data = encrypt(jwtData.key, username, password)
  const siteurl = await fixurl(site)
  try {
    const result = await pool.query(
      'insert into vault (uuid, iv, tag, site, data) values ($1, $2 , $3 , $4, $5) returning *',
      [jwtData.uuid, data.iv, data.tag, siteurl, data.encryptedData]
    );
    let info = { site: siteurl, created_at: new Date(), iv: data.iv }
    res.json(info);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'database error' });
  }
};



