import { extractResources } from "./terraform.service.js";

export function buildDiagram(terraformCode = "") {
  const resources = extractResources(terraformCode);

  if (!resources || !resources.length) return "graph TD\nA[No Resources Found]";

  const lines = ["graph TD"];

  let hasVPC = false;
  let hasEC2 = false;
  let hasS3 = false;

  resources.forEach((r) => {
    if (r.type.includes("vpc")) hasVPC = true;
    if (r.type.includes("instance") || r.type.includes("ec2")) hasEC2 = true;
    if (r.type.includes("s3")) hasS3 = true;
  });

  if (hasVPC) {
    lines.push("VPC[VPC]");
    lines.push("SUBNET[Public Subnet]");
    lines.push("IGW[Internet Gateway]");
    lines.push("VPC --> SUBNET");
    lines.push("IGW --> SUBNET");
  }

  if (hasEC2) {
    lines.push("EC2[EC2 Instance]");
    lines.push(hasVPC ? "SUBNET --> EC2" : "EC2");
  }

  if (hasS3) {
    lines.push("S3[S3 Bucket]");
    if (hasEC2) lines.push("EC2 --> S3");
  }

  if (!hasVPC && !hasEC2 && !hasS3) {
    resources.forEach((r, index) => {
      lines.push(`R${index}[${r.type}]`);
    });
  }

  return lines.join("\n");
}