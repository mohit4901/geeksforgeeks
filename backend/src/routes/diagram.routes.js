import express from "express";
import { generateDiagram } from "../controllers/diagram.controller.js";

const router = express.Router();

router.post("/", generateDiagram);

export default router;