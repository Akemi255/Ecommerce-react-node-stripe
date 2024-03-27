const mongoose = require("mongoose");

// Modelo Product
const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
  marca: String,
  categoria: String,
  descripcionCorta: String,
  descripcionLarga: String,
  productoImportado: { type: Boolean, default: false },
  productoNacional: { type: Boolean, default: false },
  envioSinCargo: { type: Boolean, default: false },
  fotografia: String,
  price_id: String,
  stripe_id: String,
});

module.exports = mongoose.model("Product", productSchema);
