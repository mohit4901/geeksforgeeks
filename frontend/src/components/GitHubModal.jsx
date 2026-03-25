import { useState } from "react";

export default function GitHubModal({ onClose, onPush, loading = false }) {
  const [repo, setRepo] = useState("");
  const [token, setToken] = useState("");

  const handlePush = async () => {
    if (!repo.trim()) return;
    await onPush({ repo, token });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
      <div className="w-[420px] rounded-xl bg-[#0b1220] border border-white/10 shadow-2xl p-6">
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
            placeholder="infra-demo-repo"
            className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-5">
          <label className="text-xs text-slate-400 block mb-1">
            GitHub Token (optional if backend .env already has it)
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Leave empty to use backend token"
            className="w-full px-3 py-2 rounded bg-black/40 text-white text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            If your backend already has GITHUB_TOKEN in .env, you can leave this blank.
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
            disabled={!repo || loading}
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