import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import intentRoutes from "./routes/intent.routes.js";
import diagramRoutes from "./routes/diagram.routes.js";
import securityRoutes from "./routes/security.routes.js";
import metricsRoutes from "./routes/metrics.routes.js";
import gitRoutes from "./routes/git.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Cloud Infra Designer Backend is running 🚀"
  });
});

app.use("/api/intent", intentRoutes);
app.use("/api/diagram", diagramRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/git", gitRoutes);

export default app;