import express from "express";
import {
   getItemRates,
   addItemRate,
   addItemRatesBulk,
   updateItemRate,
   deleteItemRate,
} from "../controllers/itemRate.js";

const router = express.Router();

// GET    /api/item-rates  → list all items for a dealer
router.get("/", getItemRates);
// POST   /api/item-rates                      → add one item
router.post("/", addItemRate);
// POST   /api/item-rates/bulk                 → add multiple items at once
router.post("/bulk", addItemRatesBulk);
// PATCH  /api/item-rates/:id                  → update rateUpto / rateFrom
router.patch("/:id", updateItemRate);
// DELETE /api/item-rates/:id                  → delete one item
router.delete("/:id", deleteItemRate);

export default router;
