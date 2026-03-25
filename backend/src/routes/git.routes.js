import express from "express";
import { pushToGitHub } from "../controllers/git.controller.js";

const router = express.Router();

router.post("/push", pushToGitHub);

export default router;