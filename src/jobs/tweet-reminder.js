const { reply } = require("../utils/twitter");

module.exports = agenda => {
  agenda.define("tweet-reminder", (job, done) => {
    try {
      const { user, tweetId, reminder_text } = job.attrs.data;
      reply(user, tweetId, reminder_text);
      done();
    } catch (err) {
      console.log("Error reminder define: " + err);
    }
  });
};
