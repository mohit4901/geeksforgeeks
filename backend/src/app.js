require("dotenv").config();
const express = require("express");
const cors = require("cors");

const intentRoutes = require("./routes/intent.routes");
const iacRoutes = require("./routes/iac.routes");
const diagramRoutes = require("./routes/diagram.routes");
const securityRoutes = require("./routes/security.routes");
const personaRoutes = require("./routes/persona.routes");
const timeMachineRoutes = require("./routes/timemachine.routes");
const metricsRoutes = require("./routes/metrics.routes");
const gitRoutes = require("./routes/git.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/intent", intentRoutes);
app.use("/api/iac", iacRoutes);
app.use("/api/diagram", diagramRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/persona", personaRoutes);
app.use("/api/timemachine", timeMachineRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/git", gitRoutes);

module.exports = app;
