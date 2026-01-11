exports.buildDiagram = (model) => {
  if (!model || !model.services) return "";

  const lines = ["graph TD"];

  let hasVPC = false;
  let hasEC2 = false;
  let hasS3 = false;

  model.services.forEach(s => {
    if (s.type === "vpc") hasVPC = true;
    if (s.type === "ec2") hasEC2 = true;
    if (s.type === "s3") hasS3 = true;
  });

  if (hasVPC) {
    lines.push("VPC[VPC]");
    lines.push("SUBNET[Public Subnet]");
    lines.push("IGW[Internet Gateway]");
    lines.push("IGW --> SUBNET");
    lines.push("VPC --> SUBNET");
  }

  if (hasEC2) {
    lines.push("EC2[EC2 Instance]");
    if (hasVPC) {
      lines.push("SUBNET --> EC2");
    } else {
      lines.push("EC2");
    }
  }

  if (hasS3) {
    lines.push("S3[S3 Bucket]");
    if (hasEC2) {
      lines.push("EC2 --> S3");
    }
  }

  return lines.join("\n");
};
