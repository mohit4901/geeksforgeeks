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


export async function reEvaluateIaC(iac) {
  const res = await api.post("/re-evaluate", { iac });
  return res.data;
}


export async function pushToGitHub({ repo, iac, token }) {
  const res = await api.post("/github/push", {
    repo,
    iac,
    token
  });

  return res.data;
}
