import { Link } from "react-router-dom";
import { useState } from "react";

import { Button, Card, CardContent, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

import "../styles/scss/cart/cart.scss";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { loadStripe } from "@stripe/stripe-js";

const Cart = () => {
  const carts = JSON.parse(localStorage.getItem("cart")) || [];
  const { cartNumber, setCartNumber } = useCart();
  const [totalPrice, setTotalPrice] = useState(0);
  const { token } = useAuth();

  const onDelete = (id, quantity, price) => {
    const updatedCart = carts.filter((item) => item.id !== id);
    setCartNumber(cartNumber - quantity);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setTotalPrice(totalPrice - price * quantity);
  };

  // Calcular el precio total sumando el precio por cantidad de cada producto en el carrito
  const calculateTotalPrice = () => {
    let total = 0;
    carts.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  // Calcular el precio total al renderizar el componente
  useState(() => {
    const total = calculateTotalPrice();
    setTotalPrice(total);
  }, []);

  const handleCheckout = async () => {
    try {
      if (!token) {
        toast.error("Debes iniciar sesión");
        setTimeout(() => {
          window.location.href = "/log-in";
        }, 1000);
        return;
      }

      const stripe = await loadStripe(
        import.meta.env.VITE_APP_STRIPE_SECRET_KEY
      );

      // Obtener los productos del carrito desde el almacenamiento local
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

      const productDetails = cartItems
        .map((item) => `${item.id}=${item.quantity}`)
        .join("&");

      const lineItems = cartItems.map((item) => ({
        price: item.price_id, // Utiliza el price_id único de cada producto
        quantity: item.quantity,
      }));

      stripe.redirectToCheckout({
        lineItems: lineItems,
        mode: "payment",
        successUrl: `https://ecommerce-react-node-frontend.vercel.app/clean-cart/${productDetails}`,
        cancelUrl: "https://ecommerce-react-node-frontend.vercel.app/",
      });
    } catch (error) {
      toast.error("Error al realizar la compra");
      console.error(error);
    }
  };

  // Vaciar el carrito
  const emptyCart = () => {
    localStorage.removeItem("cart");
    setCartNumber(0);
    setTotalPrice(0);
    toast.success("Carrito vaciado con éxito");
  };

  return (
    <div className="cart-container">
      <Typography variant="h4" className="cart-title">
        Carrito de Compras
      </Typography>
      <br />
      {carts.map((cartItem) => (
        <Card key={cartItem.id} className="cart-item">
          <CardContent>
            <div className="cart-item-content">
              <div>
                <Typography variant="h6" className="cart-item-title">
                  {cartItem.name}
                </Typography>
                <img
                  src={cartItem.fotografia}
                  alt="Imagen del producto"
                  className="product-image"
                />
              </div>
              <Button
                onClick={() =>
                  onDelete(cartItem.id, cartItem.quantity, cartItem.price)
                }
                className="cart-item-price"
              >
                <DeleteIcon className="delete-icon" />
              </Button>
            </div>
            <Typography variant="h6">Cantidad: {cartItem.quantity}</Typography>
            <Typography variant="h6" className="cart-item-price">
              Precio ${cartItem.price}
            </Typography>
            <Typography variant="h6" className="cart-item-price">
              Importe ${cartItem.price * cartItem.quantity}
            </Typography>
          </CardContent>
        </Card>
      ))}
      {carts.length === 0 && (
        <Typography variant="body1" className="no-products">
          No hay productos en el carrito &nbsp;{" "}
          <SentimentVeryDissatisfiedIcon className="no-products-icon" />
        </Typography>
      )}
      <br />
      {carts.length > 0 && (
        <div>
          <Typography variant="h6" className="total-price">
            Total: ${totalPrice}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className="checkout-button"
            onClick={handleCheckout}
          >
            Continuar con la compra
          </Button>
        </div>
      )}
      <br />
      <div className="cart-buttons">
        <Button
          variant="contained"
          color="primary"
          className="continue-shopping-button continue-shopping-link"
          component={Link}
          to="/"
        >
          {carts.length > 0 ? "Seguir comprando" : "Volver a inicio"}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={emptyCart}
          className="empty-cart-button"
        >
          Vaciar carrito
        </Button>
      </div>
    </div>
  );
};

export default Cart;
