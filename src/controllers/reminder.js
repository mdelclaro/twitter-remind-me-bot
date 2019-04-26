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
    const tweetText = tweet.text.split(`${username} set`)[1].trim();
    const number = tweetText.split(" ")[0];
    const greatness = tweetText.split(" ")[1];

    const index = Math.floor(Math.random() * 4);
    reply(user, tweetId, reply_text[index]);

    console.log("Reminder interval: " + number + greatness);

    agenda.schedule(`in ${number + greatness}`, "tweet-reminder", {
      user,
      tweetId,
      reminder_text: reminder_text[index]
    });
    console.log("Job scheduled!");
  } catch (err) {
    console.log("Error reminder schedule: " + err);
  }
};
