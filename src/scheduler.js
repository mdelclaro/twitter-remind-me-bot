const Twitter = require("twit");
const Agenda = require("agenda");
const { MongoClient } = require("mongodb");
const config = require("../config");
const { mongo_url } = require("../config");
const twitter = new Twitter(config);

module.exports.run = async () => {
  try {
    //const client = new MongoClient(mongo_url, { useNewUrlParser: true });
    const db = await MongoClient.connect(mongo_url, { useNewUrlParser: true });
    const agenda = new Agenda().mongo(db.db(), "tweets");

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
    const user = tweet.user.screen_name;
    const tweetId = tweet.id;
    const replyText = "ok";
    const reminderText = "reminder";

    try {
      reply(user, tweetId, replyText);
      schedule(user, tweetId, reminderText);
    } catch (err) {
      console.log("error: " + err);
    }
  });
}

function reply(user, tweetId, text) {
  const status = `@${user} ${text}`;
  const in_reply_to_status_id = tweetId;

  return new Promise((resolve, reject) => {
    twitter.post(
      "statuses/update",
      {
        status,
        in_reply_to_status_id,
        auto_populate_reply_metadata: true
      },
      (err, data, response) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(response);
        }
      }
    );
  });
}

function schedule(user, tweetId) {
  return new Promise(async (resolve, reject) => {
    try {
      await agenda.define("reminder", () => {
        reply(user, tweetId, "lembrete");
      });

      await agenda.start();
      await agenda.schedule("in 20 minutes", "send email report", {
        to: "admin@example.com"
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
