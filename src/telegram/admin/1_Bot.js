const { Telegraf, Scenes, session } = require("telegraf");

const constants = require("./2_1_Consts");
const config = require("../../config/config");

const userController = require("./3_1_UserController");
const orderController = require("./3_2_OrderController");

const LoginWizard = require("./4_1_LoginWizard");
const PriceWizard = require("./4_2_PriceWizard");
const RateWizard = require("./4_3_RateWizard");

const bot = new Telegraf(config.admin_token);
const userBot = new Telegraf(config.bot_token);

bot.start(async (ctx) => userController.getAdmin(ctx));

const loginWizard = LoginWizard();
const priceWizard = PriceWizard();
const rateWizard = RateWizard();

bot.hears(constants.menus.verifiedUsers, async (ctx) => await userController.getAllVerifiedUsersList(ctx));
bot.hears(constants.menus.unverifiedUsers, async (ctx) => await userController.getAllUnverifiedUsersList(ctx));
bot.hears(constants.menus.verifiedOrders, async (ctx) => await orderController.getVerifiedOrders(ctx));
bot.hears(constants.menus.unverifiedOrders, async (ctx) => await orderController.getUnverifiedOrders(ctx));
bot.hears(constants.menus.disableBot, async (ctx) => await userController.handleBotDisable(ctx));

bot.command(async (ctx) => {
  const command = ctx.update.message.text;

  if (command.startsWith("/user_")) {
    const userId = command.split("_")[1];
    await userController.getSingleUser(userId, ctx);
  } else if (command.startsWith("/order_")) {
    const orderId = command.split("_")[1];
    await orderController.getSingleOrder(orderId, ctx);
  } else {
    ctx.reply(constants.undefiendCommand);
  }
});

const stage = new Scenes.Stage([loginWizard, priceWizard, rateWizard]);
bot.use(session());
bot.use(stage.middleware());

bot.action("LOGIN_TO_ADMIN", Scenes.Stage.enter("login-wizard"));
bot.hears(constants.menus.price, Scenes.Stage.enter("price-wizard"));
bot.hears(constants.menus.rateDifference, Scenes.Stage.enter("rate-wizard"));

bot.on("callback_query", async (ctx) => {
  if (ctx.callbackQuery.data.startsWith("{")) {
    const data = JSON.parse(ctx.callbackQuery.data);

    if (data.userId) {
      userController.updateUserActivity(data, ctx).then((user) => {
        if (user.isVerified) {
          userBot.telegram.sendMessage(user.userId, constants.users.clientAccess);
        } else {
          userBot.telegram.sendMessage(user.userId, constants.users.clientReject);
        }
      });
    }
    if (data.orderId) {
      await orderController.updateOrderActivity(data, ctx);
    }
  }
});

module.exports = bot;
