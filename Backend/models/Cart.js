const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      cantidad: { type: Number, default: 1 },
    },
  ],
  total: { type: Number, default: 0 },
});

module.exports = mongoose.model("Cart", cartSchema);
