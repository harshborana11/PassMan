import express from 'express';
const router = express.Router();
import { dataEncrypt, dataDecrypt, sitesData } from '../controllers/data.js';
import checkAuth from '../middleware/varifyJWT.js';

router.post('/encrypt', checkAuth, dataEncrypt);
router.post('/decrypt', checkAuth, dataDecrypt);
router.post('/sites', checkAuth, sitesData);
export default router;
