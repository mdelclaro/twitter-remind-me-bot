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
      console.log("Error on reply: " + err);
    })
    .then(() => {
      console.log("Replied");
    });
};

module.exports.dm = (recipient_id, text) => {
  twitter
    .post("direct_messages/events/new", {
      event: {
        type: "message_create",
        message_create: {
          target: {
            recipient_id
          },
          message_data: {
            text
          }
        }
      }
    })
    .catch(err => {
      console.log("Error on DM: " + err);
    })
    .then(() => {
      console.log("Sent DM");
    });
};
