import SecurityScoreRing from "./charts/SecurityScoreRing";
import RiskBar from "./charts/RiskBar";

export default function MetricsPanel({ metrics }) {
  if (!metrics) return null;

  return (
    <div className="
      rounded-xl bg-[#0b1220]/90 w-full border border-white/10
      p-5 space-y-5 shadow-xl
    ">
      <h3 className="text-xs text-slate-400 tracking-widest uppercase">
        Infrastructure Health
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <Metric label="Resources" value={metrics.totalResources} />
        <Metric label="Security Score" value={metrics.securityScore} />
        <Metric label="Risk Density" value={`${metrics.riskDensity}%`} />
        <Metric label="Complexity" value={metrics.complexity} />
      </div>

      <div className="grid grid-cols-1 gap-4 pt-3">
        <SecurityScoreRing score={metrics.securityScore} />
        <RiskBar risk={metrics.riskDensity} />
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="
      rounded-lg bg-black/30 border border-white/5
      p-3
    ">
      <div className="text-[11px] text-slate-400 tracking-wide">
        {label}
      </div>
      <div className="text-xl text-white font-semibold">
        {value}
      </div>
    </div>
  );
}
