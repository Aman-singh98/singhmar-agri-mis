import express from "express";
import { getSummary, deleteCollection } from "../controllers/dataManager.js";

const router = express.Router();

// GET /api/data/summary?financialYear=26-27
router.get("/summary", getSummary);
// DELETE /api/data?financialYear=26-27&collections=mainFile
router.delete("/", deleteCollection);

export default router;
