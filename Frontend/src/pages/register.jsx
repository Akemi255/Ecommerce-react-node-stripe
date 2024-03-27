import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Link,
} from "@mui/material";
import toast from "react-hot-toast";

import "../styles/scss/login/login.scss";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

const Register = () => {
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      window.location.href = "/";
    }
  }, [token]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es requerido"),
      email: Yup.string()
        .email("Correo electrónico no válido")
        .required("El correo electrónico es requerido"),
      password: Yup.string().required("La contraseña es requerida").min(6),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error("Error al registrar");
        }

        const data = await response.json();
        const { token } = data;
        localStorage.setItem("token", token);

        toast.success("Registro completado con éxito");

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } catch (error) {
        console.error("Error al registrar:", error.message);
        toast.error("Este correo electrónico ya está registrado");
      }
    },
  });

  return (
    <>
      <br />
      <Container>
        <Card>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Registro
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                label="Nombre"
                variant="outlined"
                fullWidth
                margin="normal"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <TextField
                label="Correo electrónico"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                label="Contraseña"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
              <Typography>
                ¿Ya tienes una cuenta?{" "}
                <Link to="/log-in" color="primary" component={NavLink}>
                  Inicia sesión
                </Link>
              </Typography>
              <Box mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Registrarse
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default Register;
