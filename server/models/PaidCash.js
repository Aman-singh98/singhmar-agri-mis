import mongoose from "mongoose";

const paidCashSchema = new mongoose.Schema(
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
         min: [1, "Amount must be greater than 0"],
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

paidCashSchema.index({ farmerDealerCode: 1, financialYear: 1 });

const PaidCash = mongoose.model("PaidCash", paidCashSchema);

export default PaidCash;