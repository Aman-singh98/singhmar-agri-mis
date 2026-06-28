// import mongoose from "mongoose";

// const farmerShareDetailSchema = new mongoose.Schema(
//    {
//       farmerDealerCode: {
//          type: String,
//          required: [true, "Farmer dealer code is required"],
//          trim: true,
//       },
//       financialYear: {
//          type: String,
//          required: [true, "Financial year is required"],
//          trim: true,
//       },
//       srNo: {
//          type: Number,
//          required: [true, "Sr. No. is required"],
//       },
//       name: {
//          type: String,
//          required: [true, "Farmer name is required"],
//          trim: true,
//       },
//       miNumber: {
//          type: String,
//          required: [true, "MI Number is required"],
//          trim: true,
//       },
//       brandName: {
//          type: String,
//          trim: true,
//          default: null,
//       },
//       mobileNo: {
//          type: String,
//          trim: true,
//          default: null,
//       },
//       areaInAcre: {
//          type: Number,
//          default: null,
//       },
//       village: {
//          type: String,
//          trim: true,
//          default: null,
//       },
//       type: {
//          type: String,
//          trim: true,
//          default: null,
//       },
//       dealerName: {
//          type: String,
//          trim: true,
//          default: null,
//       },
//       scanNo: {
//          type: String,
//          trim: true,
//          default: null,
//       },
//       estimateAmount: {
//          type: Number,
//          default: null,
//       },
//       onlineFarmerShareStatus: {
//          type: String,
//          trim: true,
//          default: null,
//       },
//       challanSubmitted: {
//          type: String,
//          trim: true,
//          default: null,
//       },
//       cadaAccountNo: {
//          type: String,
//          trim: true,
//          default: null,
//       },
//       farmerShare: {
//          type: Number,
//          default: null,
//       },
//       farmerSharePercentage: {
//          type: Number,
//          default: null,
//       },
//       perAcreCosting: {
//          type: Number,
//          default: null,
//       },
//       difference: {
//          type: Number,
//          default: null,
//       },
//       farmerShareDeposit: {
//          type: Number,
//          default: null,
//       },
//       depositDate: {
//          type: Date,
//          default: null,
//       },
//       returnFarmerShare: {
//          type: Number,
//          default: null,
//       },
//       returnDate: {
//          type: Date,
//          default: null,
//       }
//    },
//    {
//       timestamps: true,
//    }
// );

// // Index for fast lookup by dealer + financial year
// farmerShareDetailSchema.index({ farmerDealerCode: 1, financialYear: 1 });

// const FarmerShareDetail = mongoose.model(
//    "FarmerShareDetail",
//    farmerShareDetailSchema
// );

// export default FarmerShareDetail;
















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