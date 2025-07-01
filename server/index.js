import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import authapi from './routes/auth.js';
import dataapi from './routes/data.js';
const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
app.use('/api', authapi);
app.use('/api', dataapi);
try {
  const client = await pool.connect();
  console.log('✅ Connected to NeonDB successfully!');
  client.release();
} catch (err) {
  console.error('❌ Failed to connect to NeonDB:', err);
}
const PORT = 5000;
const HOST = '0.0.0.0'; app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
