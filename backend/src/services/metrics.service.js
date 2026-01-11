exports.computeMetrics = (model, security) => {
  const totalResources = model.services.length;
  const riskCount = security.violations.length;

  return {
    totalResources,
    riskCount,
    securityScore: security.score,
    riskDensity: totalResources
      ? Math.round((riskCount / totalResources) * 100)
      : 0,
    complexity:
      totalResources < 5 ? "Low" :
      totalResources < 10 ? "Medium" : "High"
  };
};
