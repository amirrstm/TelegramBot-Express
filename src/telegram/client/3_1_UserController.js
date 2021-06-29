const { Telegraf } = require("telegraf");

const menus = require("./2_3_Menus");
const constants = require("./2_1_Consts");
const MarkupsModel = require("./2_2_Markups");

const utils = require("../extra/utils");
const UserModel = require("../users/Users");
const config = require("../../config/config");
const { userService, adminService } = require("../../services");

const userModel = new UserModel();
const markups = new MarkupsModel();
const adminBot = new Telegraf(config.admin_token);

const getUser = async (ctx) => {
  try {
    const fromId = ctx.update.message.from.id;
    const foundUser = await userService.getUserByTelegramId(fromId);

    if (foundUser) {
      ctx.reply(`🌸 ${foundUser.name} عزیز، خوش آمدید.`);
      ctx.reply(constants.select, menus.mainMenu());
    } else {
      ctx.reply(constants.greeting).then(() => {
        ctx.reply(constants.policy.text + constants.thanksGiving, markups.policyActionMarkup());
      });
    }
  } catch (err) {
    return ctx.reply(utils.showError(err));
  }
};

const createUser = async (ctx, userData) => {
  try {
    const admins = await adminService.getAllAdmins();
    const user = await userService.createUser(userData);

    if (user) {
      ctx.reply(`${user.name} عزیز \n ${constants.pendingActive}`, menus.mainMenu());

      const adminText = `کاربر با نام ${user.name} درخواست ثبت نام ارسال کرد.`;
      admins.forEach((admin) => {
        adminBot.telegram.sendMessage(admin.userId, adminText, markups.userActionsMarkup(user.userId));
      });
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

const getAllUsersList = async (ctx) => {
  try {
    const users = await userService.getAllUsers();

    if (users.length === 0) {
      ctx.reply(constants.users.emptyList);
    } else {
      userModel
        .getUsersList(users)
        .then((usersData) => ctx.reply(usersData))
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
    await userController.getSingleUser(data.userId, ctx);
    return user;
  } catch (err) {
    return ctx.reply(utils.showError(err));
  }
};

module.exports = { createUser, getSingleUser, getAllUsersList, getUser, updateUserActivity };
