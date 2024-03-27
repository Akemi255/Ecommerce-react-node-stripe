import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import toast from "react-hot-toast";
import ProductCard from "../components/product/ProductCard";

const SearchResults = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const { q } = queryString.parse(location.search);
    setSearchTerm(q || "");
    fetchSearchResults(q);
  }, [location.search]);

  const fetchSearchResults = async (searchTerm) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/products/search/${searchTerm}`
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      } else {
        toast.error("Error al obtener los resultados de la búsqueda");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProduct = (id) => {
    const updatedProducts = products.filter((product) => product._id !== id);
    setProducts(updatedProducts);
  };

  return (
    <div>
      <h2>Resultados de búsqueda para: {searchTerm}</h2>
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

export default SearchResults;
