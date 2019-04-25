const path = require("path");

module.exports = async (req, res, next) => {
  try {
    const filename = req.params.id;
    const file = path.join(__dirname, "../..", "downloads", filename + ".jpg");
    res.download(file);
  } catch (err) {
    console.log("Download controller error: " + err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
