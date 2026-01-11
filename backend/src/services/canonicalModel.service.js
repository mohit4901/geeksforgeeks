const terraform = require("./terraform.service");


function detectS3Encryption(block = "") {
  if (typeof block !== "string") return false;

  const normalized = block.replace(/\s+/g, " ").toLowerCase();

  return (
    normalized.includes("server_side_encryption_configuration") ||
    normalized.includes("apply_server_side_encryption_by_default") ||
    normalized.includes("sse_algorithm")
  );
}


function detectPublicIngress(block = "", port) {
  if (typeof block !== "string") return false;

  return (
    block.includes(`from_port = ${port}`) &&
    block.includes(`to_port = ${port}`) &&
    block.includes(`"0.0.0.0/0"`)
  );
}


function detectIAM(block = "") {
  if (typeof block !== "string") return false;

  return (
    block.includes("iam_instance_profile") ||
    block.includes("aws_iam_role") ||
    block.includes("instance_profile")
  );
}


exports.buildCanonicalModel = (iac) => {
  const syntax = terraform.validateTerraformSyntax(iac);
  const resources = terraform.extractResources(iac);

  const services = [];
  const seen = new Set();

  resources.forEach(r => {
    const key = `${r.type}-${r.name || ""}`;
    if (seen.has(key)) return;
    seen.add(key);

    if (r.type === "aws_s3_bucket") {
      services.push({
        type: "s3",
        encrypted: detectS3Encryption(r.block),
        public: false
      });
      return;
    }

    if (r.type === "aws_instance") {
      services.push({
        type: "ec2",
        hasIAM: detectIAM(r.block),
        scalable: false,       
        singleAZ: false,
        sshOpenToWorld: detectPublicIngress(r.block, 22),
        httpPublic: detectPublicIngress(r.block, 80),
        httpsPublic: detectPublicIngress(r.block, 443),
        isPublic: r.block?.includes("associate_public_ip_address = true")
      });
      return;
    }

    if (r.type === "aws_vpc") {
      services.push({
        type: "vpc",
        isolated: true,
        natGateway: iac.includes("aws_nat_gateway")
      });
      return;
    }

    services.push({ type: r.type });
  });

  return {
    syntax,
    services
  };
};

