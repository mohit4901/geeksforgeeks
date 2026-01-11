import { useState } from "react";
import { createIntent } from "../api/backend";

export function useWorkspace() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function create(prompt) {
    try {
      setLoading(true);
      setError(null);
      const res = await createIntent(prompt);
      setData(res);
    } catch (e) {
      setError("Backend error" , e);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, create };
}
