exports.validateTerraformSyntax = (iac) => {
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
  };
  
  exports.extractResources = (iac) => {
    const resources = [];
    const regex = /resource\s+"([^"]+)"\s+"([^"]+)"\s*{([\s\S]*?)}/g;
    let match;
  
    while ((match = regex.exec(iac)) !== null) {
      const body = match[3];
  
      resources.push({
        type: match[1],
        name: match[2],
        encrypted: body.includes("encryption") || body.includes("kms"),
        isPublic: body.includes("0.0.0.0/0") || body.includes("public"),
        hasIAM: body.includes("iam") || body.includes("role"),
        singleAZ: body.includes("availability_zone"),
        scalable: body.includes("autoscaling")
      });
    }
  
    return resources;
  };
  