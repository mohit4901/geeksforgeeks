const axios = require("axios");
const { sanitizeTerraformOutput } = require("../utils/sanitizeTerraform");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function generateWithOpenRouter(prompt) {
  console.log(" OpenRouter CALLED");

  const response = await axios.post(
    OPENROUTER_URL,
    {
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "system",
          content:
            "Generate ONLY valid Terraform IaC for AWS. No explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const raw =
    response?.data?.choices?.[0]?.message?.content || "";

  return sanitizeTerraformOutput(raw);
}

module.exports = { generateWithOpenRouter };
