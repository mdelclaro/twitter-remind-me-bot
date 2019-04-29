const request = require("request");
const fs = require("fs");
const path = require("path");

const agenda = require("../lib/agenda");

const { reply, dm } = require("../utils/twitter");
const { upload } = require("../utils/aws");

module.exports.download = async (tweet, originalTweet) => {
  try {
    const user = originalTweet.user.screen_name;
    const tweetId = originalTweet.id_str;
    const mediaObject = tweet.extended_entities.media[0];
    let extension;
    let fileUrl;

    if (mediaObject.type === "video" || mediaObject.type === "animated_gif") {
      extension = ".mp4";
      if (mediaObject.video_info.variants[0].hasOwnProperty("bitrate")) {
        fileUrl = mediaObject.video_info.variants[0].url;
      } else if (mediaObject.video_info.variants[1].hasOwnProperty("bitrate")) {
        fileUrl = mediaObject.video_info.variants[1].url;
      } else {
        dm(
          originalTweet.user.id_str,
          "Sorry, I couldn't get this file's link =("
        );
      }

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
              agenda.schedule("in 1 hour", "delete-file", {
                key: filename
              });
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

module.exports.localDownload = async (req, res, next) => {
  try {
    const filename = req.params.id;
    const file = path.join(__dirname, "../..", "downloads", filename);
    res.download(file);
  } catch (err) {
    console.log("Download controller error: " + err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
