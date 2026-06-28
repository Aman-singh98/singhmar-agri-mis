import mongoose from "mongoose";

const micadaSchema = new mongoose.Schema(
  {
    // ✅ Record hash - unique identifier for exact duplicate detection
    recordHash: {
      type: String,
      index: true,
      required: true,
    },
    financialYear: {
      type: String,
      required: true,
      index: true,
    },
    appId: {
      type: String,
      trim: true,
      index: true,
    },
    programmeName: {
      type: String,
      trim: true,
    },
    farmerName: {
      type: String,
      trim: true,
      index: true,
    },
    village: {
      type: String,
      trim: true,
      index: true,
    },
    block: {
      type: String,
      trim: true,
      index: true,
    },
    district: {
      type: String,
      trim: true,
      index: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    dateOfApplication: {
      type: String,
      trim: true,
    },
    totalArea: {
      type: Number,
      default: null,
    },
    currentStatus: {
      type: String,
      trim: true,
      index: true,
    },
    // ✅ NEW: Short-form status, auto-derived from currentStatus via micadaStatusMap.js
    // Saved alongside currentStatus so both raw MICADA text and our short form persist.
    shortStatus: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ CRITICAL: Compound index for exact duplicate prevention
// recordHash + financialYear = Unique record identification
micadaSchema.index({ recordHash: 1, financialYear: 1 }, { unique: false });

// ✅ Index for compound searches
micadaSchema.index({ financialYear: 1, farmerName: 1 });
micadaSchema.index({ district: 1, block: 1, village: 1 });
micadaSchema.index({ currentStatus: 1, financialYear: 1 });

// ✅ Index for finding all records with same MI number
micadaSchema.index({ appId: 1, financialYear: 1 });

const Micada = mongoose.model("Micada", micadaSchema);

export default Micada;