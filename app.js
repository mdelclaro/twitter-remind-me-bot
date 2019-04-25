// const { username } = require("./config");
// const reminder = require("./src/controllers/reminder");

// const twitter = require("./src/lib/twitter");

// try {
//   const stream = twitter.stream("statuses/filter", { track: [username] });

//   console.log("Listening to tweets...");

//   stream.on("tweet", async tweet => {
//     console.log("Tweet received!");

//     console.log(tweet.entities.media.media_url);
//     // reminder(tweet);
//     // downlooad(tweet)
//   });
// } catch (err) {
//   console.log("Error: " + err);
// }

// const download = require("./src/controllers/download");

// download("");
