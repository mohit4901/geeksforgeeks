export default function ValidationPipeline({ model, security, metrics }) {
    const layers = [
      {
        name: "Syntax Validation",
        status: model?.syntax?.valid ? "pass" : "fail",
        description: model?.syntax?.valid
          ? "Terraform syntax and structure validated successfully"
          : "Invalid Terraform syntax detected"
      },
      {
        name: "Canonical Modeling",
        status: model?.services?.length ? "pass" : "fail",
        description: `${model?.services?.length || 0} infrastructure components identified`
      },
      {
        name: "Security Policy Validation",
        status: security?.violations?.length === 0 ? "pass" : "warn",
        description:
          security?.violations?.length === 0
            ? "No security violations detected"
            : `${security?.violations.length} security risks found`
      },
      {
        name: "System Metrics Evaluation",
        status: "pass",
        description: `Risk density ${metrics?.riskDensity}% • Complexity ${metrics?.complexity}`
      }
    ];
  
    return (
      <div className="rounded-xl bg-[#0b1220]/90 border border-white/10 p-5 space-y-4">
        <h3 className="text-xs text-slate-400 tracking-widest uppercase">
          Validation Pipeline
        </h3>
  
        <div className="space-y-3">
          {layers.map((layer, i) => (
            <ValidationRow key={i} {...layer} index={i} />
          ))}
        </div>
      </div>
    );
  }
  
  function ValidationRow({ name, status, description, index }) {
    const color =
      status === "pass"
        ? "text-emerald-400"
        : status === "warn"
        ? "text-yellow-400"
        : "text-red-400";
  
    return (
      <div className="flex items-start gap-4">
        <div className={`mt-1 text-sm font-mono ${color}`}>
          {index + 1}.
        </div>
  
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">{name}</span>
            <span className={`text-xs font-semibold ${color}`}>
              {status.toUpperCase()}
            </span>
          </div>
  
          <p className="text-xs text-slate-400 mt-1">
            {description}
          </p>
        </div>
      </div>
    );
  }
  