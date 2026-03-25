import { useState } from "react";
import { createIntent } from "../api/backend";

function sanitizeTerraform(iac = "") {
  let clean = iac;

  // remove fake file labels if AI returns them
  clean = clean.replace(/^\s*(provider\.tf|versions\.tf|main\.tf|output\.tf)\s*$/gim, "");

  // remove deprecated classiclink
  clean = clean.replace(/^\s*enable_classiclink\s*=\s*false\s*$/gim, "");

  // remove aws_key_pair block entirely
  clean = clean.replace(
    /resource\s+"aws_key_pair"\s+"[^"]+"\s*{[\s\S]*?}\s*/g,
    ""
  );

  // optional: replace open SSH comment for readability
  clean = clean.replace(
    /cidr_blocks\s*=\s*\["0\.0\.0\.0\/0"\]/g,
    'cidr_blocks = ["0.0.0.0/0"] # Consider restricting to trusted IPs'
  );

  // collapse excessive blank lines
  clean = clean.replace(/\n{3,}/g, "\n\n").trim();

  return clean;
}

export function useWorkspace() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function create(prompt) {
    try {
      setLoading(true);
      setError(null);

      const res = await createIntent(prompt);
      const rawIac = res?.files?.["main.tf"] || "";

      setData({
        ...res,
        iac: sanitizeTerraform(rawIac)
      });
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.error || "Backend error");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, create };
}