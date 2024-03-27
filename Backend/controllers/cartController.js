const Cart = require("../models/Cart");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const { verifyToken } = require("../helpers/jwt");

exports.removeFromCart = async (req, res) => {
  try {
    // Obtener el token de usuario del encabezado de la solicitud
    const token = req.headers.authorization;

    // Verificar y decodificar el token para obtener el ID de usuario
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
    const userId = decodedToken.userId;

    // Obtener los productos y sus cantidades del cuerpo de la solicitud
    const products = req.body;

    // Buscar el carrito del usuario
    let cart = await Cart.findOne({ usuario: userId });

    if (!cart) {
      // Si el carrito no existe, crear uno nuevo
      cart = new Cart({ usuario: userId, productos: [] });
    }

    // Iterar sobre cada producto recibido
    for (const { productId, quantity } of products) {
      // Verificar si el producto existe
      const product = await Product.findById(productId);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Producto con ID ${productId} no encontrado` });
      }

      // Verificar si hay suficiente stock para realizar la operación
      if (product.stock < quantity) {
        return res.status(400).json({
          message: `La cantidad a eliminar del producto con ID ${productId} supera el stock disponible`,
        });
      }

      // Descontar la cantidad del producto del stock
      product.stock -= quantity;

      // Guardar el producto actualizado en la base de datos
      await product.save();

      // Buscar si el producto ya está en el carrito
      const existingProductIndex = cart.productos.findIndex(
        (item) => item.producto.toString() === productId
      );

      // Si el producto ya está en el carrito, actualizar la cantidad
      if (existingProductIndex !== -1) {
        cart.productos[existingProductIndex].cantidad += quantity;
      } else {
        // Si el producto no está en el carrito, agregarlo
        cart.productos.push({ producto: productId, cantidad: quantity });
      }
    }

    // Calcular el total sumando la cantidad de cada producto en el carrito
    const total = cart.productos.reduce((acc, curr) => acc + curr.cantidad, 0);
    cart.total = total;

    // Guardar los cambios en el carrito
    await cart.save();

    res.status(200).json({
      message:
        "Cantidad de productos descontada del stock y carrito actualizado exitosamente",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
