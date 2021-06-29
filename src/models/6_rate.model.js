const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const rateSchema = mongoose.Schema(
  {
    rate: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

rateSchema.plugin(toJSON);

const Rate = mongoose.model("Rate", rateSchema);

module.exports = Rate;
