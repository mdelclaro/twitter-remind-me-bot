const Twitter = require("twit");
const Agenda = require("agenda");
const { MongoClient } = require("mongodb");

const config = require("../config");
const {
  mongo_url,
  username,
  help_text,
  reply_text,
  reminder_text
} = require("../config");

const twitter = new Twitter({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token: config.access_token,
  access_token_secret: config.access_token_secret
});
let agenda;

module.exports.run = async () => {
  try {
    const db = await MongoClient.connect(mongo_url, { useNewUrlParser: true });
    agenda = new Agenda().mongo(db.db(), "tweets");

    //wait for agenda to connect to mongodb
    await new Promise(resolve => agenda.once("ready", resolve));
    await agenda.start();
    listenToTweets();
  } catch (err) {
    console.log(err);
  }
};

function listenToTweets() {
  try {
    const stream = twitter.stream("statuses/filter", { track: [username] });
    console.log("ouvindo tweets...");
    stream.on("tweet", async tweet => {
      console.log("recebeu tweet");
      const user = tweet.user.screen_name;
      const tweetId = tweet.id_str;

      let tweetText = tweet.text.split(`${username} `)[1];
      console.log("tweet: " + tweet.text);
      if (tweetText === "help") {
        await reply(user, tweetId, help_text);
      } else {
        const index = Math.floor(Math.random() * 4);
        await reply(user, tweetId, reply_text[index]);
        await schedule(user, tweetId, tweetText);
      }
      // stream.stop();
    });
  } catch (err) {
    console.log("error: " + err);
  }
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
      .catch(err => reject(err))
      .then(response => {
        console.log("reply");
        resolve(response);
      });
  });
}

function schedule(user, tweetId, interval) {
  return new Promise(async (resolve, reject) => {
    try {
      await agenda.define("reminder", () => {
        const index = Math.floor(Math.random() * 4);
        reply(user, tweetId, reminder_text[index]);
      });

      console.log("interval: " + interval);
     // await agenda.start();
      await agenda.schedule(`in ${interval}`, "reminder");
      console.log("fez schedule");
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
