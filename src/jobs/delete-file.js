const { deleteFile } = require("../utils/aws");

module.exports = agenda => {
  agenda.define("delete-file", (job, done) => {
    try {
      const { key } = job.attrs.data;
      deleteFile(key);
      done();
    } catch (err) {
      console.log("Error delete define: " + err);
    }
  });
};
