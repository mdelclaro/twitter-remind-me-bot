const express = require("express");

const download = require("../controllers/download");

const router = express.Router();

// GET /v1/download/id
router.get("/:id", download);

module.exports = router;
