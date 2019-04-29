const express = require("express");

const { localDownload } = require("../controllers/download");

const router = express.Router();

// GET /v1/download/id
router.get("/:id", localDownload);

module.exports = router;
