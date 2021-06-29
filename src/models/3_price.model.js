const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const priceSchema = mongoose.Schema(
  {
    sellToUs: {
      type: Number,
      required: true,
    },
    buyFromUs: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
priceSchema.plugin(toJSON);

const Price = mongoose.model("Price", priceSchema);

module.exports = Price;
