import { pushIaC } from "../services/github.service.js";

export async function pushToGitHub(req, res) {
  try {
    const { repo, terraform, token } = req.body;

    if (!repo || !terraform) {
      return res.status(400).json({
        success: false,
        error: "repo and terraform are required"
      });
    }

    const githubToken = token || process.env.GITHUB_TOKEN;

    if (!githubToken) {
      return res.status(400).json({
        success: false,
        error: "GitHub token is missing"
      });
    }

    const result = await pushIaC({
      repo,
      iac: terraform,
      token: githubToken
    });

    return res.json({
      success: true,
      message: "Terraform IaC pushed to GitHub successfully",
      data: result
    });
  } catch (err) {
    console.error("GITHUB PUSH ERROR:", err?.response?.data || err.message || err);
    return res.status(500).json({
      success: false,
      error: "GitHub push failed"
    });
  }
}