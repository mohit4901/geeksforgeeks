const express = require("express");
const router = express.Router();
const { syncIaC } = require("../controllers/iac.controller");

router.post("/sync", syncIaC);

module.exports = router;
