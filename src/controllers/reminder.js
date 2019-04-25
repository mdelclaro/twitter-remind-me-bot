const {
  username,
  help_text,
  reply_text,
  reminder_text
} = require("../../config");
const { reply } = require("../utils/twitter");
const agenda = require("../lib/agenda");

module.exports = tweet => {
  try {
    const user = tweet.user.screen_name;
    const tweetId = tweet.id_str;
    const tweetText = tweet.text.split(`${username} `)[1];

    if (tweetText === "help") {
      reply(user, tweetId, help_text);
    } else {
      const index = Math.floor(Math.random() * 4);
      reply(user, tweetId, reply_text[index]);

      console.log("Reminder interval: " + tweetText);

      agenda.schedule(`in ${tweetText}`, "tweet-reminder", {
        user,
        tweetId,
        reminder_text: reminder_text[index]
      });
      console.log("Job scheduled!");
    }
  } catch (err) {
    console.log("Error reminder schedule: " + err);
  }
};
