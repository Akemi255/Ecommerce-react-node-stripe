import { useState } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import "../../styles/scss/product-card/product-card.scss";
import { useSelectedOption } from "../../context/SelectedOptionContext";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product, onDelete }) => {
  const { _id, fotografia, nombre, descripcionCorta, precio, stock, price_id } =
    product;
  const { setSelectedOption } = useSelectedOption();
  const { setCartNumber } = useCart();

  const formattedPrice = parseFloat(precio).toFixed(2);

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const initialQuantity = cart.find((item) => item.id === _id)?.quantity || 0;
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleIncrement = () => {
    if (quantity < stock) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      handleAddToCart(newQuantity);
      setCartNumber((prevNumber) => prevNumber + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setCartNumber((prevNumber) => prevNumber - 1);
      handleAddToCart(newQuantity);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/products/${_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Eliminar del carrito si está presente
        removeFromCart();
        onDelete(_id);
        toast.success("Producto eliminado correctamente");
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
    } catch (error) {
      toast.error("Error al eliminar el producto:", error);
    }
  };

  const removeFromCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = existingCart.filter((item) => item.id !== _id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartNumber((prevNumber) => prevNumber - quantity);
  };

  const handleAddToCart = (quantityToAdd) => {
    if (quantityToAdd === 0) {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = existingCart.filter((item) => item.id !== _id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const totalPrice = quantityToAdd * precio;
      const productData = {
        id: _id,
        name: nombre,
        description: descripcionCorta,
        price: precio,
        quantity: quantityToAdd,
        totalPrice,
        price_id: price_id,
        fotografia: fotografia,
      };
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = [
        ...existingCart.filter((item) => item.id !== _id),
        productData,
      ];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  return (
    <Card className="product-card">
      <div className="product-card-image-container">
        <img src={fotografia} alt={nombre} />
        <div className="button-container">
          <Button
            component={Link}
            to={`/edit-product/${_id}`}
            onClick={() => setSelectedOption("Volver")}
            className="edit-button"
          >
            <EditIcon />
          </Button>
          <Button className="delete-button" onClick={handleDelete}>
            <DeleteIcon />
          </Button>
        </div>
      </div>
      <CardContent className="product-card-content">
        <Typography variant="h6" className="product-card-title">
          {nombre}
        </Typography>
        <Typography variant="body2" className="product-card-description">
          {descripcionCorta}
        </Typography>
        <Typography variant="h6" className="product-card-price">
          ${formattedPrice}
        </Typography>
        <div className="quantity-controls">
          {stock == 0 ? (
            <div>
              <br />
              <Typography className="no-stock">
                SIN STOCK{" "}
                <SentimentDissatisfiedIcon className="DissatisfiedIcon" />
              </Typography>
            </div>
          ) : (
            <>
              <Button onClick={handleDecrement}>-</Button>
              <Typography>{quantity}</Typography>
              <Button onClick={handleIncrement}>+</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fotografia: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    descripcionCorta: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    price_id: PropTypes.string,
  }),
  onDelete: PropTypes.func.isRequired,
};

export default ProductCard;
