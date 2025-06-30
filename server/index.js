import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'
import crypto from 'crypto';
const saltRounds = 10;

dotenv.config();

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL pool (NeonDB)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
app.post('/api/users', async (req, res) => {
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
app.post('/api/login', async (req, res) => {
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
    const iv = Buffer.from(user.uuid.replace(/-/g, ''), 'hex');
    const key = crypto.pbkdf2Sync(pass, user.uuid, 100000, 32, 'sha256');
    res.status(200).json({ uuid: user.uuid, email: user.email, key: key, iv: iv, message: 'Login successful' });
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).json({ error: 'Database error' });
  }
});
// Test DB connection
try {
  const client = await pool.connect();
  console.log('✅ Connected to NeonDB successfully!');
  client.release();
} catch (err) {
  console.error('❌ Failed to connect to NeonDB:', err);
}
//
// // Sample route
// app.get('/api/users', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM users');
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Start server
const PORT = 5000;
const HOST = '0.0.0.0'; // Listen on all interfaces, including Tailscale IP

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
