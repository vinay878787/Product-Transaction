const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String },
  price: { type: String },
  description: { type: String },
  category: { type: String },
  image: { type: String},
  sold: { type: Boolean},
  dateOfSale: { type: Date}
});

const Product =  mongoose.model("Product", productSchema);
module.exports = Product;
