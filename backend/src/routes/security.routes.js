const express = require("express");
const router = express.Router();
const { validateSecurity, autoFix } = require("../controllers/security.controller");

router.post("/validate", validateSecurity);
router.post("/fix", autoFix);

module.exports = router;
