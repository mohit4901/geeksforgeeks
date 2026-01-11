import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function Diagram({ diagram }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!diagram || !ref.current) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "loose",
      flowchart: { useMaxWidth: false }
    });

    ref.current.innerHTML = "";

    const el = document.createElement("div");
    el.className = "mermaid";
    el.innerHTML = diagram;

    ref.current.appendChild(el);

    requestAnimationFrame(() => {
      mermaid.run({ nodes: [el] });
    });
  }, [diagram]);

  return (
    <div className="h-full rounded-xl bg-[#0b1220]/90 border border-white/10 shadow-2xl">
      <div className="px-4 py-2 border-b border-white/10 text-xs text-slate-400 flex justify-between">
        <span>Cloud Architecture Diagram</span>
        <span className="text-purple-400">Intelligent Diagram</span>
      </div>

      <div className="p-6 flex justify-center items-center" ref={ref} />
    </div>
  );
}
