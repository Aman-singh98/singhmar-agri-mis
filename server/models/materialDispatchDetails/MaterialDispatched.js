import mongoose from 'mongoose';

const materialDispatchedSchema = new mongoose.Schema(
	{
		financialYear: { type: String, required: true },
		srNo: { type: Number },
		farmerDealerCode: { type: String },
		dealerName: { type: String },
		farmerName: { type: String },
		address: { type: String },
		brandName: { type: String },
		date: { type: Date },
		challanNo: { type: String },
		vehicleNo: { type: String },
		destination: { type: String },
		miniAcres: { type: Number },
		miniFarmerShare: { type: Number },
		dripAcres: { type: Number },
		dripFarmerShare: { type: Number },
		hdpeAcres: { type: Number },
		hdpeFarmerShare: { type: Number },
		reference: { type: String },
	},
	{ timestamps: true }
);

materialDispatchedSchema.index({ financialYear: 1, farmerDealerCode: 1 });

export default mongoose.model('MaterialDispatched', materialDispatchedSchema, "material_dispatched_acre_details");