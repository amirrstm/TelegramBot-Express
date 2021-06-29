const { Scenes } = require("telegraf");
const { adminService } = require("../../services");

const menus = require("./2_3_Menus");
const constants = require("./2_1_Consts");
const utils = require("../extra/utils");
const config = require("../../config/config");

const loginWizard = () =>
  new Scenes.WizardScene(
    "login-wizard",
    (ctx) => {
      ctx.reply(constants.getUsername);
      return ctx.wizard.next();
    },
    (ctx) => {
      try {
        if (ctx.update.message.text && ctx.update.message.text === config.admin_user) {
          ctx.reply(constants.getPassword);
          return ctx.wizard.next();
        } else {
          ctx.reply(constants.wrongUser);
          return;
        }
      } catch (err) {
        utils.showError(err);
        return ctx.scene.leave();
      }
    },
    async (ctx) => {
      if (ctx.update.message.text && ctx.update.message.text === config.admin_password) {
        try {
          await adminService.createAdmin({ userId: ctx.message.from.id });
          ctx.reply(constants.successLogin, menus.mainMenu());
          return ctx.scene.leave();
        } catch (err) {
          return ctx.reply(utils.showError(err));
        }
      } else {
        ctx.reply(constants.wrongPassword);
        return;
      }
    }
  );

module.exports = loginWizard;
