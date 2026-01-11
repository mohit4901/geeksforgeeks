const app = require("./app");

const PORT = process.env.PORT || 4000;

app.use("/api/re-evaluate", require("./routes/reevaluate.routes"));

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
