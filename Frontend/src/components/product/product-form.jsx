import { Formik, Form, Field, ErrorMessage } from "formik";
import { TextField, Box, Checkbox, Input, Button } from "@mui/material";
import PropTypes from "prop-types";

const ProductForm = ({
  initialValues,
  validationSchema,
  handleSubmit,
  handleImageChange,
  previewImage,
  buttonText,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="create-product-form">
          <Box mb={2}>
            <Field as={TextField} name="nombre" label="Nombre" fullWidth />
            <ErrorMessage
              name="nombre"
              component="div"
              className="error-message"
            />
          </Box>
          <Box mb={2}>
            <Field as={TextField} name="precio" label="Precio" fullWidth />
            <ErrorMessage
              name="precio"
              component="div"
              className="error-message"
            />
          </Box>
          <Box mb={2}>
            <Field as={TextField} name="stock" label="Stock" fullWidth />
            <ErrorMessage
              name="stock"
              component="div"
              className="error-message"
            />
          </Box>
          <Box mb={2}>
            <Field
              as={TextField}
              name="descripcionCorta"
              multiline
              rows={4}
              label="Descripción Corta"
              fullWidth
            />
            <ErrorMessage
              name="descripcionCorta"
              component="div"
              className="error-message"
            />
          </Box>
          <Box mb={2}>
            <Field
              as={TextField}
              name="descripcionLarga"
              multiline
              rows={4}
              label="Descripción Larga"
              fullWidth
            />
            <ErrorMessage
              name="descripcionLarga"
              component="div"
              className="error-message"
            />
          </Box>
          <Box mb={2}>
            <Field
              as={TextField}
              name="categoria"
              label="Categoría"
              fullWidth
            />
            <ErrorMessage
              name="categoria"
              component="div"
              className="error-message"
            />
          </Box>
          <Box mb={2}>
            <Field as={TextField} name="marca" label="Marca" fullWidth />
            <ErrorMessage
              name="marca"
              component="div"
              className="error-message"
            />
          </Box>
          <Box mb={2}>
            <Input
              type="file"
              name="imagen"
              id="imagen"
              accept="image/*"
              onChange={handleImageChange}
            />
            <br />
            {previewImage && (
              <img
                src={previewImage}
                alt="Vista previa de la imagen"
                style={{
                  maxWidth: "400px",
                  marginTop: "10px",
                  maxHeight: "400px",
                }}
              />
            )}
            <ErrorMessage
              name="fotografia"
              component="div"
              className="error-message"
            />
          </Box>
          <Box mb={2}>
            <Field
              as={Checkbox}
              type="checkbox"
              name="productoImportado"
              label="Producto Importado"
            />
            <span>Producto Importado</span>
            <ErrorMessage
              name="productoImportado"
              component="div"
              className="error-message"
            />
          </Box>
          <Box mb={2}>
            <Field
              as={Checkbox}
              type="checkbox"
              name="productoNacional"
              label="Producto Nacional"
            />
            <span>productoNacional</span>
            <ErrorMessage
              name="productoNacional"
              component="div"
              className="error-message"
            />
          </Box>
          <Box mb={2}>
            <Field
              as={Checkbox}
              type="checkbox"
              name="envioSinCargo"
              label="Envío Sin Cargo"
            />
            <span>envioSinCargo</span>
            <ErrorMessage
              name="envioSinCargo"
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
            {buttonText}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

ProductForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  validationSchema: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleImageChange: PropTypes.func.isRequired,
  previewImage: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
};

export default ProductForm;
