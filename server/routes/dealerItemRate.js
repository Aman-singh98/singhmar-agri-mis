/**
 * dealerItemRate.route.js
 *
 * Mount in your main app:
 *   import dealerItemRateRouter from "./routes/dealerItemRate.route.js";
 *   app.use("/api/dealer-item-rates", dealerItemRateRouter);
 */

import express from "express";
import {
   listDealerItemRates,
   createDealerItemRate,
   updateDealerItemRate,
   deleteDealerItemRate,
} from "../controllers/dealerItemRate.js";
// import { protect } from "../middleware/auth.middleware.js"; // swap for your auth middleware name

const router = express.Router();

// All routes require authentication
// router.use(protect);

// ─────────────────────────────────────────────────────────────
// GET    /api/dealer-item-rates?dealer=<id>&financialYear=25-26
// POST   /api/dealer-item-rates
// ─────────────────────────────────────────────────────────────
router
   .route("/")
   .get(listDealerItemRates)
   .post(createDealerItemRate);

// ─────────────────────────────────────────────────────────────
// PUT    /api/dealer-item-rates/:id
// DELETE /api/dealer-item-rates/:id
// ─────────────────────────────────────────────────────────────
router
   .route("/:id")
   .put(updateDealerItemRate)
   .delete(deleteDealerItemRate);

export default router;
