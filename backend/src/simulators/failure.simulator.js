exports.simulateFailures = (services) => {
    const failures = [];
  
    services.forEach(s => {
      if (s.type === "ec2" && s.singleAZ) {
        failures.push("AZ outage can bring down compute");
      }
      if (s.type === "s3" && !s.encrypted) {
        failures.push("Data leak risk from unencrypted storage");
      }
    });
  
    return failures;
  };
  