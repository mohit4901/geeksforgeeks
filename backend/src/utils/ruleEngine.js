exports.evaluateRule = (service, rule) => {
    try {
      return eval(`service.${rule.condition}`);
    } catch {
      return false;
    }
  };
  