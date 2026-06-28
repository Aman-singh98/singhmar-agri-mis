import mongoose from 'mongoose';

const adjustedSheetSchema = new mongoose.Schema(
   {
      financialYear: { type: String, required: true },
      sn: { type: Number },
      farmerDealerCode: { type: String, required: true },
      dealerName: { type: String },
      amount: { type: Number }
   },
   { timestamps: true }
);

adjustedSheetSchema.index({ financialYear: 1, farmerDealerCode: 1 });

export default mongoose.model('AdjustedSheet', adjustedSheetSchema, 'material_dispatched_adjusted');