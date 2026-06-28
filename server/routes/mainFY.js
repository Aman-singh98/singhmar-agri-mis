import express from 'express';
import { getMainFYSheet } from '../controllers/uploadFiles/mainFile.js';

const router = express.Router();

// GET /api/main-fy-sheet
router.get('/main-fy-sheet', getMainFYSheet);

export default router;