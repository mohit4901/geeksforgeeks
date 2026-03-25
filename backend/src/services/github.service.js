import axios from "axios";

const GITHUB_API = "https://api.github.com";

export async function pushIaC({ repo, iac, token }) {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json"
  };

  // Step 1: get authenticated user
  const userRes = await axios.get(`${GITHUB_API}/user`, { headers });
  const username = userRes.data.login;

  // Step 2: check if repo exists
  try {
    await axios.get(`${GITHUB_API}/repos/${username}/${repo}`, { headers });
  } catch (error) {
    throw new Error(
      `Repository "${repo}" not found under account "${username}". Please create it manually on GitHub first.`
    );
  }

  // Step 3: create/update main.tf
  const content = Buffer.from(iac).toString("base64");

  let sha;
  try {
    const existing = await axios.get(
      `${GITHUB_API}/repos/${username}/${repo}/contents/main.tf`,
      { headers }
    );
    sha = existing.data.sha;
  } catch (error) {
    // file doesn't exist yet, that's okay
  }

  const body = {
    message: "Add Terraform IaC",
    content
  };

  if (sha) {
    body.sha = sha;
  }

  await axios.put(
    `${GITHUB_API}/repos/${username}/${repo}/contents/main.tf`,
    body,
    { headers }
  );

  return {
    repoUrl: `https://github.com/${username}/${repo}`
  };
}