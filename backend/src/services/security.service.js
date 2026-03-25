import rules from "../rules/aws.security.json" with { type: "json" };
import { extractResources } from "./terraform.service.js";

const SEVERITY_PENALTY = {
  CRITICAL: 30,
  HIGH: 20,
  MEDIUM: 10,
  LOW: 5
};

function normalizeType(type = "") {
  if (type.includes("s3")) return "s3";
  if (type.includes("instance") || type.includes("ec2")) return "ec2";
  if (type.includes("vpc")) return "vpc";
  return type;
}

function isViolation(service, condition) {
  if (!condition || typeof condition !== "string") return false;

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

export function evaluateSecurity(terraformCode = "") {
  const model = {
    services: extractResources(terraformCode).map((s) => ({
      ...s,
      type: normalizeType(s.type)
    }))
  };

  let score = 100;
  const violations = [];

  model.services.forEach((service) => {
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

  // duplicate violations hatao
  const uniqueViolations = [];
  const seen = new Set();

  for (const v of violations) {
    const key = `${v.id}-${v.resource}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueViolations.push(v);
    }
  }

  return {
    score: Math.max(score, 0),
    violations: uniqueViolations
  };
}

export async function autoFixIaC(iac, violations) {
  if (!violations || violations.length === 0) return iac;

  const fixes = violations
    .map((v) => `# SECURITY FIX SUGGESTION (${v.id}): ${v.fix}`)
    .join("\n");

  return `${iac}\n\n${fixes}`;
}