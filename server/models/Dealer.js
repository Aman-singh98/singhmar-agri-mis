// import mongoose from "mongoose";

// const DEALER_CODE_REGEX = /^[A-Z]{2}\/\d{2}$/;

// const dealerSchema = new mongoose.Schema(
// 	{
// 		dealerName: {
// 			type: String,
// 			required: [true, "Dealer name is required"],
// 			trim: true,
// 			minlength: [2, "Dealer name must be at least 2 characters"],
// 			// NOTE: unique is handled via collation index below (case-insensitive)
// 		},
// 		farmerDealerCode: {
// 			type: String,
// 			required: [true, "Dealer code is required"],
// 			trim: true,
// 			unique: true,
// 			match: [DEALER_CODE_REGEX, "Dealer code must be in format XX/00 (e.g. MP/08)"],
// 		},
// 		createdBy: {
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: "User",
// 		},
// 	},
// 	{ timestamps: true }
// );

// dealerSchema.index(
// 	{ dealerName: 1 },
// 	{ unique: true, collation: { locale: "en", strength: 2 } }
// );

// const Dealer = mongoose.model("Dealers", dealerSchema);

// export default Dealer;






import mongoose from "mongoose";

const dealerSchema = new mongoose.Schema(
	{
		dealerName: {
			type: String,
			required: [true, "Dealer name is required"],
			trim: true,
			minlength: [2, "Dealer name must be at least 2 characters"],
			// NOTE: unique is handled via collation index below (case-insensitive)
		},
		farmerDealerCode: {
			type: String,
			required: [true, "Dealer code is required"],
			trim: true,
			unique: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

dealerSchema.index(
	{ dealerName: 1 },
	{ unique: true, collation: { locale: "en", strength: 2 } }
);

const Dealer = mongoose.model("Dealers", dealerSchema);

export default Dealer;