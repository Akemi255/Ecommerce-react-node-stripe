import { Button, TextField } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const ChangePassword = ({ email }) => {
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es requerida"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
      .required("Debes confirmar tu contraseña"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/users/changePassword`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              password: values.password,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Error al cambiar la contraseña");
        }

        toast.success(
          "Contraseña cambiada exitosamente, vuelva a iniciar sesión"
        );

        setTimeout(() => {
          window.location.href = "/log-in";
        }, 2000);
      } catch (error) {
        toast.error("Error al cambiar la contraseña");
        console.log(error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        type="password"
        label="Nueva Contraseña"
        fullWidth
        margin="normal"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        name="password"
      />
      <TextField
        type="password"
        label="Confirmar Contraseña"
        fullWidth
        margin="normal"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.confirmPassword &&
          Boolean(formik.errors.confirmPassword)
        }
        helperText={
          formik.touched.confirmPassword && formik.errors.confirmPassword
        }
        name="confirmPassword"
      />
      <Button type="submit" variant="contained" color="primary">
        Cambiar Contraseña
      </Button>
    </form>
  );
};

ChangePassword.propTypes = {
  email: PropTypes.string.isRequired,
};

export default ChangePassword;
