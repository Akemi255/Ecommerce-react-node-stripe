const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");

// Configura el almacenamiento de multer en la RAM
const storage = multer.memoryStorage();

// Crea el middleware de multer
const upload = multer({ storage: storage });

// Definición de las rutas
router.get("/", productController.getAllProducts);
router.get("/search/:nombre?", productController.searchProductsByName);
router.get("/:id", productController.getProductById);
router.post("/", upload.single("imagen"), productController.createProduct);
router.put("/:id", upload.single("imagen"), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
module.exports = router;
