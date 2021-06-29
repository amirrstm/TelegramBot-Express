const { Telegraf } = require("telegraf");

const constants = require("./2_1_Consts");
const MarkupsModel = require("./2_2_Markups");

const utils = require("../extra/utils");
const config = require("../../config/config");
const OrderModel = require("../orders/Orders");
const { orderService, transactionService } = require("../../services");

const markups = new MarkupsModel();
const orderModel = new OrderModel();
const userBot = new Telegraf(config.bot_token);

const getSingleOrder = async (orderId, ctx) => {
  try {
    const foundOrder = await orderService.getOneOrder(orderId);
    if (foundOrder) {
      orderModel
        .getActivationInfo(foundOrder)
        .then((orderData) => ctx.reply(orderData, markups.orderActionsMarkup(foundOrder._id)))
        .catch((err) => ctx.reply(utils.showError(err)));
    } else {
      return ctx.reply(utils.showError({ message: "Order Not Found!" }));
    }
  } catch (err) {
    return ctx.reply(utils.showError(err));
  }
};

const getVerifiedOrders = async (ctx) => {
  try {
    const orders = await orderService.getAllVerifiedOrders();

    if (orders.length === 0) {
      ctx.reply(constants.orders.emptyList);
    } else {
      orderModel
        .getOrdersList(orders, true)
        .then((orderData) => {
          ctx.reply(orderData);
          ctx.telegram.sendMessage("@khosroshahi_orders", orderData);
        })
        .catch((err) => ctx.reply(utils.showError(err)));
    }
  } catch (err) {
    return ctx.reply(utils.showError(err));
  }
};

const getUnverifiedOrders = async (ctx) => {
  try {
    const orders = await orderService.getAllUnverifiedOrders();

    if (orders.length === 0) {
      ctx.reply(constants.orders.emptyList);
    } else {
      orderModel
        .getOrdersList(orders, false)
        .then((orderData) => {
          ctx.reply(orderData);
          ctx.telegram.sendMessage("@khosroshahi_orders", orderData);
        })
        .catch((err) => ctx.reply(utils.showError(err)));
    }
  } catch (err) {
    return ctx.reply(utils.showError(err));
  }
};

const updateOrderActivity = async (data, ctx) => {
  try {
    const foundOrder = await orderService.getOneOrder(data.orderId);

    if (foundOrder.performed) {
      ctx.deleteMessage();
      return ctx.reply(constants.orders.performedOrder);
    }

    const order = await orderService.updateOrder({ isVerified: data.active }, data.orderId);
    ctx.deleteMessage();

    if (order.isVerified) {
      const transaction = await transactionService.createTransaction({
        order: order._id,
        user: order.user._id,
        price: order.price._id,
      });

      if (transaction) {
        ctx.reply(constants.orders.trSuccess(transaction.order.type));

        const trStatus = orderModel.getTrStatus(transaction.order.type, true);
        const finalText = `${orderModel.getTransactionsStr(transaction)} ${trStatus}`;
        userBot.telegram.sendMessage(order.user.userId, finalText);
      }
    } else {
      ctx.reply(constants.orders.trFailed(order.type));

      const trStatus = orderModel.getTrStatus(order.type, false);
      const finalText = `${orderModel.getTransactionOrder(order)} ${trStatus}`;
      userBot.telegram.sendMessage(order.user.userId, finalText);
    }

    return order;
  } catch (err) {
    return ctx.reply(utils.showError(err));
  }
};

module.exports = { getSingleOrder, getVerifiedOrders, getUnverifiedOrders, updateOrderActivity };
