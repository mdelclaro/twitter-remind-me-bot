const request = require("request");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

const { reply } = require("./twitter");

const s3 = new AWS.S3();

module.exports = async (tweet, originalTweet) => {
  try {
    const user = originalTweet.user.screen_name;
    const tweetId = originalTweet.id_str;
    const mediaObject = tweet.extended_entities.media[0];
    let extension;
    let fileUrl;

    if (mediaObject.type === "video" || mediaObject.type === "animated_gif") {
      extension = ".mp4";
      fileUrl = mediaObject.video_info.variants[0].url;

      const filename = tweetId + extension;
      const filepath = path.join(__dirname, "../..", "downloads", filename);
      const file = fs.createWriteStream(filepath);
      const req = request.get(fileUrl);

      const storageTypes = {
        local: () => {
          return new Promise((resolve, reject) => {
            req.on("response", () => {
              req.pipe(file);
            });

            req.on("error", err => {
              console.log(err);
              fs.unlink(filepath);
              reject();
            });

            file.on("finish", () => file.close(resolve(filepath)));

            file.on("error", err => {
              console.log(err);
              fs.unlink(filepath);
              reject();
            });
          });
        },
        s3: () => {
          return new Promise((resolve, reject) => {
            req.on("response", res => {
              const params = {
                Bucket: "twitter-tools",
                Key: filename,
                Body: res,
                ACL: "public-read"
              };
              s3.upload(params, (err, data) => {
                if (err) {
                  console.log(err);
                  reject();
                }
                resolve(data.Location);
              });
            });

            req.on("error", err => {
              console.log(err);
              reject();
            });
          });
        }
      };

      const storage = process.env.NODE_ENV
        ? storageTypes.s3
        : storageTypes.local;

      const downloadUrl = await storage();

      const replyText = "Here's the link for your download: " + downloadUrl;
      console.log(replyText);
      reply(user, tweetId, replyText);
    } else {
      console.log("File type not suported.");
      reply(user, tweetId, "this file type is not supported =(");
    }
  } catch (err) {
    console.log("Error download: " + err);
    reply(user, tweetId, "an error occurred =(");
  }
};
