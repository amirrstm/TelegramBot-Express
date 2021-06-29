const { BotInfo } = require("../models");

const createInfo = async (infoBody) => {
  const info = await BotInfo.create(infoBody);
  return info;
};

const getLastInfo = () => {
  return BotInfo.findOne().sort({ createdAt: -1 });
};

module.exports = {
  createInfo,
  getLastInfo,
};
