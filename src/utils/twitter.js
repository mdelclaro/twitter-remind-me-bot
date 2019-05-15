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

module.exports.dm = data => {
  const { userId, replyText, user, tweetId } = data;
  twitter
    .post("direct_messages/events/new", {
      event: {
        type: "message_create",
        message_create: {
          target: {
            recipient_id: userId
          },
          message_data: {
            // text: replyText
          }
        }
      }
    })
    .then(() => {
      console.log("Sent DM");
    })
    .catch(err => {
      console.log("Error on DM: " + err);
      module.exports.reply(user, tweetId, replyText);
      console.log("Sent reply instead of DM");
    });
};
