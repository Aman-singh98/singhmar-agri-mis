import express from "express";
import upload from '../middleware/upload.js';
import {
  uploadMicadaSheet,
  getAllMicada,
  getMicadaById,
  updateMicada,
  deleteMicada,
  bulkDeleteMicada
} from "../controllers/micada.js";
import { protect } from "../middleware/authMiddleware.js"; // ← add karo

const router = express.Router();

router.post("/upload/micada",protect, upload.single("file"), uploadMicadaSheet);
router.delete("/bulk-delete",protect, bulkDeleteMicada);
router.get("/micada",protect, getAllMicada);
router.get("/micada/:id",protect, getMicadaById);
router.put("/micada/:id",protect, updateMicada);
router.delete("/micada/:id",protect, deleteMicada);

export default router;