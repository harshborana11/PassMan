import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { Buffer } from 'node:buffer';
const router = express.Router();
dotenv.config();
//
// const { Pool } = pkg;
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });
//

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
  console.log(encryptedData)
  return { encryptedData, iv, tag }
}


router.post('/datapush', async (req, res) => {
  try {
    const { site, username, password, key, uuid } = req.body;
    console.log('Incoming data:', req.body);
    const data = encrypt(key.toString('base64'), username, password);
    res.status(201).json(data);
  } catch (err) { console.log(err) }


  // const { site, username, password, key, uuid } = req.body;
  // console.log(req.body)
  // const data = encrypt(key, username, password)
  // console.log(data)
  // res.json(data);
  // // try {
  // //   // const result = await pool.query(
  // //   //   'insert into vault (uuid, iv, site, username, password) values ($1, $2 , $3 , $4, $5) returning *',
  // //   //   [uuid, data.iv, site, data.username, data.password, data.tag]
  // //   // );
  // //   // res.status(201).json(result.rows[0]); // send back the created user
  // } catch (err) {
  //   console.error('error inserting user:', err);
  //   res.status(500).json({ error: 'database error' });
  // }
});



export default router;
