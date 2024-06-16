const express = require("express");
const db = require("./db/db");
const cors = require("cors");
const transaction = require("./routes/transaction");
const errorMiddleware = require("./middlewares/error");
const app = express();

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200 
}
app.use(cors(corsOptions));
app.use("/api/v1/", transaction);
app.get("/health", (req, res, next) => {
  res.json({ message: "server is healthy" });
  next();
});
app.use("/*", (req, res, next) => {
  res.status(404).json({ message: "page not found" });
  next();
});
app.use(errorMiddleware);
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
