const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET_KEY,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  mongo_url: process.env.MONGO_URL
};
