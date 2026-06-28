import mongoose from 'mongoose';

const tdsRecordSchema = new mongoose.Schema(
	{
		financialYear: { type: String, required: true },
		srNo: { type: Number },
		dealerName: { type: String, required: true },
		farmerDealerCode: { type: String, required: true },
		company: { type: String },
		farmerName: { type: String },
		fatherName: { type: String },
		address: { type: String },
		panNo: { type: String },
		turnover: { type: Number },
		commissionAmount: { type: Number },
				tdsAmount: { type: Number},
		payableAmount: { type: Number },
		tds: { type: Number, required: true }
	},
	{ timestamps: true }
);

tdsRecordSchema.index({ financialYear: 1, farmerDealerCode: 1 });

export default mongoose.model('TdsRecord', tdsRecordSchema, "tds_records");