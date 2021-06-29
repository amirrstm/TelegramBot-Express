const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const express = require("express");
const httpStatus = require("http-status");
const mongoSanitize = require("express-mongo-sanitize");

const config = require("./config/config");
const ApiError = require("./utils/ApiError");

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// enable cors
app.use(cors());
app.options("*", cors());

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

module.exports = app;
