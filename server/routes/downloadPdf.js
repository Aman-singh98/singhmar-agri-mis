/**
 * routes/downloadPdf.js
 *
 * Fix: added 5-minute timeout for PDF generation routes.
 * The dealerMaster PDF reads from DB snapshot so it's fast,
 * but the timeout protects against any unexpected slow cases.
 */

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { downloadPDF } from '../controllers/downloadPDF.js';

const router = express.Router();

function extendTimeout(req, res, next) {
   req.setTimeout(300_000);   // 5 min request timeout
   res.setTimeout(300_000);   // 5 min response timeout
   next();
}

router.post('/pdf', protect, extendTimeout, downloadPDF);

export default router;
