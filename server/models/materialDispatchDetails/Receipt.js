import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema(
	{
		financialYear: { type: String, required: true },
		srNo: { type: Number },
		date: { type: Date },
		dealerName: { type: String },
		farmerDealerCode: { type: String },
		amount: { type: Number },
		remark1: { type: String },
		remark2: { type: String }

	},
	{ timestamps: true }
);

receiptSchema.index({ financialYear: 1, dealerName: 1 });
receiptSchema.index({ financialYear: 1, date: 1 });

export default mongoose.model('Receipt', receiptSchema, "material_dispatched_receipts");