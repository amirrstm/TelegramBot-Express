const { Admin } = require("../models");

const createAdmin = async (adminBody) => {
  const admin = await Admin.create(adminBody);
  return admin;
};

const getAllAdmins = async () => {
  return Admin.find();
};

const getAdminByTelegramId = async (userId) => {
  return Admin.findOne({ userId });
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminByTelegramId,
};
