import pkg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ErrorsOnLogin, ErrorsOnSignup } from '../utils/errors.js';
const saltRounds = 10;
dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


export const signup = async (req, res) => {
  const { name, email, uuid, pass } = req.body;
  try {
    const password = await bcrypt.hash(pass, saltRounds);
    const result = await pool.query(
      'INSERT INTO users (username, email, uuid , password) VALUES ($1, $2 , $3 , $4) RETURNING *',
      [name, email, uuid, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err)
    const responce = ErrorsOnSignup(err)
    res.status(responce.error).json({ error: responce.error, message: responce.message });
  }
};

export const login = async (req, res) => {
  const { email, pass } = req.body;
  try {
    const result = await pool.query(
      'SELECT uuid, password, email FROM users WHERE email = $1',
      [email]
    );
    const user = await result.rows[0];
    const match = await bcrypt.compare(pass, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const key = crypto.pbkdf2Sync(pass, user.uuid, 100000, 32, 'sha256');
    const token = jwt.sign(
      { uuid: user.uuid, key: key },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );
    res.status(200).json({ token: token });
  } catch (err) {
    console.log(err.code)
    const responce = ErrorsOnLogin(err)
    res.status(responce.error).json({ error: responce.error, message: responce.message });
  }
};


export const checkAuth = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ loggedIn: false });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      loggedIn: true,
      uuid: decoded.uuid,
    });
  } catch (err) {
    console.error('JWT verification failed:', err.message);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ loggedIn: false, reason: 'expired' });
    }

    return res.status(401).json({ loggedIn: false });
  }
};

