import mongoose from 'mongoose';

const subsidyRecordSchema = new mongoose.Schema(
	{
		financialYear: { type: String, required: true },
		sn: { type: Number },
		lotNo: { type: Number },
		district: { type: String },
		block: { type: String },
		village: { type: String },
		applicationId: { type: String },
		farmerDealerCode: { type: String },
		name: { type: String },
		fatherName: { type: String },
		vendorName: { type: String },
		type: { type: String },
		areaInAcre: { type: Number },
		assistanceToBePaid: { type: Number, required: true },
		dealerName: { type: String },
		billValue: { type: Number }
	},
	{ timestamps: true }
);

subsidyRecordSchema.index({ financialYear: 1, farmerDealerCode: 1 });

export default mongoose.model('SubsidyRecord', subsidyRecordSchema, "subsidy_records");