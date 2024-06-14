const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const DB_URL = process.env.MONGO_URL;

const db = async () => {
  try {
    const result = await mongoose.connect(DB_URL);
    console.log("DB connected");
  } catch (error) {
    console.log("DB not connected , ", error);
  }
};
module.exports = db;