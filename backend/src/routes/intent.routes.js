import express from "express";
import { createIntent } from "../controllers/intent.controller.js";

const router = express.Router();

router.post("/", createIntent);

export default router;