import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { useSelectedOption } from "../context/SelectedOptionContext";
import "../styles/scss/create-product/create-product.scss";
import ProductForm from "../components/product/product-form";
import { dataURItoBlob } from "../helpers/dataURItoBlob";

const CreateProduct = () => {
  const { selectedOption, setSelectedOption } = useSelectedOption();
  const [previewImage, setPreviewImage] = useState(null);
  const [product] = useState({
    nombre: "",
    precio: "",
    stock: "",
    marca: "",
    categoria: "",
    descripcionCorta: "",
    descripcionLarga: "",
    productoImportado: false,
    productoNacional: false,
    envioSinCargo: false,
  });

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      if (
        selectedImage.type === "image/jpeg" ||
        selectedImage.type === "image/jpg" ||
        selectedImage.type === "image/png"
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(selectedImage);
      } else {
        e.target.value = null;
        setPreviewImage(null);
        toast.error(
          "Por favor seleccione una imagen en formato jpg, jpeg o png"
        );
      }
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (!previewImage) {
        toast.error("Por favor seleccione una imagen");
        return;
      }

      const formData = new FormData();
      formData.append("nombre", values.nombre);
      formData.append("precio", values.precio);
      formData.append("stock", values.stock);
      formData.append("marca", values.marca);
      formData.append("categoria", values.categoria);
      formData.append("descripcionCorta", values.descripcionCorta);
      formData.append("descripcionLarga", values.descripcionLarga);
      formData.append("productoImportado", values.productoImportado);
      formData.append("productoNacional", values.productoNacional);
      formData.append("envioSinCargo", values.envioSinCargo);

      if (previewImage) {
        const blobImage = dataURItoBlob(previewImage); // Convertir la imagen a Blob
        formData.append("imagen", blobImage);
      }

      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/products`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el producto");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    console.log(product);
  }, [product]);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .required("El nombre es obligatorio")
      .max(23, "El nombre debe tener máximo 23 caracteres"),
    precio: Yup.number()
      .typeError("El precio debe ser un número")
      .required("El precio es obligatorio")
      .positive("El precio debe ser un número positivo"),
    stock: Yup.number()
      .typeError("El stock debe ser un número")
      .required("El stock es obligatorio")
      .integer("El stock debe ser un número entero")
      .min(0, "El stock debe ser mayor o igual a 0"),
    marca: Yup.string()
      .required("La marca es obligatoria")
      .max(255, "La marca debe tener máximo 255 caracteres"),
    categoria: Yup.string()
      .required("La categoría es obligatoria")
      .max(25, "La categoría debe tener máximo 25 caracteres"),
    descripcionCorta: Yup.string()
      .required("La descripción corta es obligatoria")
      .max(40, "La descripción debe tener máximo 40 caracteres"),
    descripcionLarga: Yup.string()
      .required("La descripción larga es obligatoria")
      .max(500, "La descripción larga debe tener máximo 500 caracteres"),
    productoImportado: Yup.boolean().test(
      "productoImportadoNacional",
      "No puedes seleccionar ambos tipos de producto",
      function (value) {
        const productoNacional = this.parent.productoNacional;
        if (productoNacional && value) {
          return false;
        }
        return true;
      }
    ),
    productoNacional: Yup.boolean().test(
      "productoImportadoNacional",
      "No puedes seleccionar ambos tipos de producto",
      function (value) {
        const productoImportado = this.parent.productoImportado;
        if (productoImportado && value) {
          return false;
        }
        return true;
      }
    ),
    envioSinCargo: Yup.boolean().required("Este campo es obligatorio"),
  });

  return (
    <>
      <br />
      <Button
        to="/"
        className="go-back"
        component={Link}
        onClick={() => setSelectedOption("Inicio")}
        style={{
          backgroundColor: selectedOption === "Volver" ? "#e6e6e6" : "",
        }}
      >
        <ArrowBackIosIcon style={{ verticalAlign: "middle" }} />
        <span style={{ verticalAlign: "middle", marginLeft: "5px" }}>
          Volver
        </span>
      </Button>
      <div className="create-product-container">
        <h2>Crear Producto</h2>
        <ProductForm
          initialValues={product}
          handleSubmit={handleSubmit}
          handleImageChange={handleImageChange}
          previewImage={previewImage}
          validationSchema={validationSchema}
          buttonText="Crear Producto"
        />
      </div>
    </>
  );
};

export default CreateProduct;
