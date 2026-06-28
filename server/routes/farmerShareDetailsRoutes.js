import express from 'express';
import { getFarmerShareDetails } from '../controllers/FarmerShareDetail.js';

const router = express.Router();

// GET /api/main-fy-sheet
router.get('/farmer-share', getFarmerShareDetails);
export default router;