/**
 * Inside this file only add all upload file routes!
 */
import express from 'express';
import upload from '../middleware/upload.js';
import { uploadSubsidy } from '../controllers/uploadFiles/subsidy.js';
import { uploadTds } from '../controllers/uploadFiles/tds.js'
import { uploadMaterial } from '../controllers/uploadFiles/materialDispatched.js';
import { uploadTallyBill } from '../controllers/tallybill.js';
import { uploadMainFile } from '../controllers/uploadFiles/mainFile.js';
import { uploadFarmerShareFile } from '../controllers/FarmerShareDetail.js';

const router = express.Router();

// TDS FILE Upload route
router.post('/upload/tds', upload.single('file'), uploadTds);
// Subsidy Records Upload route
router.post('/upload/subsidy', upload.single('file'), uploadSubsidy);
// Material Dispatched Details file upload route
router.post('/upload/material_dispatch_details', upload.single('file'), uploadMaterial);
// TALLY BILL FILE
router.post("/tally-bill", upload.single("file"), uploadTallyBill);
// Main FY Data upload route
router.post('/upload/main-file', upload.single('file'), uploadMainFile);
// Upload Excel  →  POST /api/upload/farmer-share-details
router.post("/upload/farmer-share-details", upload.single("file"), uploadFarmerShareFile);

export default router;