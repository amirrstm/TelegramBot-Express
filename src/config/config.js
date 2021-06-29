const Joi = require("joi");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().default(3000),
    BOT_TOKEN: Joi.string().default(""),
    ADMIN_TOKEN: Joi.string().default(""),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  console.log(error);
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  port: envVars.PORT,
  env: envVars.NODE_ENV,
  bot_token: envVars.BOT_TOKEN,
  admin_token: envVars.ADMIN_TOKEN,
  admin_user: envVars.ADMIN_USER,
  admin_password: envVars.ADMIN_PASSWORD,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};
