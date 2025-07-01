import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'
import crypto from 'crypto';
const router = express.Router();
const saltRounds = 10;
dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
router.post('/signup', async (req, res) => {
  const { name, email, uuid, pass } = req.body;
  try {
    const password = await bcrypt.hash(pass, saltRounds);
    const result = await pool.query(
      'INSERT INTO users (username, email, uuid , password) VALUES ($1, $2 , $3 , $4) RETURNING *',
      [name, email, uuid, password]
    );
    res.status(201).json(result.rows[0]); // send back the created user
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).json({ error: 'Database error' });
  }
});
router.post('/login', async (req, res) => {
  const { email, pass } = req.body;
  try {
    const result = await pool.query(
      'SELECT uuid, password, email FROM users WHERE email = $1',
      [email]
    );
    const user = result.rows[0];
    const match = await bcrypt.compare(pass, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const key = crypto.pbkdf2Sync(pass, user.uuid, 100000, 32, 'sha256');
    res.status(200).json({ uuid: user.uuid, email: user.email, key: key, message: 'Login successful' });
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
