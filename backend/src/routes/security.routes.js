import express from "express";
import { validateSecurity, autoFix } from "../controllers/security.controller.js";

const router = express.Router();

router.post("/validate", validateSecurity);
router.post("/fix", autoFix);

export default router;