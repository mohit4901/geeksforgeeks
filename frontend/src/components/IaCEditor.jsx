import Editor from "@monaco-editor/react";

export default function IaCEditor({ code, onChange }) {
  return (
    <div className="h-full rounded-xl overflow-hidden bg-[#0b1220]/90 backdrop-blur border border-white/10 shadow-2xl flex flex-col">

      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#060b14]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 text-xs text-slate-400 tracking-wide">
            Terraform IaC Editor
          </span>
        </div>

        <span className="text-xs px-2 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-400/20">
          HCL
        </span>
      </div>

      <div className="flex-1">
        <Editor
          height="100%"
          language="hcl"
          value={code}
          theme="vs-dark"
          onChange={(value) => onChange?.(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "JetBrains Mono, Fira Code, monospace",
            wordWrap: "on",
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            renderLineHighlight: "all"
          }}
        />
      </div>
    </div>
  );
}
