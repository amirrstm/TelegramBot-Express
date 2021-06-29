const app = require("./app");
const mongoose = require("mongoose");
const config = require("./config/config");
const logger = require("./config/logger");

const { adminBot } = require("./telegram/admin");
const { clientBot } = require("./telegram/client");

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info("Connected to MongoDB");
  server = app.listen(config.port, () => {
    clientBot.launch().then(() => {
      adminBot.launch().then(() => {
        logger.info(`Listening to port ${config.port}`);
      });
    });
  });
});

const unexpectedErrorHandler = (error) => {
  logger.error(error);
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
