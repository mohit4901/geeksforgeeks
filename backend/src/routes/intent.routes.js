const express = require("express");
const router = express.Router();
const { createIntent } = require("../controllers/intent.controller");

router.post("/", createIntent);

module.exports = router;
