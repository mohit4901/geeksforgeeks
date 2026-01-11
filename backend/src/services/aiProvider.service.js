console.log("🔥 aiProvider.service.js LOADED (HYBRID)");

const { generateWithOpenAI } = require("./openAI.service");
const { generateWithOpenRouter } = require("./openRouter.service");

function fallbackIaC() {
  console.log("FALLBACK IaC USED");
  return `
provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "secure_bucket" {
  bucket = "secure-example-bucket"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "secure_bucket" {
  bucket = aws_s3_bucket.secure_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
`;
}

async function generateIaC(prompt) {
  try {
    const iac = await generateWithOpenAI(prompt);

    if (
      iac &&
      iac.includes("provider") &&
      iac.includes("resource")
    ) {
      return iac;
    }

    throw new Error("Invalid OpenAI output");

  } catch (e1) {
    console.warn("⚠️ OpenAI failed → switching to OpenRouter");

    try {
      const iac = await generateWithOpenRouter(prompt);

      if (
        iac &&
        iac.includes("provider") &&
        iac.includes("resource")
      ) {
        return iac;
      }

      throw new Error("Invalid OpenRouter output");

    } catch (e2) {
      return fallbackIaC();
    }
  }
}

module.exports = { generateIaC };
