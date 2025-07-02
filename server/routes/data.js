import express from 'express';
const router = express.Router();
import { dataEncrypt, dataDecrypt, sitesData } from '../controllers/data.js';

router.post('/encrypt', dataEncrypt);
router.post('/decrypt', dataDecrypt);
router.post('/sites', sitesData);
export default router;
