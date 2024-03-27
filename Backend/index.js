const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();

// Middleware
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexion a base de datos
const dbURI = process.env.DATABASE_URL;
mongoose
  .connect(dbURI)
  .then(() => console.log("Base de datos conectada"))
  .catch((err) => console.log(err));

// Routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const contactRoutes = require("./routes/contactRoutes");

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/contact", contactRoutes);

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static("public"));

// Ruta para servir index.html en la ruta base '/'
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
