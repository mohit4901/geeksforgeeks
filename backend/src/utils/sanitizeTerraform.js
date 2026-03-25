export function sanitizeTerraformOutput(raw) {
  if (!raw || typeof raw !== "string") return "";

  const match = raw.match(/```(?:hcl|terraform)?\s*([\s\S]*?)```/i);
  if (match) {
    return match[1].trim();
  }

  return raw
    .split("\n")
    .filter((line) => {
      const lower = line.toLowerCase().trim();
      return (
        !lower.includes("terraform init") &&
        !lower.includes("terraform apply") &&
        !lower.includes("this example") &&
        !lower.includes("you should") &&
        !lower.startsWith("i will") &&
        !lower.startsWith("here is")
      );
    })
    .join("\n")
    .trim();
}