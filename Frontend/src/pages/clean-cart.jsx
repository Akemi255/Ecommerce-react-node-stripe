import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@mui/material";
import Alert from "@mui/material/Alert";

const CleanCart = () => {
  const { productDetails } = useParams();
  const { token } = useAuth();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const products = productDetails.split("&");
      const requestData = [];

      // Iterar sobre cada producto y extraer ID del producto y cantidad
      products.forEach((product) => {
        const productParts = product.split("=");
        const productId = productParts[0];
        const quantity = productParts[1];

        requestData.push({ productId, quantity });
      });

      try {
        // Enviar la petición DELETE al controlador con los datos en el cuerpo
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/cart/remove-from-cart`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify(requestData),
          }
        );

        const data = await response.json();
        console.log(data);
        setPaymentSuccess(true);

        emptyCart();

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } catch (error) {
        console.error("Error al eliminar productos:", error);
      }
    };

    fetchData();
  }, [productDetails, token]);

  // Vaciar el carrito
  const emptyCart = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("cartNumber");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {paymentSuccess ? (
        <div style={{ textAlign: "center" }}>
          <Alert severity="success">
            Pago efectuado con éxito, volviendo al inicio
          </Alert>
          <Button component={Link} to="/">
            Volver a inicio
          </Button>
        </div>
      ) : (
        <h1>Procesando pago...</h1>
      )}
    </div>
  );
};

export default CleanCart;
