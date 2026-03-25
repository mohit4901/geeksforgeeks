import { extractResources } from "../services/terraform.service.js";
import { evaluateSecurity } from "../services/security.service.js";
import { calculateMetrics } from "../services/metrics.service.js";

export function generateMetrics(req, res) {
  try {
    const { terraform } = req.body;

    if (!terraform || typeof terraform !== "string") {
      return res.status(400).json({
        success: false,
        error: "terraform is required"
      });
    }

    const model = {
      services: extractResources(terraform)
    };

    const security = evaluateSecurity(terraform);
    const metrics = calculateMetrics(model, security);

    return res.json({
      success: true,
      metrics
    });
  } catch (error) {
    console.error("generateMetrics error:", error);
    return res.status(500).json({
      success: false,
      error: "Metrics generation failed"
    });
  }
}