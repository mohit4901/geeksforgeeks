exports.simulateLoad = (services) => {
    let capacity = 100;
    let risk = "LOW";
  
    services.forEach(s => {
      if (s.type === "ec2" && !s.scalable) {
        capacity -= 40;
        risk = "HIGH";
      }
    });
  
    return {
      capacityScore: capacity,
      risk
    };
  };
  