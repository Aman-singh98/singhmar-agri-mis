/**
 * financialYear.model.js
 * Mongoose schema for a financial year entry.
 */

import mongoose from "mongoose";

const financialYearSchema = new mongoose.Schema(
   {
   label: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  match: [/^\d{4}-\d{2}$/, "Format must be YYYY-YY (e.g. 2026-27)"],
  validate: {
    validator: function (val) {
      const [startStr, endStr] = val.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      return end === (start + 1) % 100; // e.g. 2026 → suffix must be 27
    },
    message: "Invalid financial year. Suffix must be startYear+1 (e.g. 2026-27, not 2026-28).",
  },
},
      startYear: {
         type: Number,
         required: true,
      }
   },
   { timestamps: true }
);

const FinancialYear = mongoose.model("FinancialYear", financialYearSchema);

export default FinancialYear;
