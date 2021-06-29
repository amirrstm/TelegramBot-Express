const { Scenes } = require("telegraf");

const menus = require("./2_3_Menus");
const constants = require("./2_1_Consts");
const MarkupsModel = require("./2_2_Markups");
const orderController = require("./3_2_OrderController");

const utils = require("../extra/utils");
const OrderModel = require("../orders/Orders");
const { botInfoService } = require("../../services");

const markups = new MarkupsModel();
const orderModel = new OrderModel();

const sellWizard = () => {
  return new Scenes.WizardScene(
    "sell-wizard",
    async (ctx) => {
      try {
        const botInfo = await botInfoService.getLastInfo();

        if (botInfo && !botInfo.isActive) {
          ctx.reply(constants.orders.disabled, menus.mainMenu());
          return ctx.scene.leave();
        }

        const userId = ctx.update.message.from.id;
        const priceInfo = await orderController.getOrderPrice(userId, "sell", ctx);

        if (priceInfo && priceInfo.price) {
          ctx.wizard.state.orderData = priceInfo;
          return ctx.wizard.next();
        } else {
          return ctx.scene.leave();
        }
      } catch (err) {
        ctx.reply(utils.showError(err));
        return ctx.scene.leave();
      }
    },
    async (ctx) => {
      if (ctx.message.text === constants.cancelGlobal) {
        ctx.reply(constants.select, menus.mainMenu());
        return ctx.scene.leave();
      }

      try {
        const amountText = utils.convertToEn(ctx.message.text);

        // If Is Not Number
        if (isNaN(amountText)) {
          ctx.reply(constants.orders.numberError);
          return;
        }

        const orderData = ctx.wizard.state.orderData;
        ctx.wizard.state.orderData = { ...orderData, amount: Number(amountText) };

        const orderText = orderModel.getOrderRequestText("sell", orderData.price, Number(amountText));
        ctx.reply(orderText, markups.orderActionsMarkup());

        return ctx.wizard.next();
      } catch (err) {
        ctx.reply(utils.showError(err));
        return ctx.scene.leave();
      }
    },
    async (ctx) => {
      if (ctx.message && ctx.message.text === constants.cancelGlobal) {
        ctx.reply(constants.select, menus.mainMenu());
        return ctx.scene.leave();
      }

      if (!ctx.update.callback_query) {
        ctx.reply(constants.orders.selectError);
        return;
      }

      try {
        if (ctx.update.callback_query.data === "reject_order") {
          ctx.deleteMessage();
          ctx.reply(constants.select, menus.mainMenu());
          return ctx.scene.leave();
        } else if (ctx.update.callback_query.data === "accept_order") {
          const orderData = ctx.wizard.state.orderData;

          const order = await orderController.createOrder(
            {
              type: "sell",
              user: orderData.user._id,
              amount: orderData.amount,
              price: orderData.price._id,
            },
            ctx
          );

          if (order) {
            ctx.deleteMessage();
            ctx.reply(constants.orders.sellSuccess, menus.mainMenu());

            return ctx.scene.leave();
          }
        } else {
          ctx.reply(constants.orders.selectError);
          return;
        }
      } catch (err) {
        ctx.reply(utils.showError(err));
        return ctx.scene.leave();
      }
    }
  );
};

module.exports = sellWizard;
