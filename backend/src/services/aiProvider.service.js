import OpenAI from "openai";
import { sanitizeTerraformOutput } from "../utils/sanitizeTerraform.js";

const MODEL =
  process.env.NVIDIA_NIM_MODEL || "meta/llama-3.3-70b-instruct";

function fallbackIaC() {
  return `
provider.tf
provider "aws" {
  region = "us-east-1"
}

versions.tf
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

main.tf
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "main-vpc"
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "main-igw"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "public-rt"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "ec2" {
  name        = "ec2-sg"
  description = "Allow SSH from trusted IPs"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["203.0.113.10/32"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ec2-sg"
  }
}

resource "aws_instance" "web" {
  ami                    = "ami-0c02fb55956c7d316"
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ec2.id]

  tags = {
    Name = "main-ec2"
  }
}

resource "aws_s3_bucket" "secure_bucket" {
  bucket = "secure-example-bucket-demo"

  tags = {
    Name = "secure-bucket"
  }
}

resource "aws_s3_bucket_versioning" "secure_bucket_versioning" {
  bucket = aws_s3_bucket.secure_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "secure_bucket_encryption" {
  bucket = aws_s3_bucket.secure_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

output.tf
output "vpc_id" {
  value = aws_vpc.main.id
}

output "subnet_id" {
  value = aws_subnet.public.id
}

output "ec2_instance_id" {
  value = aws_instance.web.id
}

output "s3_bucket_name" {
  value = aws_s3_bucket.secure_bucket.bucket
}
`;
}

function getClient() {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;

  if (!apiKey) return null;

  return new OpenAI({
    baseURL: "https://integrate.api.nvidia.com/v1",
    apiKey
  });
}

function buildSystemPrompt() {
  return `
You are a Principal Cloud Infrastructure Architect and Senior DevOps Engineer.

Generate realistic, production-style Terraform Infrastructure-as-Code for AWS.

STRICT RULES:
- Return ONLY Terraform code
- No markdown fences
- No explanations
- No prose
- No fake SSH keys
- No deprecated fields
- No invalid Terraform
- No placeholders
- No YAML, JSON, bash, or comments outside Terraform

VERY IMPORTANT:
Prefer this exact logical structure in order:

provider.tf
versions.tf
main.tf
output.tf

QUALITY RULES:
- Make the architecture realistic and deployable
- Use secure defaults
- Use clean naming
- Use modern Terraform syntax
- Include useful outputs
- Avoid toy examples
- Keep it hackathon-demo ready
- Prefer AWS best-practice style resources

If the user asks for:
- networking → include VPC / subnets / route tables / IGW as appropriate
- compute → include EC2 or relevant compute
- storage → include secure S3 if relevant
- security → use secure defaults where practical

Return ONLY Terraform code.
`.trim();
}

function buildUserPrompt(userPrompt = "") {
  return `
Generate realistic AWS Terraform for this requirement:

${userPrompt}

Important:
- Make it look real-world and professional
- Keep it clean and deployable
- Prefer returning all 4 logical Terraform files:
  provider.tf
  versions.tf
  main.tf
  output.tf
`.trim();
}

function isValidTerraformOutput(text = "") {
  if (!text || typeof text !== "string") return false;

  const hasProvider = text.includes('provider "aws"');
  const hasTerraformBlock = text.includes("terraform {");
  const hasResource = text.includes('resource "');
  const hasOutput = text.includes('output "');

  // accept if it has enough real Terraform structure
  return hasProvider && hasTerraformBlock && hasResource && hasOutput;
}

function normalizeNimOutput(text = "") {
  if (!text) return "";

  let clean = sanitizeTerraformOutput(text);

  // If model returned raw terraform without file labels,
  // wrap it into pseudo 4-file format for downstream parser.
  const hasLabels =
    clean.includes("provider.tf") &&
    clean.includes("versions.tf") &&
    clean.includes("main.tf") &&
    clean.includes("output.tf");

  if (hasLabels) return clean;

  const providerMatch = clean.match(/provider\s+"aws"\s*{[\s\S]*?}\s*/);
  const terraformMatch = clean.match(/terraform\s*{[\s\S]*?}\s*/);
  const outputMatches = clean.match(/output\s+"[^"]+"\s*{[\s\S]*?}\s*/g) || [];

  let mainPart = clean;

  if (providerMatch?.[0]) mainPart = mainPart.replace(providerMatch[0], "");
  if (terraformMatch?.[0]) mainPart = mainPart.replace(terraformMatch[0], "");
  if (outputMatches.length) {
    outputMatches.forEach((o) => {
      mainPart = mainPart.replace(o, "");
    });
  }

  return `
provider.tf
${providerMatch?.[0]?.trim() || ""}

versions.tf
${terraformMatch?.[0]?.trim() || ""}

main.tf
${mainPart.trim()}

output.tf
${outputMatches.join("\n\n").trim()}
`.trim();
}

export async function generateAI(prompt) {
  try {
    const client = getClient();

    if (!client) {
      console.warn("⚠️ NVIDIA_NIM_API_KEY missing. Using fallback IaC.");
      return fallbackIaC();
    }

    console.log(`🔥 NVIDIA NIM CALLED → ${MODEL}`);

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: buildSystemPrompt()
        },
        {
          role: "user",
          content: buildUserPrompt(prompt)
        }
      ],
      temperature: 0.3,
      top_p: 0.85,
      max_tokens: 2200,
      stream: false
    });

    const raw = completion?.choices?.[0]?.message?.content || "";
    console.log("🧠 RAW NIM OUTPUT:\n", raw);

    const normalized = normalizeNimOutput(raw);

    if (isValidTerraformOutput(normalized)) {
      console.log("✅ NIM Terraform accepted");
      return normalized;
    }

    console.warn("⚠️ Invalid NIM output. Using fallback IaC.");
    return fallbackIaC();
  } catch (error) {
    console.error(
      "❌ NVIDIA NIM ERROR:",
      error?.response?.data || error.message || error
    );
    return fallbackIaC();
  }
}