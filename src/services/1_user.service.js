const httpStatus = require("http-status");

const { User } = require("../models");
const ApiError = require("../utils/ApiError");

const createUser = async (userBody) => {
  if (await User.isNationalCodeTaken(userBody.nationalCode)) {
    throw new Error("Email already taken");
  }
  const user = await User.create(userBody);
  return user;
};

const updateUser = async (userBody, userId) => {
  const foundUser = await User.findOne({ userId });
  foundUser.isVerified = userBody.isVerified;
  const updatedUser = await foundUser.save();
  return updatedUser;
};

const getAllVerifiedUsers = async () => {
  return User.find({ isVerified: true });
};

const getAllUnverifiedUsers = async () => {
  return User.find({ isVerified: false });
};

const getUserById = async (id) => {
  return User.findById(id);
};

const findUserByNationalCode = async (nationalCode) => {
  return User.findOne({ nationalCode });
};

const getUserByTelegramId = async (userId) => {
  return User.findOne({ userId });
};

module.exports = {
  createUser,
  updateUser,
  getUserById,
  getAllVerifiedUsers,
  getUserByTelegramId,
  getAllUnverifiedUsers,
  findUserByNationalCode,
};
