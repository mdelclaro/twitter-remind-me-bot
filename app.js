const { username } = require("./config");
const reminder = require("./src/controllers/reminder");
const saveFile = require("./src/utils/save-to-file");

const twitter = require("./src/lib/twitter");

try {
  const stream = twitter.stream("statuses/filter", { track: [username] });

  console.log("Listening to tweets...");

  stream.on("tweet", async tweet => {
    console.log("Tweet received!");

    // reminder(tweet);
    const tweetMediaId = tweet.in_reply_to_status_id_str;
    twitter.get("statuses/show/:id", { id: tweetMediaId }, (err, tweet) => {
      if (err) {
        console.log("Error on getting the tweet: " + err);
      } else {
        saveFile(tweet);
      }
    });
  });
} catch (err) {
  console.log("Error: " + err);
}
