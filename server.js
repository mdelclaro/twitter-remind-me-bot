/*
 *
 *  THIS IS ONLY FOR LOCAL DOWNLOADS
 *
 */

const express = require("express");
const cors = require("cors");
const downloadRoute = require("./src/routes/download");

const app = express();

app.use(cors());

//Routes
app.use("/v1/download", downloadRoute);

//Error handling
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

//Invalid URL
app.use((req, res) => {
  res.status(404).json({ message: "Invalid URL!" });
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log("Download server started on port " + port);
