const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendEmail = async (req, res) => {
  try {
    // Datos recibidos del formulario de contacto
    const { firstName, lastName, phone, email, query } = req.body;

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
      to: "gus1465@aol.com", //correo electrónico de la tienda
      subject: "Consulta de Contacto",
      html: `
        <h3>Detalles del Contacto:</h3>
        <p><strong>Nombre:</strong> ${firstName} ${lastName}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Correo Electrónico:</strong> ${email}</p>
        <p><strong>Consulta:</strong> ${query}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al enviar el correo", error: error.message });
  }
};
