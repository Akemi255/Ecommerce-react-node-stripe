import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import toast from "react-hot-toast";

import ChangePassword from "../components/auth/changePassword";

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState();
  const [receivedVerificationCode, setReceivedVerificationCode] = useState();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const inputRefs = useRef([]);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Correo electrónico no válido")
        .required("El correo electrónico es requerido"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/forgotPassword`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error("Error al enviar la solicitud");
        }

        const data = await response.json();

        setVerificationCode(data.verificationCode);
        setEmailSent(true);
        toast.success(
          "Correo electrónico enviado correctamente para restablecer la contraseña"
        );
      } catch (error) {
        console.error("Error al enviar la solicitud:", error.message);
        toast.error("Ha ocurrido un error al enviar la solicitud");
      }
    },
  });

  // Función para manejar las teclas de retroceso (borrar) y suprimir
  const handleKeyDown = (index, event) => {
    const inputValue = event.target.value;
    if (event.key === "Backspace" || event.key === "Delete") {
      if (index > 0 && inputValue === "") {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  // Función para mover el foco al siguiente campo de entrada
  const handleKeyPress = (index, event) => {
    const inputValue = event.target.value;
    if (!isNaN(inputValue) && inputValue !== "" && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Función para manejar el cambio de código de verificación
  const handleVerificationCodeChange = (index, event) => {
    const newInputValue = event.target.value;
    const newReceivedCode = receivedVerificationCode
      ? receivedVerificationCode
      : "";
    const updatedReceivedCode =
      newReceivedCode.slice(0, index) +
      newInputValue +
      newReceivedCode.slice(index + 1);
    setReceivedVerificationCode(updatedReceivedCode);
  };

  // Manejar la verificación del código recibido
  useEffect(() => {
    if (receivedVerificationCode && receivedVerificationCode.length === 5) {
      if (parseInt(receivedVerificationCode) === verificationCode) {
        toast.success("Código de verificación correcto");
        setShowChangePassword(true);
      } else {
        console.log("Código de verificación incorrecto");
      }
    }
  }, [receivedVerificationCode, verificationCode]);
  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom>
          Restablecer Contraseña
        </Typography>
        {!emailSent ? (
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Correo Electrónico"
              variant="outlined"
              margin="normal"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Enviar Solicitud
            </Button>
          </form>
        ) : (
          <>
            {showChangePassword ? (
              <ChangePassword email={formik.values.email} />
            ) : (
              <>
                <Typography variant="h6" align="center" gutterBottom>
                  Ingresa el código de 5 dígitos recibido en tu correo
                  electrónico
                </Typography>
                <Box display="flex" justifyContent="center" mt={3}>
                  {[...Array(5)].map((_, index) => (
                    <TextField
                      key={index}
                      variant="outlined"
                      margin="normal"
                      size="small"
                      style={{ margin: "0 5px", width: 60 }}
                      onChange={(event) =>
                        handleVerificationCodeChange(index, event)
                      }
                      inputRef={(el) => (inputRefs.current[index] = el)}
                      onInput={(event) => {
                        const inputValue = event.target.value;
                        event.target.value = inputValue.replace(/\D/, "");
                        handleKeyPress(index, event);
                      }}
                      onKeyDown={(event) => handleKeyDown(index, event)}
                      inputProps={{ maxLength: 1 }}
                    />
                  ))}
                </Box>
              </>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default ForgotPassword;
