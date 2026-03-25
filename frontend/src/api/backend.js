import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export async function createIntent(prompt) {
  const res = await api.post("/intent", { prompt });
  return res.data;
}

export async function reEvaluateIaC(terraform) {
  const [diagramRes, securityRes, metricsRes] = await Promise.all([
    api.post("/diagram", { terraform }),
    api.post("/security/validate", { terraform }),
    api.post("/metrics", { terraform })
  ]);

  return {
    diagram: diagramRes.data.diagram,
    security: {
      score: securityRes.data.score,
      violations: securityRes.data.violations
    },
    metrics: metricsRes.data.metrics
  };
}

export async function pushToGitHub({ repo, terraform, token }) {
  const res = await api.post("/git/push", {
    repo,
    terraform,
    token
  });

  return res.data;
}

export async function autoFixSecurity(terraform, violations = []) {
  const res = await api.post("/security/fix", {
    terraform,
    violations
  });

  return res.data;
}