exports.simulateFailures = (model) => {
    const failures = [];
  
    model.services.forEach(service => {
      if (service.type === "ec2" && !service.scalable) {
        failures.push({
          service: "EC2",
          issue: "Traffic spike crash",
          impact: "HIGH",
          reason: "No autoscaling"
        });
      }
  
      if (service.type === "s3" && !service.encrypted) {
        failures.push({
          service: "S3",
          issue: "Data breach",
          impact: "CRITICAL",
          reason: "Encryption disabled"
        });
      }
  
      if (service.type === "ec2" && service.singleAZ) {
        failures.push({
          service: "EC2",
          issue: "AZ outage",
          impact: "HIGH",
          reason: "Single AZ deployment"
        });
      }
    });
  
    return {
      resilienceScore: Math.max(100 - failures.length * 20, 20),
      failures
    };
  };
  