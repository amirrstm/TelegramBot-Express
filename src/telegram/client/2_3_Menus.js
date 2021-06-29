const { Markup } = require("telegraf");
const constants = require("./2_1_Consts");

const mainMenu = () => {
  return Markup.keyboard([
    [constants.menus.buy, constants.menus.sell],
    [constants.menus.accounting, constants.menus.help, constants.menus.contact],
    [constants.menus.sendMessage, constants.menus.channel],
  ])
    .oneTime()
    .resize();
};

const accountingMenu = () => {
  return Markup.keyboard([
    [constants.accounting.transactions, constants.accounting.balance],
    [constants.accounting.cancel],
  ])
    .oneTime()
    .resize();
};

const cancelMenu = () => {
  return Markup.keyboard([[constants.cancelGlobal]])
    .oneTime()
    .resize();
};

const backToMenu = () => {
  return Markup.keyboard([[constants.backToMenu]])
    .oneTime()
    .resize();
};

module.exports = { mainMenu, accountingMenu, cancelMenu, backToMenu };
