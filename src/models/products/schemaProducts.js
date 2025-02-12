const mongoose = require("mongoose");
const db = require("../db");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    sku: String,
    description: String,
    unit: String,
    price: String,
    category: String,
    brand: String,
    stock: Number,
    image: String,
    active: Boolean,
    model: String,
  },
  { timestamps: true }
); // Define the schema correctly

const modelProduct = mongoose.model("produtos", productSchema);
module.exports = modelProduct;
// Compare this snippet from src/models/products/schemaProducts.js:
