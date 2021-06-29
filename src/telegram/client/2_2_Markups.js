const { Markup } = require("telegraf");
const constants = require("./2_1_Consts");

class ClientMarkup {
  loginMarkup() {
    return Markup.inlineKeyboard([[{ text: constants.loginText, callback_data: "LOGIN_TO_ADMIN" }]]);
  }

  policyActionMarkup() {
    return Markup.inlineKeyboard([
      [{ text: constants.policy.accept, callback_data: "ACCEPT_POLICY" }],
      [{ text: constants.policy.reject, callback_data: "REJECT_POLICY" }],
    ]);
  }

  policyRejectMarkup() {
    return Markup.inlineKeyboard([{ text: constants.policy.accept, callback_data: "ACCEPT_POLICY" }]);
  }

  requestMobileMarkup() {
    return Markup.keyboard([[{ text: constants.mobileAttempt, request_contact: true }]])
      .oneTime()
      .resize();
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

  orderActionsMarkup() {
    return Markup.inlineKeyboard([
      [
        {
          callback_data: "accept_order",
          text: constants.orders.acceptance,
        },
        {
          callback_data: "reject_order",
          text: constants.orders.ignorance,
        },
      ],
    ]);
  }

  messageActionMarkup() {
    return Markup.keyboard([[constants.accounting.cancel]])
      .oneTime()
      .resize();
  }
}

module.exports = ClientMarkup;
