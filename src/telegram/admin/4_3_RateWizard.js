const { Scenes } = require("telegraf");
const { rateService } = require("../../services");

const menus = require("./2_3_Menus");
const constants = require("./2_1_Consts");
const utils = require("../extra/utils");

const rateWizard = () =>
  new Scenes.WizardScene(
    "rate-wizard",
    (ctx) => {
      ctx.reply(constants.rate.intro, menus.cancelMenu());
      return ctx.wizard.next();
    },
    async (ctx) => {
      try {
        const rate = utils.convertToEn(ctx.message.text);
        if (ctx.message.text === constants.cancelGlobal) {
          ctx.reply(constants.select, menus.mainMenu());
          return ctx.scene.leave();
        } else if (!isNaN(rate)) {
          await rateService.createRate({ rate: Number(rate) });
          ctx.reply(constants.rate.success, menus.mainMenu());
          return ctx.scene.leave();
        } else {
          ctx.reply(constants.errorNumber, menus.cancelMenu());
          return;
        }
      } catch (err) {
        ctx.reply(utils.showError(err), menus.mainMenu());
        return ctx.scene.leave();
      }
    }
  );

module.exports = rateWizard;
