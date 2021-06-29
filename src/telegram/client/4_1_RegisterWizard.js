const { Scenes } = require("telegraf");

const MarkupsModel = require("./2_2_Markups");
const { userService } = require("../../services");
const userController = require("./3_1_UserController");

const constants = require("./2_1_Consts");
const utils = require("../extra/utils");
const { isValidNationalCode } = require("../../models/plugins");

const markups = new MarkupsModel();

const registerWizard = () =>
  new Scenes.WizardScene(
    "register-wizard",
    (ctx) => {
      try {
        if (ctx.update.callback_query && ctx.update.callback_query.data) {
          ctx.deleteMessage().then(() => {
            ctx.reply(constants.policy.text + constants.policy.acceptText).then(() => ctx.reply(constants.getName));
          });

          ctx.wizard.state.userData = {};
          return ctx.wizard.next();
        } else {
          return ctx.scene.leave();
        }
      } catch (err) {
        utils.showError(err);
        return ctx.scene.leave();
      }
    },

    (ctx) => {
      if (ctx.message) {
        ctx.wizard.state.userData.name = ctx.message.text;
        ctx.wizard.state.userData.userId = ctx.message.from.id;
        ctx.reply(constants.getNationalCode);
        return ctx.wizard.next();
      } else {
        return ctx.scene.leave();
      }
    },
    async (ctx) => {
      if (ctx.message && ctx.message.text) {
        const nationalCode = utils.convertToEn(ctx.message.text);

        // If Is Not Number
        if (isNaN(nationalCode)) {
          ctx.reply(constants.getNationalNumberError);
          return;
        }

        try {
          if (isValidNationalCode(nationalCode)) {
            const user = await userService.findUserByNationalCode(ctx.message.text);

            if (user) {
              ctx.reply(constants.getNationalNumberDuplicate);
              return;
            } else {
              ctx.wizard.state.userData.nationalCode = nationalCode;

              ctx.reply(constants.getMobile, markups.requestMobileMarkup());
              return ctx.wizard.next();
            }
          } else {
            ctx.reply(constants.getNationalNumberError);
            return;
          }
        } catch (err) {
          utils.showError(err);
          return ctx.scene.leave();
        }
      }
    },
    async (ctx) => {
      try {
        if (ctx.update.message.contact) {
          const mobile = ctx.update.message.contact.phone_number;
          ctx.wizard.state.userData.mobileNumber = mobile;

          await userController.createUser(ctx, {
            ...ctx.wizard.state.userData,
            mobile: ctx.update.message.contact.phone_number,
          });

          return ctx.scene.leave();
        } else {
          ctx.reply(constants.mobileTextError);
          return;
        }
      } catch (err) {
        utils.showError(err);
        return ctx.scene.leave();
      }
    }
  );

module.exports = registerWizard;
