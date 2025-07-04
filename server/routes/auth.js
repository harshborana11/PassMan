import express from 'express';
const router = express.Router();
import { signup, login, checkAuth } from '../controllers/auth.js';

router.post('/signup', signup);
router.post('/login', login);
router.post('/checkAuth', checkAuth);
export default router;
