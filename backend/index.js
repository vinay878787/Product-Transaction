const express = require("express");
const app = express();

app.get("/health", (req, res) => {
  res.json({ message: "server is healthy" });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";
app.listen(PORT, () => { 
  console.log(`server connected on http://${HOST}:${PORT}`);
});
