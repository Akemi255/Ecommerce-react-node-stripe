const Product = require("../models/Product");
const Joi = require("joi");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Esquema de validación para la creación de un producto
const productSchema = Joi.object({
  nombre: Joi.string().required(),
  precio: Joi.number().required(),
  stock: Joi.number().required(),
  marca: Joi.string().required(),
  categoria: Joi.string().required(),
  descripcionCorta: Joi.string(),
  descripcionLarga: Joi.string(),
  productoImportado: Joi.boolean(),
  productoNacional: Joi.boolean(),
  envioSinCargo: Joi.boolean(),
});

// Esquema de validación para la actualización de un producto
const updateProductSchema = Joi.object({
  nombre: Joi.string(),
  precio: Joi.number(),
  stock: Joi.number(),
  marca: Joi.string(),
  categoria: Joi.string(),
  descripcionCorta: Joi.string(),
  descripcionLarga: Joi.string(),
  productoImportado: Joi.boolean(),
  productoNacional: Joi.boolean(),
  envioSinCargo: Joi.boolean(),
});

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.searchProductsByName = async (req, res) => {
  try {
    const nombre = req.params.nombre;

    let products;
    if (nombre) {
      products = await Product.find({ nombre: new RegExp(nombre, "i") });
    } else {
      products = await Product.find();
    }

    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    // Validar los datos de entrada
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Verifica si hay un archivo adjunto
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No se ha proporcionado ninguna imagen" });
    }

    // Convierte el buffer de la imagen a base64
    const imageBuffer = req.file.buffer.toString("base64");

    // Sube la imagen a Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${imageBuffer}`
    );

    // Crea un producto en Stripe
    const stripeProduct = await stripe.products.create({
      name: req.body.nombre,
      images: [result.secure_url],
    });

    // Crea un precio en Stripe basado en el product_id del producto creado
    const stripePrice = await stripe.prices.create({
      unit_amount: req.body.precio * 100, // El precio debe ser en centavos
      currency: "usd", // Moneda del precio (en este caso, dólares estadounidenses)
      product: stripeProduct.id, // Asocia el precio al product_id del producto creado en Stripe
    });

    // Guarda el product_id del producto en tu base de datos
    const newProduct = new Product({
      nombre: req.body.nombre,
      precio: req.body.precio,
      stock: req.body.stock,
      marca: req.body.marca,
      categoria: req.body.categoria,
      descripcionCorta: req.body.descripcionCorta,
      descripcionLarga: req.body.descripcionLarga,
      productoImportado: req.body.productoImportado,
      productoNacional: req.body.productoNacional,
      envioSinCargo: req.body.envioSinCargo,
      fotografia: result.secure_url,
      price_id: stripePrice.id,
      stripe_id: stripeProduct.id,
    });

    // Guarda el nuevo producto en la base de datos
    const savedProduct = await newProduct.save();

    // Guarda el precio en tu base de datos
    savedProduct.price = req.body.precio;
    await savedProduct.save();

    // Responde con el ID del producto y el precio creado
    return res.status(201).json({
      message: "Datos enviados con éxito",
      product_id: stripeProduct.id,
      price_id: stripePrice.id,
      price: req.body.precio,
    });
  } catch (err) {
    // Maneja los errores
    return res.status(400).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  const {
    nombre,
    precio,
    stock,
    marca,
    categoria,
    descripcionCorta,
    descripcionLarga,
    productoImportado,
    productoNacional,
    envioSinCargo,
  } = req.body;

  // Verifica si hay un archivo adjunto (imagen) en la solicitud
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "No se ha proporcionado ninguna imagen" });
  }

  try {
    // Validar los datos de entrada
    const { error } = updateProductSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Busca el producto por su ID
    let product = await Product.findById(productId);

    // Verifica si el producto existe
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Convierte el buffer de la imagen a base64
    const imageBuffer = req.file.buffer.toString("base64");

    // Sube la nueva imagen a Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${imageBuffer}`
    );

    // Actualiza los campos del producto con los valores proporcionados
    product.nombre = nombre || product.nombre;
    product.precio = precio || product.precio;
    product.stock = stock || product.stock;
    product.marca = marca || product.marca;
    product.categoria = categoria || product.categoria;
    product.descripcionCorta = descripcionCorta || product.descripcionCorta;
    product.descripcionLarga = descripcionLarga || product.descripcionLarga;
    product.productoImportado =
      productoImportado !== undefined
        ? productoImportado
        : product.productoImportado;
    product.productoNacional =
      productoNacional !== undefined
        ? productoNacional
        : product.productoNacional;
    product.envioSinCargo =
      envioSinCargo !== undefined ? envioSinCargo : product.envioSinCargo;

    // Actualiza la URL de la imagen del producto
    product.fotografia = result.secure_url;

    // Guarda los cambios en la base de datos
    const updatedProduct = await product.save();

    /// Obtener el precio del producto del cuerpo de la solicitud
    const PrecioStripe = parseFloat(req.body.precio);

    // Verificar si el precio es un número válido
    if (isNaN(PrecioStripe)) {
      return res
        .status(400)
        .json({ message: "El precio proporcionado no es válido" });
    }

    // Convertir el precio a centavos
    const unitAmountCents = Math.round(PrecioStripe * 100);

    // Verificar si el precio es al menos de 50 centavos
    if (unitAmountCents < 50) {
      // Si el precio es menor a 50 centavos, ajustarlo al mínimo requerido
      unitAmountCents = 50;
    }

    // Crear un nuevo precio con los valores actualizados
    const updatedPrice = await stripe.prices.create({
      unit_amount: unitAmountCents, // Define el nuevo precio en centavos
      currency: "usd", // Moneda del precio (en este caso, dólares estadounidenses)
      product: product.stripe_id, // Asocia el precio al ID del producto en Stripe
    });

    // Obtener el ID del precio existente
    const existingPriceId = product.price_id;

    // Desactivar el precio existente estableciendo su estado a inactivo
    await stripe.prices.update(existingPriceId, {
      active: false,
    });

    // Actualizar el campo price_id del producto con el nuevo price_id
    product.price_id = updatedPrice.id;

    // Guardar los cambios en la base de datos
    const updatedProductWithPriceId = await product.save();

    // Responde con el producto actualizado
    return res.status(200).json({
      message: "Producto actualizado exitosamente",
      product: updatedProduct,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.status(200).json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
