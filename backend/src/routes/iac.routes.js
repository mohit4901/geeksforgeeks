import express from "express";
import { syncIaC } from "../controllers/iac.controller.js";

const router = express.Router();

router.post("/sync", syncIaC);

export default router;