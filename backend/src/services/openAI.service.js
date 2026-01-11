const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateWithOpenAI(prompt) {
  console.log("OpenAI CALLED");

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You are a senior DevOps engineer. Generate ONLY valid Terraform IaC for AWS. No explanations."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return response.output_text;
}

module.exports = { generateWithOpenAI };
