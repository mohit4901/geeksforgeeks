const express = require("express");
const router = express.Router();
const { generateMetrics } = require("../controllers/metrics.controller");

router.post("/", generateMetrics);

module.exports = router;
