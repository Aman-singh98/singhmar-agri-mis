/**
 * @file routes/downloadExcel.js
 *
 * Excel download route — mirrors downloadPdf.js exactly.
 * 5-minute timeout matches the PDF route.
 */

import express from 'express';
import { downloadExcel } from '../controllers/downloadExcel.js';

const router = express.Router();

function extendTimeout(req, res, next) {
   req.setTimeout(300_000);   // 5 min request timeout
   res.setTimeout(300_000);   // 5 min response timeout
   next();
}

router.post('/excel', extendTimeout, downloadExcel);

export default router;
