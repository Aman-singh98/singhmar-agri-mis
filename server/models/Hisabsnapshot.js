/**
 * HisabSnapshot.js
 *
 * Stores the manually confirmed closing balance for a dealer + FY.
 * Used as the opening balance for the next FY — avoids recursive recomputation.
 *
 * One document per (farmerDealerCode + financialYear) — enforced by unique index.
 */

import mongoose from "mongoose";

const hisabSnapshotSchema = new mongoose.Schema(
   {
      farmerDealerCode: {
         type: String,
         required: true,
         trim: true,
      },
      financialYear: {
         type: String,
         required: true,
         trim: true,
      },
      closingBalance: {
         type: Number,
         required: true,
         default: 0,
      },
      savedAt: {
         type: Date,
         default: Date.now,
      },
   },
   { timestamps: false }
);

// One snapshot per dealer per FY.
hisabSnapshotSchema.index(
   { farmerDealerCode: 1, financialYear: 1 },
   { unique: true }
);

const HisabSnapshot = mongoose.model("HisabSnapshot", hisabSnapshotSchema);

export default HisabSnapshot;
