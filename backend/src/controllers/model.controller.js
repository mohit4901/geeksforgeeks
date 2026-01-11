
const { buildCanonicalModel } = require("../services/canonicalModel.service");
const { validateSecurityRules } = require("../services/security.service");
const { simulateFailures } = require("../services/failureSimulator.service");
const { generateMetricsFromModel } = require("../services/metrics.service");
const { buildDiagram } = require("../services/diagram.service");

exports.buildModel = async (req, res) => {
  try {
    const { iac } = req.body;

    if (!iac) {
      return res.status(400).json({
        success: false,
        message: "IaC code is required to build model"
      });
    }

    const model = buildCanonicalModel(iac);

    const security = validateSecurityRules(model);

    const failures = simulateFailures(model);

    const metrics = generateMetricsFromModel(model);

    const diagram = buildDiagram(model);

    return res.json({
      success: true,
      data: {
        model,
        security,
        failures,
        metrics,
        diagram
      }
    });

  } catch (error) {
    console.error("Model build failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to build canonical model",
      error: error.message
    });
  }
};
