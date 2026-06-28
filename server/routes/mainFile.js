import express from "express";
import upload from '../middleware/upload.js';
import { protect } from "../middleware/authMiddleware.js"; // ← add karo
import {
  uploadMainFileSheet,
  getAllMainFile,
  getMainFileById,
  createMainFile,
  updateMainFile,
  deleteMainFile,
  bulkDeleteMainFile,
} from "../controllers/mainFile.js";

const router = express.Router();

router.post("/upload/mainfile", protect, upload.single("file"), uploadMainFileSheet);
router.delete("/bulk-delete", protect, bulkDeleteMainFile);
router.get("/mainfile", protect, getAllMainFile);
router.post("/mainfile", protect, createMainFile);
router.get("/mainfile/:id", protect, getMainFileById);
router.put("/mainfile/:id", protect, updateMainFile);
router.delete("/mainfile/:id", protect, deleteMainFile);

export default router;