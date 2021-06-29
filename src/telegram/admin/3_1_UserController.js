const menus = require("./2_3_Menus");
const constants = require("./2_1_Consts");
const MarkupsModel = require("./2_2_Markups");

const utils = require("../extra/utils");
const UserModel = require("../users/Users");
const { userService, adminService, botInfoService, rateService } = require("../../services");

const userModel = new UserModel();
const markups = new MarkupsModel();

const getAdmin = async (ctx) => {
  try {
    const fromId = ctx.update.message.from.id;
    const priceRate = await rateService.getLastRate();
    const foundUser = await adminService.getAdminByTelegramId(fromId);

    if (foundUser) {
      return ctx.reply(constants.greetingAgain, priceRate ? menus.mainMenu() : menus.noPriceMenu());
    } else {
      return ctx.reply(constants.greeting, markups.loginMarkup());
    }
  } catch (err) {
    return ctx.reply(utils.showError(err));
  }
};

const getSingleUser = async (userId, ctx) => {
  try {
    const foundUser = await userService.getUserByTelegramId(userId);
    if (foundUser) {
      userModel
        .getActivationInfo(foundUser)
        .then((userData) => ctx.reply(userData, markups.userActionsMarkup(foundUser.userId)))
        .catch((err) => ctx.reply(utils.showError(err)));
    } else {
      return ctx.reply(utils.showError({ message: "User Not Found!" }));
    }
  } catch (err) {
    return ctx.reply(utils.showError(err));
  }
};

const getAllVerifiedUsersList = async (ctx) => {
  try {
    const users = await userService.getAllVerifiedUsers();

    if (users.length === 0) {
      ctx.reply(constants.users.emptyList);
    } else {
      userModel
        .getUsersList(users)
        .then((usersData) => {
          ctx.reply(usersData);
          ctx.telegram.sendMessage("@khosroshahi_users", usersData);
        })
        .catch((err) => ctx.reply(utils.showError(err)));
    }
  } catch (err) {
    return ctx.reply(utils.showError(err));
  }
};

const getAllUnverifiedUsersList = async (ctx) => {
  try {
    const users = await userService.getAllUnverifiedUsers();

    if (users.length === 0) {
      ctx.reply(constants.users.emptyList);
    } else {
      userModel
        .getUsersList(users)
        .then((usersData) => {
          ctx.reply(usersData);
          ctx.telegram.sendMessage("@khosroshahi_users", usersData);
        })
        .catch((err) => ctx.reply(utils.showError(err)));
    }
  } catch (err) {
    return ctx.reply(utils.showError(err));
  }
};

const updateUserActivity = async (data, ctx) => {
  try {
    const user = await userService.updateUser({ isVerified: data.active }, data.userId);
    ctx.deleteMessage();
    await getSingleUser(data.userId, ctx);
    return user;
  } catch (err) {
    return ctx.reply(utils.showError(err));
  }
};

const handleBotDisable = async (ctx) => {
  try {
    const info = await botInfoService.getLastInfo();

    if (info) {
      const newInfo = await botInfoService.createInfo({ isActive: !info.isActive });
      ctx.reply(newInfo.isActive ? constants.disable.active : constants.disable.deactive);
      return newInfo;
    } else {
      const newInfo = await botInfoService.createInfo({ isActive: true });
      ctx.reply(constants.disable.active);
      return newInfo;
    }
  } catch (err) {
    return ctx.reply(utils.showError(err));
  }
};

module.exports = {
  getAdmin,
  getSingleUser,
  getAllVerifiedUsersList,
  getAllUnverifiedUsersList,
  handleBotDisable,
  updateUserActivity,
};
