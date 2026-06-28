import mongoose from "mongoose";
import {
   HDPE_ITEM_KEYS,
   LATERAL32_ITEM_KEYS,
   FITTINGS_ITEM_KEYS,
   SPRINKLER_ITEM_KEYS,
   ALUMINIUM_ITEM_KEYS,
   PVC_PIPE_ITEM_KEYS,
   INLINE_LATERAL_ITEM_KEYS,
   FILTER_ITEM_KEYS,
   MISC_ITEM_KEYS,
} from "../constant/ItemRates.js";

const buildItemFields = (keys) =>
   keys.reduce((acc, key) => {
      acc[key] = { type: Number, default: 0, min: 0 };
      return acc;
   }, {});

const subSchema = (keys) =>
   new mongoose.Schema(buildItemFields(keys), { _id: false });

const shiftingEntrySchema = new mongoose.Schema(
   {
      dealer: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Dealers",
         required: [true, "Dealer is required"],
      },
      financialYear: {
         type: String,
         required: [true, "Financial year is required"],
         match: [/^(\d{2}|\d{4})-\d{2}$/, "Format must be YY-YY or YYYY-YY e.g. 22-23 or 2024-25"],
      },
      hdpe: { type: subSchema(HDPE_ITEM_KEYS), default: {} },
      lateral32: { type: subSchema(LATERAL32_ITEM_KEYS), default: {} },
      fittings: { type: subSchema(FITTINGS_ITEM_KEYS), default: {} },
      sprinklerParts: { type: subSchema(SPRINKLER_ITEM_KEYS), default: {} },
      aluminiumParts: { type: subSchema(ALUMINIUM_ITEM_KEYS), default: {} },
      pvcPipes: { type: subSchema(PVC_PIPE_ITEM_KEYS), default: {} },
      inlineLaterals: { type: subSchema(INLINE_LATERAL_ITEM_KEYS), default: {} },
      filters: { type: subSchema(FILTER_ITEM_KEYS), default: {} },
      misc: { type: subSchema(MISC_ITEM_KEYS), default: {} },
      returnDate: {
         type: Date,
         required: [true, "Return date is required"],
      },
      remarks: {
         type: String,
         trim: true,
         maxlength: 500,
      },
   },
   { timestamps: true }
);

shiftingEntrySchema.index({ dealer: 1, financialYear: 1 }, { unique: true });

const ShiftingEntry = mongoose.model("ShiftingEntry", shiftingEntrySchema);

export default ShiftingEntry;