import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box } from "@mui/material";
import toast from "react-hot-toast";

import "../styles/scss/contact/contact.scss";

// Esquema de validación utilizando Yup
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("Este dato es obligatorio"),
  lastName: Yup.string().required("Este dato es obligatorio"),
  phone: Yup.string()
    .matches(/\d{10}/, "Ingresa un teléfono válido. Ej: 02644241020")
    .required("Este dato es obligatorio"),
  email: Yup.string()
    .email("Ingresa un email válido. Ej. ser@gmail.com")
    .required("Este dato es obligatorio"),
  query: Yup.string().required("Este dato es obligatorio"),
});

const Contact = () => {
  const initialValues = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    query: "",
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/contact/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        toast.success("Datos enviados correctamente");
        resetForm();
      } else {
        toast.error("Error al enviar los datos");
      }
    } catch (error) {
      toast.error("Error al enviar los datos");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <br />
      <div className="contact-container">
        <h2>Contacto</h2>
        <div className="contact-info">
          <p>Datos de Contacto:</p>
          <p>Correo: fashioncommerce@correo.com</p>
          <p>Dirección: Calle 101, Esquina 115</p>
        </div>
        <div className="map-container">
          <iframe
            title="Google Maps"
            width="100%"
            height="300"
            frameBorder="0"
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.678901234567!2d-0.000000!3d0.000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDIyJzM5LjAiTiAwN8KwNTQnMTYuMCJF!5e0!3m2!1sen!2suk!4v1234567890123`}
            allowFullScreen
          ></iframe>
        </div>
        <br />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="contact-form">
              <Box mb={2}>
                <Field
                  as={TextField}
                  name="firstName"
                  label="Nombre"
                  fullWidth
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="error-message"
                />
              </Box>
              <Box mb={2}>
                <Field
                  as={TextField}
                  name="lastName"
                  label="Apellido"
                  fullWidth
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="error-message"
                />
              </Box>
              <Box mb={2}>
                <Field as={TextField} name="phone" label="Teléfono" fullWidth />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="error-message"
                />
              </Box>
              <Box mb={2}>
                <Field
                  as={TextField}
                  name="email"
                  type="email"
                  label="Correo Electrónico"
                  fullWidth
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </Box>
              <Box mb={2}>
                <Field
                  as={TextField}
                  name="query"
                  multiline
                  rows={4}
                  label="Consulta"
                  fullWidth
                />
                <ErrorMessage
                  name="query"
                  component="div"
                  className="error-message"
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                Enviar
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Contact;
