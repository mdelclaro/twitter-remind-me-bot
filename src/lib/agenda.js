const Agenda = require("agenda");
const { mongo_url } = require("../../config");

const agenda = new Agenda({
  db: {
    address: mongo_url,
    collection: "tweets",
    options: { useNewUrlParser: true }
  }
});
let jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(",") : [];

jobTypes.forEach(type => {
  require("../jobs/" + type)(agenda);
});

if (jobTypes.length) {
  agenda.on("ready", () => {
    console.log("Started agenda!");
    agenda.start();
  });
}

async function graceful() {
  console.log("Gracefully shutting down...");
  await agenda.stop();
  process.exit(0);
}

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

module.exports = agenda;
