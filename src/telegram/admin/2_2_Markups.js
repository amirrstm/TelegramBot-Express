const { Markup } = require("telegraf");
const constants = require("./2_1_Consts");

class AdminMarkup {
  loginMarkup() {
    return Markup.inlineKeyboard([[{ text: constants.loginText, callback_data: "LOGIN_TO_ADMIN" }]]);
  }

  userActionsMarkup(userId) {
    return Markup.inlineKeyboard([
      [
        {
          text: constants.users.acceptance,
          callback_data: JSON.stringify({ userId, active: true }),
        },
        {
          text: constants.users.ignorance,
          callback_data: JSON.stringify({ userId, active: false }),
        },
      ],
    ]);
  }

  orderActionsMarkup(orderId) {
    return Markup.inlineKeyboard([
      [
        {
          text: constants.orders.acceptance,
          callback_data: JSON.stringify({ active: true, orderId: orderId }),
        },
        {
          text: constants.orders.ignorance,
          callback_data: JSON.stringify({ active: false, orderId: orderId }),
        },
      ],
    ]);
  }

  priceActionsMarkup(price) {
    return Markup.inlineKeyboard([
      [
        {
          text: constants.price.raise(price),
          callback_data: `raise_price`,
        },
        {
          text: constants.price.decrease(price),
          callback_data: `decrease_price`,
        },
      ],
      [
        {
          text: constants.price.confirmation,
          callback_data: `set_amount`,
        },
      ],
      [
        {
          text: constants.price.cancel,
          callback_data: `cancel_amount`,
        },
      ],
    ]);
  }
}

module.exports = AdminMarkup;
