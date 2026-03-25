import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function InfraInput({ onCreate, loading }) {
  const [prompt, setPrompt] = useState("");

  const handleCreate = () => {
    if (!prompt.trim() || loading) return;
    onCreate(prompt);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-800 bg-zinc-900">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-sm font-semibold tracking-wide text-zinc-200">
          InfraSketch AI
        </span>
      </div>

      {/* Body */}
      <div className="p-6">
        <textarea
          rows={5}
          placeholder='e.g. "Create a secure AWS VPC with EC2 and encrypted S3 using Terraform"'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-zinc-100 placeholder:text-zinc-500 outline-none resize-none transition-all duration-200 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/40 disabled:opacity-70 disabled:cursor-not-allowed"
        />

        <button
          onClick={handleCreate}
          disabled={loading || !prompt.trim()}
          className="mt-5 w-full rounded-2xl bg-white px-6 py-4 text-black font-semibold tracking-wide transition-all duration-200 hover:bg-zinc-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating infrastructure...
            </>
          ) : (
            "Create Workspace"
          )}
        </button>
      </div>
    </div>
  );
}