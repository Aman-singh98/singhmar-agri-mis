// import mongoose from "mongoose";

// const incentiveSchema = new mongoose.Schema(
//    {
//       date: {
//          type: Date,
//          required: [true, "Date is required"],
//       },
//       dealerName: {
//          type: String,
//          required: [true, "Dealer name is required"],
//          trim: true,
//       },
//       farmerDealerCode: {
//          type: String,
//          required: [true, "Dealer code is required"],
//          trim: true,
//       },
//       amount: {
//          type: Number,
//          required: [true, "Amount is required"],
//          min: [1, "Amount must be greater than 0"],
//       },
//       financialYear: {
//          type: String,
//          required: [true, "Financial year is required"],
//          trim: true,
//       },
//       remarks: {
//          type: String,
//          trim: true,
//          default: "",
//       },
//       createdBy: {
//          type: mongoose.Schema.Types.ObjectId,
//          ref: "User",
//       },
//    },
//    { timestamps: true }
// );

// incentiveSchema.index({ farmerDealerCode: 1, financialYear: 1 });

// const Incentive = mongoose.model("Incentive", incentiveSchema);

// export default Incentive;






import mongoose from "mongoose";

const incentiveSchema = new mongoose.Schema(
   {
      date: {
         type: Date,
         required: [true, "Date is required"],
      },
      dealerName: {
         type: String,
         required: [true, "Dealer name is required"],
         trim: true,
      },
      farmerDealerCode: {
         type: String,
         required: [true, "Dealer code is required"],
         trim: true,
      },
      amount: {
         type: Number,
         required: [true, "Amount is required"],
         // Incentives can be negative (e.g. a deduction or reversal against a dealer),
         // so we don't use `min` here — we just disallow exactly zero.
         validate: {
            validator: (v) => v !== 0,
            message: "Amount must not be zero",
         },
      },
      financialYear: {
         type: String,
         required: [true, "Financial year is required"],
         trim: true,
      },
      remarks: {
         type: String,
         trim: true,
         default: "",
      },
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
   },
   { timestamps: true }
);

incentiveSchema.index({ farmerDealerCode: 1, financialYear: 1 });

const Incentive = mongoose.model("Incentive", incentiveSchema);

export default Incentive;