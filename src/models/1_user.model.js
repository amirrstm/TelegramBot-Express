const mongoose = require("mongoose");
const validator = require("validator");

const { toJSON, isValidNationalCode } = require("./plugins");

const userSchema = mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nationalCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!isValidNationalCode(value)) {
          throw new Error("Invalid National Code");
        }
      },
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

userSchema.statics.isMobileTaken = async function (
  mobileNumber,
  excludeUserId
) {
  const user = await this.findOne({
    mobileNumber,
    _id: { $ne: excludeUserId },
  });
  return !!user;
};

userSchema.statics.isNationalCodeTaken = async function (
  nationalCode,
  excludeUserId
) {
  const user = await this.findOne({
    nationalCode,
    _id: { $ne: excludeUserId },
  });
  return !!user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
