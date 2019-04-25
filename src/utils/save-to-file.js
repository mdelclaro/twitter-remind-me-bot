const http = require("http");
const fs = require("fs");
const path = require("path");

module.exports = tweet => {
  try {
    tweet.id_str = "matheus";
    const file = fs.createWriteStream(
      path.join(
        __dirname,
        "../..",
        "downloads",
        // tweet.id_str
        "matheus" + ".jpg"
      )
    );
    http.get(
      //tweet.entities.media.media_url,
      "http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg",
      response => {
        response.pipe(file);
      }
    );
  } catch (err) {
    console.log("Error download: " + err);
  }
};
