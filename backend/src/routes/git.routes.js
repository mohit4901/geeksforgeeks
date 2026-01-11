const express = require("express");
const router = express.Router();
const { pushToGitHub } = require("../controllers/git.controller");

router.post("/push", pushToGitHub);

module.exports = router;
