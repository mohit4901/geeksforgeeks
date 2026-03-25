import express from "express";
import { generateMetrics } from "../controllers/metrics.controller.js";

const router = express.Router();

router.post("/", generateMetrics);

export default router;