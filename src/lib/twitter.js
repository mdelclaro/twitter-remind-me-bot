const Twitter = require("twit");
const {
  consumer_key,
  consumer_secret,
  access_token,
  access_token_secret
} = require("../../config");

const twitter = new Twitter({
  consumer_key,
  consumer_secret,
  access_token,
  access_token_secret
});

module.exports = twitter;
