const menus = require("./2_3_Menus");
const constants = require("./2_1_Consts");
const config = require("../../config/config");
const MarkupsModel = require("./2_2_Markups");
const markups = new MarkupsModel();

const { Telegraf, Scenes, session } = require("telegraf");
const bot = new Telegraf(config.bot_token);

const RegisterWizard = require("./4_1_RegisterWizard");
const OrderBuyWizard = require("./4_2_BuyWizard");
const OrderSellWizard = require("./4_3_SellWizard");

const userController = require("./3_1_UserController");
const orderController = require("./3_2_OrderController");

bot.start(async (ctx) => userController.getUser(ctx));

bot.action("REJECT_POLICY", (ctx) => {
  ctx.deleteMessage();
  ctx.reply(constants.policy.text + constants.policy.rejectText, markups.policyRejectMarkup());
});

bot.hears(constants.backToMenu, (ctx) => {
  ctx.reply(constants.select, menus.mainMenu());
});

bot.hears(constants.accounting.cancel, (ctx) => {
  ctx.deleteMessage();
  ctx.reply(constants.select, menus.mainMenu());
});

bot.hears(constants.menus.contact, (ctx) => {
  ctx.reply(constants.contact);
});

bot.hears(constants.menus.accounting, (ctx) => {
  ctx.reply(constants.select, menus.accountingMenu());
});

bot.hears(constants.accounting.balance, (ctx) => {
  ctx.reply(constants.accounting.inactiveSection, menus.accountingMenu());
});

bot.hears(constants.menus.help, (ctx) => {
  ctx.reply(constants.help);
});

bot.hears(constants.menus.channel, (ctx) => {
  ctx.reply(constants.channelInfo);
});

bot.hears(constants.menus.sendMessage, (ctx) => {
  ctx.reply(constants.sendMessage, markups.messageActionMarkup());
});

bot.hears(
  constants.accounting.transactions,
  async (ctx) => await orderController.getTransactionsList(ctx.update.message.from.id, ctx)
);

const stage = new Scenes.Stage([RegisterWizard(), OrderBuyWizard(), OrderSellWizard()]);
bot.use(session());
bot.use(stage.middleware());

bot.action("ACCEPT_POLICY", Scenes.Stage.enter("register-wizard"));
bot.hears(constants.menus.buy, Scenes.Stage.enter("buy-wizard"));
bot.hears(constants.menus.sell, Scenes.Stage.enter("sell-wizard"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = bot;
