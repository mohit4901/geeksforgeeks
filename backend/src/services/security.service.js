const rules = require("../rules/aws.security.json");

const SEVERITY_PENALTY = {
  CRITICAL: 30,
  HIGH: 20,
  MEDIUM: 10,
  LOW: 5
};


function isViolation(service, condition) {

  const [field, operator, rawValue] = condition.split(" ");
  const expected =
    rawValue === "true" ? true :
    rawValue === "false" ? false :
    rawValue;

  if (!(field in service)) return false;

  switch (operator) {
    case "==":
      return service[field] === expected;
    case "!=":
      return service[field] !== expected;
    default:
      return false;
  }
}

exports.validateSecurityRules = (model) => {
  let score = 100;
  const violations = [];

  model.services.forEach(service => {
    Object.entries(rules).forEach(([id, rule]) => {
      if (rule.resource === service.type) {
        if (isViolation(service, rule.condition)) {
          score -= SEVERITY_PENALTY[rule.severity] || 10;

          violations.push({
            id,
            severity: rule.severity,
            description: rule.description,
            fix: rule.fix,
            resource: service.type
          });
        }
      }
    });
  });

  return {
    score: Math.max(score, 0),
    violations
  };
};

exports.autoFixIaC = async (iac, violations) => {
  if (!violations || violations.length === 0) return iac;

  const fixes = violations.map(v =>
    `# SECURITY FIX SUGGESTION (${v.id}): ${v.fix}`
  ).join("\n");

  return `${iac}\n\n${fixes}`;
};
