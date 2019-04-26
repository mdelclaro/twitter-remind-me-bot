const { intervals, reply_text, reminder_text } = require("../../config");
const { reply } = require("../utils/twitter");
const agenda = require("../lib/agenda");

module.exports = (tweet, text) => {
  try {
    const user = tweet.user.screen_name;
    const tweetId = tweet.id_str;
    const tweetText = text.split("set ")[1].trim();
    const number = tweetText.split(" ")[0];
    const interval = tweetText.split(" ")[1];

    // check if interval is valid
    if (
      !Number.isInteger(parseInt(number)) ||
      !intervals.includes(interval.toLowerCase())
    ) {
      reply(user, tweetId, "Sorry, that's an invalid interval =(");
      return;
    }

    const index = Math.floor(Math.random() * 4);
    reply(user, tweetId, reply_text[index]);

    console.log(`Reminder interval: ${number} ${interval}`);

    agenda.schedule(`in ${number} ${interval}`, "tweet-reminder", {
      user,
      tweetId,
      reminder_text: reminder_text[index]
    });
    console.log("Job scheduled!");
  } catch (err) {
    console.log("Error reminder schedule: " + err);
  }
};
