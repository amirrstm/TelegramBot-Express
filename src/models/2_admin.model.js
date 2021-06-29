const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const adminSchema = mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
adminSchema.plugin(toJSON);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
