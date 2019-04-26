require("dotenv-safe").config();

module.exports = {
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET_KEY,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  mongo_url: process.env.MONGO_URL,
  aws_acces_key_id: process.env.AWS_ACCESS_KEY_ID,
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
  aws_default_region: process.env.AWS_DEFAULT_REGION,
  aws_bucket: process.env.AWS_BUCKET,
  aws_acl: process.env.AWS_ACL,
  help_text:
    "hello! To download a file type 'download'. " +
    "To set a reminder type 'set' and the time interval." +
    "\n\nTime interval examples: 30 minutes, 1 hour, 1 day.\n\n" +
    "In case of an invalid time interval, " +
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
  username: "@_tools_bot",
  intervals: ["seconds", "minutes", "hours", "days", "weeks", "months", "years"]
};
