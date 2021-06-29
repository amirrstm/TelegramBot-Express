const { Rate } = require("../models");

const createRate = async (rateBody) => {
  const price = await Rate.create(rateBody);
  return price;
};

const getLastRate = () => {
  return Rate.findOne().sort({ createdAt: -1 });
};

module.exports = {
  createRate,
  getLastRate,
};
