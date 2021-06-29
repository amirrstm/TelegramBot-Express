const { Markup } = require("telegraf");
const constants = require("./2_1_Consts");

const mainMenu = () => {
  return Markup.keyboard([
    [constants.menus.rateDifference, constants.menus.price],
    [constants.menus.verifiedOrders, constants.menus.unverifiedOrders],
    [constants.menus.verifiedUsers, constants.menus.unverifiedUsers],
    [constants.menus.disableBot],
  ])
    .oneTime()
    .resize();
};

const noPriceMenu = () => {
  return Markup.keyboard([
    [constants.menus.rateDifference],
    [constants.menus.verifiedOrders, constants.menus.unverifiedOrders],
    [constants.menus.verifiedUsers, constants.menus.unverifiedUsers],
    [constants.menus.disableBot],
  ])
    .oneTime()
    .resize();
};

const cancelMenu = () => {
  return Markup.keyboard([[constants.cancelGlobal]])
    .oneTime()
    .resize();
};

module.exports = { mainMenu, cancelMenu, noPriceMenu };
