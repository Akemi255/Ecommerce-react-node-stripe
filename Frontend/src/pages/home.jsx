import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import CreateNewProduct from "../components/product/CreateNewProduct";
import ProductCard from "../components/product/ProductCard";
import Buscador from "../components/layout/Buscador";
import "../styles/scss/home/home.scss";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/products/`
        );
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          toast.error("Fallo al obtener los productos de la api");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = (id) => {
    const updatedProducts = products.filter((product) => product._id !== id);
    setProducts(updatedProducts);
  };

  return (
    <div className="home-container">
      <div className="search-container">
        <Buscador />
      </div>

      <CreateNewProduct />
      <br />

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onDelete={handleDeleteProduct}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
