const numeral = require("numeral");
const moment = require("moment-jalaali");

const constants = require("./consts");
const { getProperty } = require("../extra/utils");

moment.loadPersian({ usePersianDigits: true, dialect: "persian-modern" });

class Order {
  constructor() {
    this.getOrderStr = this.getOrderStr.bind(this);
    this.getOrdersList = this.getOrdersList.bind(this);
    this.getActivationInfo = this.getActivationInfo.bind(this);
  }

  getIndex(index) {
    return getProperty(null, `◀️ سفارش شماره ${index}`);
  }

  getTrIndex(index) {
    return getProperty(null, `◀️ تراکنش شماره ${index}`);
  }

  getTrStatus(type, success) {
    const typeText = type === "buy" ? "خرید" : "فروش";

    const failedStr = (tp) => `❌ سفارش ${tp}  شما تایید نشد`;
    const successStr = (tp) => `✅ تراکنش ${tp} با موفقیت ثبت شد`;

    return getProperty(null, success ? successStr(typeText) : failedStr(typeText));
  }

  getType(type) {
    const buyStr = `🔵 خرید آبشده نقدی`;
    const sellStr = `🔴 فروش آبشده نقدی`;

    return getProperty(null, type === "buy" ? buyStr : sellStr);
  }

  getDealingAmount(type) {
    return getProperty(null, type === "buy" ? constants.buyAmountText : constants.sellAmountText);
  }

  getUserName(name) {
    return getProperty("👤 نام کاربر", name);
  }

  getUserMobile(mobileNumber) {
    return getProperty("📱 شماره موبایل", mobileNumber.replace("+", ""));
  }

  getDate(createdAt) {
    return getProperty(null, `📅 ${moment(createdAt).format("jDD jMMMM jYYYY 🕐 HH:mm")}`);
  }

  getRate(price, type) {
    const buyFormat = numeral(price.buyFromUs).format("0,0");
    const sellFormat = numeral(price.sellToUs).format("0,0");

    return getProperty(`💰 مظنه`, type === "buy" ? `${buyFormat} تومان` : `${sellFormat} تومان`);
  }

  getTotalPrice(price, amount, type) {
    const trPrice = type === "buy" ? price.buyFromUs : price.sellToUs;
    const totalPrice = (trPrice / 4.3318) * amount;

    return getProperty("💶 مبلغ کل", `${numeral(totalPrice).format("0,0")} تومان`);
  }

  getAmount(amount) {
    return getProperty("⚖️ واحد درخواستی", `${amount} گرم`);
  }

  getOrderLink(link) {
    return getProperty("🔍 اطلاعات سفارش", `/order_${link}`);
  }

  getOrderStr(order, index = 0, isSingle = true, isVerified = false) {
    var that = this;
    try {
      let textStr = "";
      const orderStr = {
        index: that.getIndex(index),
        type: that.getType(order.type),
        username: that.getUserName(order.user.name),
        userMobile: that.getUserMobile(order.user.mobileNumber),
        date: that.getDate(order.createdAt),
        amount: that.getAmount(order.amount),
        rate: that.getRate(order.price, order.type),
        totalPrice: that.getTotalPrice(order.price, order.amount, order.type),
        link: that.getOrderLink(order._id),
      };

      for (const item in orderStr) {
        if ((isSingle || isVerified) && item === "link") {
          continue;
        } else if (isSingle && item === "index") {
          continue;
        } else {
          textStr += orderStr[item];
        }
      }

      return textStr;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getActivationInfo(order, user) {
    const header = user === "client" ? constants.singleAdminRequestHeader : constants.singleHeader;
    const orderStr = await this.getOrderStr(order);
    return header + orderStr + constants.singleHelp;
  }

  getOrdersList(orders, verified) {
    var that = this;
    return new Promise(function (resolve, reject) {
      try {
        let wholeOrders = "";

        orders.forEach((order, index) => {
          wholeOrders += `${that.getOrderStr(order, index + 1, false, verified)}\n\n`;
        });

        const headerText = verified ? constants.verifiedListHeader : constants.unverifiedListHeader;

        resolve(headerText + wholeOrders + constants.listHelp);
      } catch (err) {
        reject(err);
      }
    });
  }

  getTransactionOrder(order) {
    var that = this;
    try {
      let textStr = "";
      const orderStr = {
        type: that.getType(order.type),
        date: that.getDate(order.createdAt),
        amount: that.getAmount(order.amount),
        rate: that.getRate(order.price, order.type),
        totalPrice: that.getTotalPrice(order.price, order.amount, order.type),
      };

      for (const item in orderStr) {
        textStr += orderStr[item];
      }

      return textStr;
    } catch (err) {
      throw new Error(err);
    }
  }

  getTransactionsStr(trData, index = 0, isSingle = true) {
    var that = this;
    try {
      let textStr = "";
      const orderStr = {
        index: that.getTrIndex(index),
        type: that.getType(trData.order.type),
        date: that.getDate(trData.createdAt),
        amount: that.getAmount(trData.order.amount),
        rate: that.getRate(trData.price, trData.type),
        totalPrice: that.getTotalPrice(trData.price, trData.order.amount, trData.order.type),
      };

      for (const item in orderStr) {
        if (isSingle && item === "index") {
          continue;
        } else {
          textStr += orderStr[item];
        }
      }

      return textStr;
    } catch (err) {
      throw new Error(err);
    }
  }

  getTransactionsList(transactions) {
    var that = this;
    return new Promise(function (resolve, reject) {
      try {
        let wholeTrs = "";

        transactions.forEach((order, index) => {
          wholeTrs += `${that.getTransactionsStr(order, index + 1, false)}\n\n`;
        });

        resolve(constants.transactionListHeader + wholeTrs);
      } catch (err) {
        reject(err);
      }
    });
  }

  getOrderDealingText(type, price) {
    var that = this;
    try {
      let textStr = "";
      const orderStr = {
        type: that.getType(type),
        rate: that.getRate(price, type),
        amount: that.getDealingAmount(type),
      };

      for (const item in orderStr) {
        textStr += orderStr[item];
      }

      return textStr;
    } catch (err) {
      throw new Error(err);
    }
  }

  getOrderRequestText(type, price, amount) {
    var that = this;
    try {
      let textStr = "";
      const orderStr = {
        type: that.getType(type),
        rate: that.getRate(price, type),
        amount: that.getAmount(amount),
        totalPice: that.getTotalPrice(price, amount, type),
      };

      for (const item in orderStr) {
        textStr += orderStr[item];
      }

      return constants.singleRequestHeader + textStr + constants.singleRequestNotice;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = Order;
