const { Telegraf } = require("telegraf");

const menus = require("./2_3_Menus");
const constants = require("./2_1_Consts");
const AdminMarkupsModel = require("../admin/2_2_Markups");

const utils = require("../extra/utils");
const config = require("../../config/config");
const OrderModel = require("../orders/Orders");
const { orderService, priceService, userService, adminService, transactionService } = require("../../services");

const markups = new AdminMarkupsModel();
const orderModel = new OrderModel();
const adminBot = new Telegraf(config.admin_token);

const getOrderPrice = async (userId, type, ctx) => {
  try {
    const price = await priceService.getLastPrice();
    const foundUser = await userService.getUserByTelegramId(userId);

    if (!foundUser || !foundUser.isVerified) {
      ctx.reply(constants.notActiveAccount);
      return null;
    }

    if (!price) {
      ctx.reply(type === "buy" ? constants.orders.buyPriceError : constants.orders.sellPriceError);
      return null;
    } else if (price) {
      ctx.reply(orderModel.getOrderDealingText(type, price), menus.cancelMenu());
      return { price, user: foundUser };
    }
  } catch (err) {
    return ctx.reply(utils.showError(err));
  }
};

const createOrder = async (orderData, ctx) => {
  try {
    const admins = await adminService.getAllAdmins();
    const foundOrder = await orderService.createOrder(orderData);

    if (foundOrder) {
      admins.forEach((admin) => {
        orderModel
          .getActivationInfo(foundOrder, "client")
          .then((order) =>
            adminBot.telegram.sendMessage(admin.userId, order, markups.orderActionsMarkup(foundOrder._id))
          )
          .catch((err) => ctx.reply(utils.showError(err)));
      });
    } else {
      return ctx.reply(utils.showError({ message: "Order Not Found!" }));
    }

    return foundOrder;
  } catch (err) {
    return ctx.reply(utils.showError(err));
  }
};

const getTransactionsList = async (userId, ctx) => {
  try {
    const foundUser = await userService.getUserByTelegramId(userId);
    const transactions = await transactionService.getUserTransactions(foundUser._id);

    if (!foundUser.isVerified) return ctx.reply(constants.notActiveAccount);

    if (transactions.length === 0) {
      ctx.reply(constants.orders.transactionEmptyList);
    } else {
      orderModel
        .getTransactionsList(transactions)
        .then((trData) => ctx.reply(trData))
        .catch((err) => ctx.reply(utils.showError(err)));
    }
  } catch (err) {
    return ctx.reply(utils.showError(err));
  }
};

module.exports = { getOrderPrice, createOrder, getTransactionsList };
