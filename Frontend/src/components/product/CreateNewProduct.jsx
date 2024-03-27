import { Button } from "@mui/material";
import { Link } from "react-router-dom";

import { useSelectedOption } from "../../context/SelectedOptionContext";

const CreateNewProduct = () => {

  const { setSelectedOption } = useSelectedOption();

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    fontSize: "1.2rem",
    backgroundColor: "#f8f9fa",
    color: "#333",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    hover: "#e6e6e6",
  };

  const handleButtonClick = () => {
    setSelectedOption("Volver");
  };

  return (
    <div style={containerStyle}>
    <Button
      component={Link}
      to="/create-product"
      style={buttonStyle}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#e6e6e6")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
      onClick={handleButtonClick} 
    >
      Crear nuevo producto
    </Button>
  </div>
  );
};

export default CreateNewProduct;
