export default function SecurityScoreRing({ score }) {
    const color =
      score >= 80 ? "text-emerald-400" :
      score >= 50 ? "text-yellow-400" :
      "text-red-400";
  
    return (
      <div className="
        flex items-center justify-between
        rounded-lg bg-black/30 border border-white/5 p-4
      ">
        <div>
          <div className="text-xs text-slate-400">
            Security Posture
          </div>
          <div className={`text-3xl font-bold ${color}`}>
            {score}%
          </div>
        </div>
  
        <div className="relative w-16 h-16">
          <svg className="w-full h-full rotate-[-90deg]">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#1e293b"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeDasharray={2 * Math.PI * 28}
              strokeDashoffset={
                2 * Math.PI * 28 * (1 - score / 100)
              }
              className={color}
            />
          </svg>
        </div>
      </div>
    );
  }
  