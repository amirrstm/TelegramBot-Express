const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const botInfoSchema = mongoose.Schema(
  {
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
botInfoSchema.plugin(toJSON);

const BotInfo = mongoose.model("BotInfo", botInfoSchema);

module.exports = BotInfo;
