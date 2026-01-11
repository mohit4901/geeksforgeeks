const { infraPersonaReply } = require("../services/persona.service");

exports.chatWithInfra = async (req, res) => {
  const { model, message } = req.body;
  res.json({ reply: await infraPersonaReply(model, message) });
};
