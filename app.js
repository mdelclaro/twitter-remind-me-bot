const { username } = require("./config");
const reminder = require("./src/controllers/reminder");
const saveFile = require("./src/utils/save-to-file");
const { reply } = require("./src/utils/twitter");
const { help_text } = require("./config");

const twitter = require("./src/lib/twitter");

try {
  const stream = twitter.stream("statuses/filter", { track: username });

  console.log("Listening to tweets...");

  stream.on("tweet", async tweet => {
    console.log("Tweet received!");

    const user = tweet.user.screen_name;
    const tweetId = tweet.id_str;
    const tweetText = tweet.text.split(`${username} `)[1].trim();

    const command = tweetText.split(" ")[0];

    switch (command) {
      case "help": // help command
        reply(user, tweetId, help_text);
        break;
      case "download": // command for download file
        const tweetMediaId = tweet.in_reply_to_status_id_str;
        const originalTweet = tweet;
        twitter.get("statuses/show/:id", { id: tweetMediaId }, (err, tweet) => {
          if (err) {
            console.log("Error on getting the tweet: " + err);
          } else {
            saveFile(tweet, originalTweet);
          }
        });
        break;
      case "set": // command for reminder
        reminder(tweet, tweetText);
        break;
      case "thanks":
        reply(user, tweetId, ":D");
        break;
      case "thank":
        reply(user, tweetId, ":D");
        break;
      default:
        // invalid command
        reply(
          user,
          tweetId,
          "Sorry, I didn't understand you =(\n\nTry using the help command!"
        );
        break;
    }
  });
} catch (err) {
  console.log("Error: " + err);
}
