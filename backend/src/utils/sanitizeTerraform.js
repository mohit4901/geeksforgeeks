
exports.sanitizeTerraformOutput = (raw) => {
    if (!raw || typeof raw !== "string") return "";
  
    const match = raw.match(/```(?:hcl)?([\s\S]*?)```/i);
    if (match) {
      return match[1].trim();
    }
  
    return raw
      .split("\n")
      .filter(line =>
        !line.toLowerCase().includes("terraform init") &&
        !line.toLowerCase().includes("terraform apply") &&
        !line.toLowerCase().includes("this example") &&
        !line.toLowerCase().includes("you should") &&
        !line.toLowerCase().startsWith("i will") &&
        !line.toLowerCase().startsWith("here is")
      )
      .join("\n")
      .trim();
  };
  