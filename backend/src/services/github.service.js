const axios = require("axios");

const GITHUB_API = "https://api.github.com";

exports.pushIaC = async ({ repo, iac, token }) => {
  const headers = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github+json"
  };

  await axios.post(
    `${GITHUB_API}/user/repos`,
    { name: repo, private: true },
    { headers }
  );

  const content = Buffer.from(iac).toString("base64");

  await axios.put(
    `${GITHUB_API}/repos/${repo}/contents/main.tf`,
    {
      message: "Add Terraform IaC",
      content
    },
    { headers }
  );
};
