/**
 * DealerItemRate.js
 *
 * Dealer-specific item rate overrides, scoped per financial year.
 *
 * Priority in hisabCalculator:
 *   DealerItemRate (dealer + FY match) → wins
 *   ItemRate (global)                  → fallback
 */

import mongoose from "mongoose";

const dealerItemRateSchema = new mongoose.Schema(
   {
      dealer: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Dealers",
         required: [true, "Dealer is required"],
      },
      financialYear: {
         type: String,
         required: [true, "Financial year is required"],
         trim: true,
         match: [/^\d{2}-\d{2}$/, "Format must be YY-YY (e.g. 25-26)"],
      },
      itemName: {
         type: String,
         required: [true, "Item name is required"],
         trim: true,
      },
      rateUpto: {
         type: Number,
         required: [true, "Rate (upto) is required"],
         min: [0, "Rate cannot be negative"],
      },
      rateFrom: {
         type: Number,
         required: [true, "Rate (from) is required"],
         min: [0, "Rate cannot be negative"],
      },
   },
   { timestamps: true }
);

// One override per item per dealer per financial year
dealerItemRateSchema.index(
   { dealer: 1, financialYear: 1, itemName: 1 },
   { unique: true }
);

const DealerItemRate = mongoose.models.DealerItemRate || mongoose.model("DealerItemRate", dealerItemRateSchema);

export default DealerItemRate;
