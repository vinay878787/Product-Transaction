const express = require("express");
const db = require("./db/db");
const app = express();

app.get("/health", (req, res) => {
  res.json({ message: "server is healthy" });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server connected on http://${HOST}:${PORT}`);
    });
  })
  .catch((e) => {
    console.log("database not connected :", e);
  });
