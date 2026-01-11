exports.simulateCost = (services) => {
    let baseCost = 20;
  
    services.forEach(s => {
      if (s.type === "ec2") baseCost += s.scalable ? 40 : 80;
      if (s.type === "s3") baseCost += 10;
      if (s.type === "vpc") baseCost += 15;
    });
  
    return {
      monthly: baseCost,
      projection: [
        baseCost,
        Math.round(baseCost * 1.3),
        Math.round(baseCost * 1.6)
      ]
    };
  };
  