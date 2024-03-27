const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// Ruta para enviar correo desde el formulario de contacto
router.post("/send-email", contactController.sendEmail);

module.exports = router;
