const numeral = require("numeral");
const { Scenes } = require("telegraf");
const { priceService, rateService } = require("../../services");

const menus = require("./2_3_Menus");
const constants = require("./2_1_Consts");
const utils = require("../extra/utils");
const MarkupsModel = require("./2_2_Markups");

const markupModel = new MarkupsModel();

const priceShowText = (price) => {
  const successText = `قیمت جدید با موفقیت افزوده شد: \n\n`;
  const buyFormat = numeral(price.buyFromUs).format("0,0");
  const sellFormat = numeral(price.sellToUs).format("0,0");

  const buyText = utils.getProperty("🔵 نرخ خرید از ما", `${buyFormat} تومان`);
  const sellText = utils.getProperty("🔴 نرخ فروش به ما", `${sellFormat} تومان`);

  return successText + buyText + sellText;
};

const priceForChannel = (price) => {
  const buyFormat = numeral(price.buyFromUs).format("0,0");
  const sellFormat = numeral(price.sellToUs).format("0,0");

  const buyText = utils.getProperty("🔵 نرخ خرید از ما", `${buyFormat} تومان`);
  const sellText = utils.getProperty("🔴 نرخ فروش به ما", `${sellFormat} تومان`);

  return  buyText + sellText;
};

const lastPriceText = (amount, newAmount = null) => {
  const amountFormat = numeral(amount).format("0,0");
  const newAmountFormat = newAmount ? numeral(newAmount).format("0,0") : null;

  const buyStr = utils.getProperty("🔵 نرخ خرید قبلی", `${amountFormat} تومان`);
  const newBuyStr = utils.getProperty("🔵 نرخ جدید خرید", `${newAmountFormat} تومان`);

  const finalText = newAmount ? buyStr + newBuyStr : buyStr;

  return finalText + constants.price.changeInfo;
};

const priceWizard = () =>
  new Scenes.WizardScene(
    "price-wizard",
    async (ctx) => {
      try {
        const priceRate = await rateService.getLastRate();

        if (priceRate) {
          const lastPrice = await priceService.getLastPrice();
          ctx.wizard.state.priceData = { rate: priceRate.rate };

          if (!lastPrice) {
            ctx.reply(constants.price.intro, menus.cancelMenu());
            return ctx.wizard.next();
          } else {
            ctx.wizard.state.newPriceData = { rate: priceRate.rate, lastPrice: lastPrice.buyFromUs };
            ctx.reply(lastPriceText(lastPrice.buyFromUs), markupModel.priceActionsMarkup(1000));

            return ctx.wizard.next();
          }
        } else {
          ctx.reply(constants.price.rateMiss, menus.mainMenu());
          return ctx.scene.leave();
        }
      } catch (err) {
        ctx.reply(utils.showError(err), menus.mainMenu());
      }
    },
    async (ctx) => {
      if (ctx.callbackQuery) {
        try {
          const priceData = ctx.wizard.state.newPriceData;
          const str = ctx.callbackQuery.data;

          if (str === "raise_price") {
            const newPrice = priceData.lastPrice + 1000;

            ctx.deleteMessage();
            ctx.reply(lastPriceText(priceData.lastPrice, newPrice), markupModel.priceActionsMarkup(1000));

            ctx.wizard.state.newPriceData["lastPrice"] = newPrice;
            return;
          } else if (str === "decrease_price") {
            const newPrice = priceData.lastPrice - 1000;

            ctx.deleteMessage();
            ctx.reply(lastPriceText(priceData.lastPrice, newPrice), markupModel.priceActionsMarkup(1000));

            ctx.wizard.state.newPriceData["lastPrice"] = newPrice;
            return;
          } else if (str === "set_amount") {
            const priceData = ctx.wizard.state.newPriceData;

            const buyFromUs = priceData.lastPrice;
            const rate = priceData.rate;
            const sellToUs = buyFromUs - rate;

            const newPrice = await priceService.createPrice({ buyFromUs, sellToUs });
            ctx.deleteMessage();
            ctx.reply(priceShowText(newPrice), menus.mainMenu());

            ctx.telegram.sendMessage("@KhosroShahi_Ahmadi", priceForChannel(newPrice));
            return ctx.scene.leave();
          } else {
            ctx.deleteMessage();
            ctx.reply(constants.select, menus.mainMenu());
            return ctx.scene.leave();
          }
        } catch (err) {
          ctx.reply(utils.showError(err), menus.mainMenu());
        }
      } else if (ctx.message.text === constants.cancelGlobal) {
        ctx.reply(constants.select, menus.mainMenu());
        return ctx.scene.leave();
      } else {
        try {
          const price = utils.convertToEn(ctx.message.text);
          if (!isNaN(price)) {
            const buyFromUs = Number(price);
            const rate = Number(ctx.wizard.state.priceData.rate);
            const sellToUs = buyFromUs - rate;

            const newPrice = await priceService.createPrice({ buyFromUs, sellToUs });
            ctx.reply(priceShowText(newPrice), menus.mainMenu());

            ctx.telegram.sendMessage("@KhosroShahi_Ahmadi", priceForChannel(newPrice));

            return ctx.scene.leave();
          } else {
            ctx.reply(constants.errorNumber, menus.cancelMenu());
            return;
          }
        } catch (err) {
          ctx.reply(utils.showError(err), menus.mainMenu());
        }
      }
    }
  );

module.exports = priceWizard;
