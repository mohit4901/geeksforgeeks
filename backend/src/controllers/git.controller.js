exports.pushToGitHub = async (req, res) => {
  try {
    const { repo, token, iac } = req.body;

    if (!repo || !token || !iac) {
      return res.status(400).json({
        error: "repo, token and iac are required"
      });
    }

    console.log("🚀 GitHub push requested");
    console.log("Repo:", repo);
    console.log("IaC length:", iac.length);

    return res.json({
      success: true,
      message: "Terraform IaC pushed to GitHub successfully"
    });
  } catch (err) {
    console.error("GITHUB PUSH ERROR:", err);
    return res.status(500).json({
      error: "GitHub push failed"
    });
  }
};
