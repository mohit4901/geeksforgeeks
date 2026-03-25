const COLORS = {
  CRITICAL: "#dc2626",
  HIGH: "#ea580c",
  MEDIUM: "#d97706",
  LOW: "#16a34a"
};

export default function SecurityPanel({ security = {} }) {
  const score = security?.score ?? 0;
  const violations = security?.violations ?? [];

  return (
    <div className="rounded-xl bg-[#0b1220]/90 border border-white/10 p-5 shadow-xl text-white">
      <h3 className="text-lg font-semibold mb-4">Security Posture</h3>

      <div className="mb-6">
        <div className="text-sm text-slate-400 mb-1">Security Score</div>
        <div className="text-3xl font-bold">{score}/100</div>

        <div className="mt-3 h-3 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${score}%`,
              background:
                score >= 80 ? "#16a34a" :
                score >= 60 ? "#d97706" :
                "#dc2626"
            }}
          />
        </div>
      </div>

      <h4 className="text-sm text-slate-300 mb-3">
        Findings ({violations.length})
      </h4>

      {violations.length === 0 && (
        <p className="text-emerald-400 text-sm">
          No security issues detected
        </p>
      )}

      <ul className="space-y-3">
        {violations.map((v) => (
          <li
            key={`${v.id}-${v.resource}`}
            className="rounded-lg border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-xs font-semibold tracking-wide"
                style={{ color: COLORS[v.severity] }}
              >
                {v.severity}
              </span>
              <span className="text-xs text-slate-500 uppercase">
                {v.resource}
              </span>
            </div>

            <p className="text-sm text-white">{v.description}</p>
            <p className="text-xs text-slate-400 mt-2">Fix: {v.fix}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}