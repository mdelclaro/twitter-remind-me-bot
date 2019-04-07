const Twitter = require("twit");
const Agenda = require("agenda");
const { MongoClient } = require("mongodb");

const config = require("../config");
const { mongo_url } = require("../config");

const twitter = new Twitter(config);
let agenda;

module.exports.run = async () => {
  try {
    const db = await MongoClient.connect(mongo_url, { useNewUrlParser: true });
    agenda = new Agenda().mongo(db.db(), "tweets");

    //wait for agenda to connect to mongodb
    await new Promise(resolve => agenda.once("ready", resolve));
    listenToTweets();
  } catch (err) {
    console.log(err);
  }
};

function listenToTweets() {
  const stream = twitter.stream("statuses/filter", { track: ["@mdelclaro"] });
  console.log("ouvindo tweets...");
  stream.on("tweet", async tweet => {
    console.log("recebeu tweet");
    const user = tweet.user.screen_name;
    const tweetId = tweet.id_str;
    const replyText = "ok";
    const reminderText = "test";

    try {
      await reply(user, tweetId, replyText);
      await schedule(user, tweetId, reminderText);
      stream.stop();
      console.log("parou");
      // process.exit();
    } catch (err) {
      console.log("error: " + err);
    }
  });
}

function reply(user, tweetId, text) {
  const status = `@${user} ${text}`;
  const in_reply_to_status_id = tweetId;

  return new Promise((resolve, reject) => {
    twitter
      .post("statuses/update", {
        status,
        in_reply_to_status_id,
        auto_populate_reply_metadata: true
      })
      .then(response => {
        console.log("reply");
        resolve(response);
      })
      .catch(err => reject(err));
  });
}

function schedule(user, tweetId, text) {
  return new Promise(async (resolve, reject) => {
    try {
      await agenda.define("reminder", () => {
        reply(user, tweetId, text);
      });

      await agenda.start();
      await agenda.schedule("in 20 seconds", "reminder");
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
