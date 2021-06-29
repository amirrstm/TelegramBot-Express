const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const orderSchema = mongoose.Schema(
  {
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    performed: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    price: { type: mongoose.Schema.Types.ObjectId, ref: "Price" },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
