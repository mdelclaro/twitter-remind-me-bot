const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const { reply } = require("./twitter");

module.exports = async (tweet, originalTweet) => {
  try {
    const user = originalTweet.user.screen_name;
    const tweetId = originalTweet.id_str;
    const mediaObject = tweet.extended_entities.media[0];
    let extension;
    let fileUrl;
    let client = http;

    if (mediaObject.type === "video" || mediaObject.type === "animated_gif") {
      extension = ".mp4";
      fileUrl = mediaObject.video_info.variants[0].url;
    }

    const filename = tweetId + extension;

    const file = fs.createWriteStream(
      path.join(__dirname, "../..", "downloads", filename)
    );

    if (fileUrl.toString().indexOf("https") === 0) {
      client = https;
    }

    await client.get(fileUrl, response => {
      response.pipe(file);
    });

    const url = process.env.NODE_ENV
      ? process.env.PRODUCTION
      : process.env.DEVELOPMENT;

    const replyText =
      "Here's the link for your download: " + url + "v1/download/" + filename;
    console.log(replyText);
    reply(user, tweetId, replyText);
  } catch (err) {
    console.log("Error download: " + err);
  }
};
