
import mongoose from "mongoose";

const mainFileSchema = new mongoose.Schema(
  {
    financialYear: {
      type: String,
      default: null,
    },
    srNo: {
      type: Number,
      default: null,
    },
    scanNo: {
      type: String,
      trim: true,
    },
    brandName: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    fatherName: {
      type: String,
      trim: true,
    },
    mobileNo: {
      type: String,
      trim: true,
    },
    dealerName: {
      type: String,
      trim: true,
    },
    farmerDealerCode: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    block: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    irrigationType: {
      type: String,
      trim: true,
    },
    areaInAcre: {
      type: Number,
      default: null,
    },
    familyId: {
      type: String,
      trim: true,
    },
    farmerCode: {
      type: String,
      trim: true,
    },
    miNumber: {
      type: String,
      trim: true,
    },
    applicationStatus: {
      type: String,
      trim: true,
    },
    onlineStatus: {
      type: String,
      trim: true,
    },
    error: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Fast searching ke liye
mainFileSchema.index({ financialYear: 1, farmerDealerCode: 1 });

// ✅ Duplicate prevention — scanNo + financialYear combination unique hoga
// sparse: true — null values pe duplicate allow karega (jinka FY nahi)
mainFileSchema.index(
  { scanNo: 1, financialYear: 1 },
  { unique: true, sparse: true, name: "unique_scanNo_financialYear" }
);

const MainFile = mongoose.model("MainFile", mainFileSchema);

export default MainFile;