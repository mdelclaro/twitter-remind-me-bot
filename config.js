require("dotenv-safe").config();

module.exports = {
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET_KEY,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  mongo_url: process.env.MONGO_URL,
  help_text:
    "hello! I support the following time units: " +
    "seconds, minutes, hours, days, weeks and months." +
    "\n\nExamples: 30 minutes, 1 hour, 1 day.\n\n" +
    "In case you insert an invalid time interval, " +
    "the reminder will get sent back to you right away =)",
  reply_text: [
    "got it! I will remind you :-)",
    "ok! I will remind you :-)",
    "sure! I will remind you :-)",
    "roger that! I will remind you :-)"
  ],
  reminder_text: [
    "here's your reminder! :D",
    "you've asked me to remind you of this :-)",
    "hey, just reminding you :-)",
    "here, to remind you :D"
  ],
  username: "@remind_me_in_"
};
