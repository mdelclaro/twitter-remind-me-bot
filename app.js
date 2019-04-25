const { username } = require("./config");
const reminder = require("./src/controllers/reminder");
const saveFile = require("./src/utils/save-to-file");
const { reply } = require("./src/utils/twitter");
const { help_text } = require("./config");

const twitter = require("./src/lib/twitter");

try {
  const stream = twitter.stream("statuses/filter", { track: [username] });

  console.log("Listening to tweets...");

  stream.on("tweet", async tweet => {
    console.log("Tweet received!");

    const user = tweet.user.screen_name;
    const tweetId = tweet.id_str;
    const tweetText = tweet.text.split(`${username} `)[1];

    if (tweetText === "help") {
      reply(user, tweetId, help_text);
    } else {
      const command = tweetText.split(" ")[0];

      // command for download file
      if (command === "download") {
        const tweetMediaId = tweet.in_reply_to_status_id_str;
        const originalTweet = tweet;
        twitter.get("statuses/show/:id", { id: tweetMediaId }, (err, tweet) => {
          if (err) {
            console.log("Error on getting the tweet: " + err);
          } else {
            saveFile(tweet, originalTweet);
          }
        });
        // command for reminder
      } else if (command === "set") {
        reminder(tweet);
        // invalid command
      } else {
        reply(
          user,
          tweetId,
          "Sorry, I didn't understand you =(\n\nTry using the help command!"
        );
      }
    }
  });
} catch (err) {
  console.log("Error: " + err);
}
