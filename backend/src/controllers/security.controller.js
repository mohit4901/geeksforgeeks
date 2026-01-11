const { validateSecurityRules, autoFixIaC } = require("../services/security.service");

exports.validateSecurity = (req, res) => {
  const { model } = req.body;
  res.json(validateSecurityRules(model));
};

exports.autoFix = async (req, res) => {
  const { iac, violations } = req.body;
  const fixedIaC = await autoFixIaC(iac, violations);
  res.json({ fixedIaC });
};
