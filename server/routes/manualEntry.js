import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from '../middleware/upload.js';
import {
   getAllPaidCash, addPaidCash, deletePaidCash,
   getAllIncentives, addIncentive, deleteIncentive,
   updatePaidCash,
   updateIncentive
} from "../controllers/manualEntry/manualEntry.js";
import { getInventory, uploadInventory, deleteInventory } from "../controllers/manualEntry/Inventory.js";

const router = express.Router();

// All routes protected
router.use(protect);

// Paid Cash
router.get("/paid-cash", getAllPaidCash);
router.post("/paid-cash", addPaidCash);
router.put("/paid-cash/:id", updatePaidCash);
router.delete("/paid-cash/:id", deletePaidCash);

// Incentives
router.get("/incentives", getAllIncentives);
router.post("/incentives", addIncentive);
router.put("/incentives/:id", updateIncentive);
router.delete("/incentives/:id", deleteIncentive);

// Inventory
router.post("/inventory", upload.single("file"), uploadInventory);
router.get("/inventory", getInventory);
router.delete("/inventory", deleteInventory);   // bulk delete by dealerName + financialYear

export default router;