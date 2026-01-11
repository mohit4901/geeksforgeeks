const express = require("express");
const router = express.Router();
const { simulateFuture } = require("../controllers/timemachine.controller");

router.post("/simulate", simulateFuture);

module.exports = router;
