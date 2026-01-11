const { simulateFutureState } = require("../services/timeMachine.service");

exports.simulateFuture = (req, res) => {
  const { model, months } = req.body;
  res.json(simulateFutureState(model, months));
};
