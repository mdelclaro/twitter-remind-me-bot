const request = require("request");
const fs = require("fs");
const path = require("path");

const agenda = require("../lib/agenda");

const { reply, dm } = require("./twitter");
const { upload } = require("./aws");

module.exports = async (tweet, originalTweet) => {
  try {
    console.log(JSON.stringify(tweet));
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
            req.on("response", async res => {
              const exec = await upload(filename, res);
              if (!exec) reject();
              agenda.on("ready", () =>
                agenda.schedule("in 10 seconds", "delete-file", {
                  key: filename
                })
              );

              resolve(exec);
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

      const replyText =
        "Here's the link for your download: " +
        downloadUrl +
        "\n\nThe link is valid for 1 hour from now =)";
      console.log(replyText);
      dm(originalTweet.user.id_str, replyText);
    } else {
      console.log("File type not suported.");
      reply(user, tweetId, "this file type is not supported =(");
    }
  } catch (err) {
    console.log("Error download: " + err);
    reply(user, tweetId, "an error occurred =(");
  }
};
