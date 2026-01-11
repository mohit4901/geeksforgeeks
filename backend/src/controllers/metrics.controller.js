const { generateMetricsFromModel } = require("../services/metrics.service");

exports.generateMetrics = (req, res) => {
  const { model } = req.body;
  res.json(generateMetricsFromModel(model));
};
