import mongoose from 'mongoose';

const farmerShareDetailSchema = new mongoose.Schema(
  {
    financialYear: { type: String, index: true },
    srNo: { type: Number },
    name: { type: String, trim: true },
    miNumber: { type: String, trim: true, index: true },
    brandName: { type: String, trim: true },
    mobileNo: { type: String, trim: true },
    areaInAcre: { type: Number },
    village: { type: String, trim: true },
    type: { type: String, trim: true },
    dealerName: { type: String, trim: true },
    farmerDealerCode: { type: String, trim: true, index: true },
    scanNo: { type: String, trim: true },
    estimateAmount: { type: Number },
    onlineFarmerShareStatus: { type: String, trim: true },
    challanSubmitted: { type: String, trim: true },
    cadaAccountNo: { type: String, trim: true },
    farmerShare: { type: Number },
    farmerSharePercentage: { type: Number },
    perAcreCosting: { type: Number },
    difference: { type: Number },
    farmerShareDeposit: { type: Number },
    depositDate: { type: Date },
    returnFarmerShare: { type: Number },
    returnDate: { type: Date },
  },
  { timestamps: true }
);

farmerShareDetailSchema.index({ farmerDealerCode: 1, financialYear: 1 });

export default mongoose.model('FarmerShareDetail', farmerShareDetailSchema);