const jwt = require("jsonwebtoken");
require("dotenv").config();

// Función para generar un token JWT
exports.generateToken = (userId, email, expiresIn = "30d") => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn });
};

// Función para verificar y decodificar un token JWT
exports.verifyToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken;
  } catch (error) {
    return null; // Retorna null si el token es inválido o ha expirado
  }
};
