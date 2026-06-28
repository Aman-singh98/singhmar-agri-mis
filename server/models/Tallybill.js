// import mongoose from "mongoose";

// const tallyBillSchema = new mongoose.Schema(
//    {
//       financialYear: {
//          type: String,
//          required: [true, "Financial year is required"],
//          trim: true,
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
//       date: {
//          type: Date,
//          required: [true, "Date is required"],
//       },
//       type: {
//          type: String,
//          enum: ["Sales", "S Drip Irrigation", "S Mini Sprinkler", null],
//          default: null,
//       },
//       billNo: {
//          type: String,
//          required: [true, "Bill number is required"],
//          unique: true,
//          trim: true,
//       },
//       billValue: {
//          type: Number,
//          required: [true, "Bill value is required"],
//       },
//       gstBarrierDate: {
//          type: Date,
//          default: null,
//       },
//       miNumber: {
//          type: String,
//          default: null,
//          trim: true,
//       },
//       gst: {
//          type: Number,
//          default: null,
//       },
//       scanNo: {
//          type: String,
//          default: null,
//          trim: true,
//       },
//       estimateAmount: {
//          type: Number,
//          default: null,
//       },
//       acre: {
//          type: Number,
//          default: null,
//       },
//       difference: {
//          type: Number,
//          default: null,
//       },
//       farmerName: {
//          type: String,
//          default: null,
//          trim: true,
//       },
//       netAmount: {
//          type: Number,
//          default: null,
//       },
//    },
//    { timestamps: true }
// );

// tallyBillSchema.index({ financialYear: 1, farmerDealerCode: 1 });

// const TallyBill = mongoose.model("TallyBill", tallyBillSchema);
// export default TallyBill;











import mongoose from "mongoose";

const tallyBillSchema = new mongoose.Schema(
   {
      financialYear: {
         type: String,
         required: [true, "Financial year is required"],
         trim: true,
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
      date: {
         type: Date,
         default: null,
      },
          type: {
   type: String,
   default: null,
   trim: true,
},
      billNo: {
         type: String,
         required: [true, "Bill number is required"],
         unique: true,
         trim: true,
      },
      billValue: {
         type: Number,
         default: null,
      },
      gstBarrierDate: {
         type: Date,
         default: null,
      },
      miNumber: {
         type: String,
         default: null,
         trim: true,
      },
      gst: {
         type: Number,
         default: null,
      },
      scanNo: {
         type: String,
         default: null,
         trim: true,
      },
      estimateAmount: {
         type: Number,
         default: null,
      },
      acre: {
         type: Number,
         default: null,
      },
      difference: {
         type: Number,
         default: null,
      },
      farmerName: {
         type: String,
         default: null,
         trim: true,
      },
      netAmount: {
         type: Number,
         default: null,
      },
   },
   { timestamps: true }
);

tallyBillSchema.index({ financialYear: 1, farmerDealerCode: 1 });

const TallyBill = mongoose.model("TallyBill", tallyBillSchema);
export default TallyBill;