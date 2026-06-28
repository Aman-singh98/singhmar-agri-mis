import express from 'express';
import { protect } from "../middleware/authMiddleware.js";
import { addDealer, deleteDealer, getAllDealers, updateDealer } from '../controllers/dealer/dealerMeta.js';

const router = express.Router();

router.get("/", protect, getAllDealers);
router.post("/add", protect, addDealer);
router.put("/:id", protect, updateDealer);
router.delete("/:id", protect, deleteDealer);

export default router;
