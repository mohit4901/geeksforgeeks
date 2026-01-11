import { useState } from "react";

export default function InfraInput({ onCreate, loading }) {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="infra-input">
      <div className="prompt-header">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
        <span className="title">InfraSketch AI</span>
      </div>

      <textarea
        rows={3}
        placeholder='e.g. "Create a secure AWS VPC with EC2 and encrypted S3 using Terraform"'
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="prompt-box"
      />

      <button
        onClick={() => onCreate(prompt)}
        disabled={loading || !prompt.trim()}
        className="generate-btn"
      >
        {loading ? "⚙️ Generating infrastructure..." : "Create Workspace"}
      </button>
    </div>
  );
}
