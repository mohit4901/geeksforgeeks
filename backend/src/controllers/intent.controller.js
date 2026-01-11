const { generateIaC } = require("../services/aiProvider.service");
const { buildCanonicalModel } = require("../services/canonicalModel.service");
const { buildDiagram } = require("../services/diagram.service");
const { validateSecurityRules } = require("../services/security.service");

exports.createIntent = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const iac = await generateIaC(prompt);

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

    res.json({
      iac,
      model,
      diagram,
      security,
      metrics
    });
  } catch (err) {
    console.error("INTENT ERROR:", err);
    res.status(500).json({ error: "Failed to generate IaC" });
  }
};
