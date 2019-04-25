const { username } = require("./config");
const reminder = require("./src/controllers/reminder");

const twitter = require("./src/lib/twitter");

try {
  const stream = twitter.stream("statuses/filter", { track: [username] });

  console.log("Listening to tweets...");

  stream.on("tweet", async tweet => {
    console.log("Tweet received!");

    reminder(tweet);
    // downlooad(tweet)
  });
} catch (err) {
  console.log("Error: " + err);
}
