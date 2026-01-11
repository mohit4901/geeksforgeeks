export default function RiskBar({ risk }) {
    const color =
      risk < 30 ? "bg-emerald-500" :
      risk < 60 ? "bg-yellow-400" :
      "bg-red-500";
  
    return (
      <div className="
        rounded-lg bg-black/30 border border-white/5 p-4
      ">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Risk Density</span>
          <span>{risk}%</span>
        </div>
  
        <div className="w-full h-2 bg-slate-800 rounded">
          <div
            className={`h-2 rounded ${color}`}
            style={{ width: `${risk}%` }}
          />
        </div>
      </div>
    );
  }
  