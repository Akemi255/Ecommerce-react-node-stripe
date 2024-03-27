const bcrypt = require("bcryptjs");
const generateToken = require("../helpers/jwt").generateToken;
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Esquema de validación para el registro de usuarios
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Esquema de validación para el inicio de sesión
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Esquema de validación para el cambio de contraseña
const ChangePasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Controlador para registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    // Validar los datos de entrada
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password } = req.body;

    // Verificar si el usuario ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está registrado" });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Generar token JWT
    const token = generateToken(newUser);

    // Respuesta con el token
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar token JWT
    const token = generateToken(user);

    // Respuesta con el token
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // Obtener el token del encabezado de la solicitud
    const token = req.headers.authorization;

    // Decodificar el token para obtener la información del usuario
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Envía la respuesta con los datos del usuario
    res.status(200).json({ user: decodedToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    // Obtener el ID de usuario del token en el encabezado de autorización
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Buscar el usuario por ID y eliminarlo
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Cuenta eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendResetPasswordEmail = async (email, verificationCode) => {
  try {
    // Configuración del transporter para enviar el correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Contenido del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Restablecimiento de Contraseña",
      html: `
        <p>Hola,</p>
        <p>Recibiste este correo electrónico porque solicitaste un restablecimiento de contraseña para tu cuenta. Utiliza el siguiente código de 5 dígitos para restablecer tu contraseña:</p>
        <h1>${verificationCode}</h1>
        <p>Si no solicitaste un restablecimiento de contraseña, ignora este correo electrónico.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error.message);
    throw new Error(
      "Error al enviar el correo electrónico de restablecimiento de contraseña"
    );
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const verificationCode = Math.floor(10000 + Math.random() * 90000);

    await sendResetPasswordEmail(email, verificationCode);

    res.status(200).json({
      message:
        "Correo electrónico enviado correctamente para restablecer la contraseña",
      verificationCode: verificationCode,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    // Validar los datos de entrada
    const { error } = ChangePasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar la contraseña del usuario
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    // Generar token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Respuesta con el token
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar la contraseña" });
  }
};
