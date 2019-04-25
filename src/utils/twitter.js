const twitter = require("../lib/twitter");

module.exports.reply = (user, tweetId, text) => {
  const status = `@${user} ${text}`;
  const in_reply_to_status_id = tweetId;
  twitter
    .post("statuses/update", {
      status,
      in_reply_to_status_id,
      auto_populate_reply_metadata: true
    })
    .catch(err => {
      console.log("Error: " + err);
    })
    .then(() => {
      console.log("Replied");
    });
};
