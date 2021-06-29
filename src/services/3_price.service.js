const { Price } = require("../models");

const createPrice = async (priceBody) => {
  const price = await Price.create(priceBody);
  return price;
};

const getLastPrice = () => {
  return Price.findOne().sort({ createdAt: -1 });
};

module.exports = {
  createPrice,
  getLastPrice,
};
