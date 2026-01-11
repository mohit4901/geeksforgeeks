const { buildCanonicalModel } = require("../services/canonicalModel.service");
const { buildDiagram } = require("../services/diagram.service");
const { validateSecurityRules } = require("../services/security.service");

exports.syncIaC = async (req, res) => {
  const { iac } = req.body;

  const model = buildCanonicalModel(iac);
  const diagram = buildDiagram(model);
  const security = validateSecurityRules(model);

  res.json({ model, diagram, security });
};
