const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const transactionSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    price: { type: mongoose.Schema.Types.ObjectId, ref: "Price" },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
transactionSchema.plugin(toJSON);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
