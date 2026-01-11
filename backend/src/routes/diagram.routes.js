const express = require("express");
const router = express.Router();
const { generateDiagram } = require("../controllers/diagram.controller");

router.post("/", generateDiagram);

module.exports = router;
