const constants = require("./consts");
const moment = require("moment-jalaali");
const { getProperty } = require("../extra/utils");

moment.loadPersian({ usePersianDigits: true, dialect: "persian-modern" });

class User {
  constructor() {
    this.getUserStr = this.getUserStr.bind(this);
    this.getActivationInfo = this.getActivationInfo.bind(this);
    this.getUsersList = this.getUsersList.bind(this);
  }

  getIndex(index) {
    return getProperty(null, `◀️ کاربر شماره ${index}`);
  }

  getName(name) {
    return getProperty("👤 نام کاربر", name);
  }

  getMobile(mobileNumber) {
    return getProperty("📱 شماره موبایل", mobileNumber.replace("+", ""));
  }

  getNationalCode(nationalCode) {
    return getProperty("🏳️ کد ملی", nationalCode);
  }

  getRegisterDate(createdAt) {
    return getProperty("📅 تاریخ ثبت نام", moment(createdAt).format("jDD jMMMM jYYYY ساعت HH:mm"));
  }

  getActivity(isVerified) {
    const activeUser = `✅ کاربر تایید شده است`;
    const deactiveUser = `❌ کاربر تایید نشده است`;

    return getProperty(null, isVerified ? activeUser : deactiveUser);
  }

  getUserLink(link) {
    return getProperty("🔍 اطلاعات کاربر", `/user_${link}`);
  }

  getUserStr(user, index = 0, isSingle = true) {
    var that = this;
    try {
      let textStr = "";
      const userStr = {
        index: that.getIndex(index),
        name: that.getName(user.name),
        mobileNumber: that.getMobile(user.mobileNumber),
        nationalCode: that.getNationalCode(user.nationalCode),
        registerDate: that.getRegisterDate(user.createdAt),
        link: that.getUserLink(user.userId),
        activity: that.getActivity(user.isVerified),
      };

      for (const item in userStr) {
        if (isSingle && item === "link") {
          continue;
        } else if (isSingle && item === "index") {
          continue;
        } else {
          textStr += userStr[item];
        }
      }

      return textStr;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getActivationInfo(user) {
    const userStr = await this.getUserStr(user);
    return constants.singleHeader + userStr + constants.singleHelp;
  }

  getUsersList(users) {
    var that = this;
    return new Promise(function (resolve, reject) {
      try {
        let wholeUsers = ``;

        users.forEach((user, index) => {
          wholeUsers += `${that.getUserStr(user, index + 1, false)}\n\n`;
        });

        resolve(constants.listHeader + wholeUsers + constants.listHelp);
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = User;
