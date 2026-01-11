exports.simulateFutureState = (model, months) => {
    return {
      months,
      costIncrease: months * 20,
      risk: "MEDIUM"
    };
  };
  