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
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

const Login = () => {
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      window.location.href = "/";
    }
  }, [token]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Correo electrónico no válido")
        .required("El correo electrónico es requerido"),
      password: Yup.string().required("La contraseña es requerida"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error("El email o la contraseña son incorrectos");
        }

        const data = await response.json();
        const { token } = data;

        localStorage.setItem("token", token);

        toast.success("Sesión iniciada con éxito");

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } catch (error) {
        toast.error(error.message);
        console.error("Error al iniciar sesión:", error.message);
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
              Iniciar Sesión
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                label="Email"
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
              <br />
              <Typography>
                ¿Aún no tienes una cuenta?{" "}
                <Link to="/register" color="primary" component={NavLink}>
                  Regístrese
                </Link>
              </Typography>
              <br />
              <Link to="/forgot-password" color="primary" component={NavLink}>
                Olvidé mi contraseña
              </Link>
              <Box mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Iniciar Sesión
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default Login;
