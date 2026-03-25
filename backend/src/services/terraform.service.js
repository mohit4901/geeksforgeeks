export function generateTerraformPrompt(userPrompt = "") {
  return `
You are a world-class Cloud Infrastructure Architect and Terraform expert.

Convert the following natural language cloud requirement into valid Terraform code.

STRICT REQUIREMENTS:
- Return ONLY Terraform code
- Use AWS resources
- Make the code production-style
- Add secure defaults where possible
- Prefer secure S3, VPC, and EC2 defaults
- DO NOT include explanations
- DO NOT include markdown fences
- DO NOT label files like provider.tf, main.tf, output.tf, versions.tf
- Return everything as one valid Terraform file

User Request:
${userPrompt}
`;
}

export function validateTerraformSyntax(iac) {
  const errors = [];

  if (!iac || typeof iac !== "string") {
    errors.push("IaC is empty");
  }

  if (!iac.includes("provider")) {
    errors.push("Missing provider block");
  }

  if (!iac.match(/resource\s+"/)) {
    errors.push("No resource blocks found");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function normalizeTerraform(iac = "") {
  return iac
    .replace(/^\s*(provider\.tf|versions\.tf|main\.tf|output\.tf)\s*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function extractResources(iac = "") {
  const clean = normalizeTerraform(iac);
  const resources = [];

  const regex = /resource\s+"([^"]+)"\s+"([^"]+)"\s*{/g;
  let match;

  while ((match = regex.exec(clean)) !== null) {
    const type = match[1];
    const name = match[2];
    const startIndex = match.index;

    let braceCount = 0;
    let bodyStart = clean.indexOf("{", startIndex);
    let i = bodyStart;

    for (; i < clean.length; i++) {
      if (clean[i] === "{") braceCount++;
      if (clean[i] === "}") braceCount--;
      if (braceCount === 0) break;
    }

    const fullBlock = clean.slice(startIndex, i + 1);
    const body = clean.slice(bodyStart + 1, i);

    resources.push({
      type,
      name,
      block: fullBlock,
      body,
      encrypted:
        body.includes("server_side_encryption_configuration") ||
        body.includes("apply_server_side_encryption_by_default") ||
        body.includes("sse_algorithm") ||
        body.includes("AES256") ||
        body.includes("kms"),
      isPublic:
        body.includes("0.0.0.0/0") ||
        body.includes("public") ||
        body.includes("associate_public_ip_address = true"),
      hasIAM:
        body.includes("iam_instance_profile") ||
        body.includes("aws_iam_role") ||
        body.includes("instance_profile") ||
        body.includes("role"),
      singleAZ: body.includes("availability_zone"),
      scalable:
        body.includes("autoscaling") ||
        body.includes("aws_autoscaling_group")
    });
  }

  return resources;
}

export function parseTerraform(aiOutput = "") {
  const clean = normalizeTerraform(aiOutput);

  return {
    "main.tf": clean
  };
}