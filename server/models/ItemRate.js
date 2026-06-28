import mongoose from "mongoose";

const itemRateSchema = new mongoose.Schema(
   {
      itemName: {
         type: String,
         required: [true, "Item name is required"],
         trim: true,
      },
      rateUpto: {
         type: Number,
         required: [true, "Rate (upto) is required"],
         min: [0, "Rate cannot be negative"],
      },
      rateFrom: {
         type: Number,
         required: [true, "Rate (from) is required"],
         min: [0, "Rate cannot be negative"],
      },
   },
   {
      timestamps: true,
   }
);

const ItemRate = mongoose.models.ItemRate || mongoose.model("ItemRate", itemRateSchema);

export default ItemRate;
