import { generateAI } from "../services/aiProvider.service.js";
import {
  generateTerraformPrompt,
  parseTerraform,
  extractResources
} from "../services/terraform.service.js";
import { buildDiagram } from "../services/diagram.service.js";
import { evaluateSecurity } from "../services/security.service.js";
import { calculateMetrics } from "../services/metrics.service.js";

export async function createIntent(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        success: false,
        error: "prompt is required"
      });
    }

    const aiPrompt = generateTerraformPrompt(prompt);
    const aiOutput = await generateAI(aiPrompt);

    const files = parseTerraform(aiOutput);
    const mainTf = files["main.tf"] || "";

    const diagram = buildDiagram(mainTf);
    const security = evaluateSecurity(mainTf);

    const model = {
      services: extractResources(mainTf)
    };

    const metrics = calculateMetrics(model, security);

    return res.json({
      success: true,
      files,
      diagram,
      security,
      metrics
    });
  } catch (err) {
    console.error("createIntent error:", err?.response?.data || err.message || err);
    return res.status(500).json({
      success: false,
      error: "Intent failed"
    });
  }
}