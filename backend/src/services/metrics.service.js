export function calculateMetrics(model = {}, security = {}) {
  const services = model?.services || [];
  const violations = security?.violations || [];

  const totalResources = services.length;
  const riskCount = violations.length;

  return {
    totalResources,
    riskCount,
    securityScore: security?.score || 0,
    riskDensity: totalResources
      ? Math.round((riskCount / totalResources) * 100)
      : 0,
    complexity:
      totalResources < 5 ? "Low" :
      totalResources < 10 ? "Medium" : "High"
  };
}