const express = require("express");
const router = express.Router();

const { reEvaluateIaC } = require("../controllers/reevaluate.controller");

router.post("/re-evaluate", reEvaluateIaC);

module.exports = router;
