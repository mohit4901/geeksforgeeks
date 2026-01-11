import { useState } from "react";

export default function GitHubModal({ onClose, onPush }) {
  const [repo, setRepo] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePush = async () => {
    try {
      setLoading(true);
      await onPush({ repo, token });
      onClose(); // close on success
    } catch (err) {
      alert("Failed to push to GitHub" , err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
      <div className="w-[380px] rounded-xl bg-[#0b1220] border border-white/10 shadow-2xl p-6">

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-semibold">
            Push to GitHub
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mb-3">
          <label className="text-xs text-slate-400 block mb-1">
            Repository name
          </label>
          <input
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="infra-sketch-iac"
            className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-5">
          <label className="text-xs text-slate-400 block mb-1">
            GitHub Personal Access Token
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_************************"
            className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Token is used only for this push and never stored.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            disabled={!repo || !token || loading}
            onClick={handlePush}
            className="px-4 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Pushing…" : "Push"}
          </button>
        </div>
      </div>
    </div>
  );
}
