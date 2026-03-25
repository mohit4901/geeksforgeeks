import { evaluateSecurity, autoFixIaC } from "../services/security.service.js";

export function validateSecurity(req, res) {
  try {
    const { terraform } = req.body;

    if (!terraform || typeof terraform !== "string") {
      return res.status(400).json({
        success: false,
        error: "terraform is required"
      });
    }

    const result = evaluateSecurity(terraform);

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("validateSecurity error:", error);
    return res.status(500).json({
      success: false,
      error: "Security validation failed"
    });
  }
}

export async function autoFix(req, res) {
  try {
    const { terraform, violations } = req.body;

    if (!terraform || typeof terraform !== "string") {
      return res.status(400).json({
        success: false,
        error: "terraform is required"
      });
    }

    const fixedIaC = await autoFixIaC(terraform, violations || []);

    return res.json({
      success: true,
      fixedIaC
    });
  } catch (error) {
    console.error("autoFix error:", error);
    return res.status(500).json({
      success: false,
      error: "Auto-fix failed"
    });
  }
}