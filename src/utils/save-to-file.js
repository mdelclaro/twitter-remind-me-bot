const http = require("http");
const fs = require("fs");
const path = require("path");

const { reply } = require("./twitter");

module.exports = async tweet => {
  try {
    const user = tweet.user.screen_name;
    const tweetId = tweet.id_str;
    const tweetMediaId = tweet.in_reply_to_status_id_str;
    console.log(tweet.extended_entities[0].media);
    let extension;
    if (tweet.extended_entities[0].media.type === "photo") extension = ".jpg";
    else if (tweet.extended_entities[0].media.type === "video")
      extension = ".mp4";
    else if (tweet.extended_entities[0].media.type === "animated_gif")
      extension = ".gif";
    console.log(extension);
    const filename = tweet.id_str + extension;

    const file = fs.createWriteStream(
      path.join(__dirname, "../..", "downloads", filename)
    );
    await http.get(tweet.extended_entities.media.media_url, response => {
      response.pipe(file);
    });

    // const url = process.env.NODE_ENV
    //   ? process.env.PRODUCTION
    //   : process.env.DEVELOPMENT;

    const replyText =
      "Here's the link for your download: " + "localhost:8080/" + filename;
    console.log(replyText);
    // reply(user, tweetId, replyText);
  } catch (err) {
    console.log("Error download: " + err);
  }
};
