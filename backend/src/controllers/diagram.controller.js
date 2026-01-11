const { buildDiagram } = require("../services/diagram.service");

exports.generateDiagram = (req, res) => {
  const { model } = req.body;
  res.json({ diagram: buildDiagram(model) });
};
