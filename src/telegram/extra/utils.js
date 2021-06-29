const logger = require("../../config/logger");

const getProperty = (property, value, escape = 2) => {
  if (property) {
    return `${property} : ${value} ${Array.from(new Array(escape))
      .map(() => `\n`)
      .join()
      .replace(",", "")}`;
  } else {
    return `${value} ${Array.from(new Array(escape))
      .map(() => `\n`)
      .join()
      .replace(",", "")}`;
  }
};

const showError = (err) => {
  logger.error(err.message);
  return `مشکلی پیش آمده است\n\n برای بررسی مشکل با اپراتور تماس بگیرید.`;
};

const convertToEn = (str) => {
  return typeof str !== "string"
    ? str
    : String(
        str
          .replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d) => d.charCodeAt(0) - 1632)
          .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, (d) => d.charCodeAt(0) - 1776)
      );
};

module.exports = { getProperty, showError, convertToEn };
