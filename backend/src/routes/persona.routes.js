const express = require("express");
const router = express.Router();
const { chatWithInfra } = require("../controllers/persona.controller");

router.post("/chat", chatWithInfra);

module.exports = router;
