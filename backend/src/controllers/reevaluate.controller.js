const { buildCanonicalModel } = require("../services/canonicalModel.service");
const { buildDiagram } = require("../services/diagram.service");
const { validateSecurityRules } = require("../services/security.service");

exports.reEvaluateIaC = async (req, res) => {
  try {
    const { iac } = req.body;

    if (!iac) {
      return res.status(400).json({ error: "iac is required" });
    }

    const model = buildCanonicalModel(iac);

    const diagram = buildDiagram(model);

    const security = validateSecurityRules(model);

    const metrics = {
      totalResources: model.services.length,
      securityScore: security.score,
      riskDensity:
        model.services.length === 0
          ? 0
          : Math.round(
              (security.violations.length / model.services.length) * 100
            ),
      complexity:
        model.services.length < 5
          ? "Low"
          : model.services.length < 10
          ? "Medium"
          : "High"
    };

    return res.json({
      diagram,
      security,
      metrics
    });

  } catch (err) {
    console.error("RE-EVALUATE ERROR:", err);
    return res.status(500).json({
      error: "Failed to re-evaluate IaC"
    });
  }
};
