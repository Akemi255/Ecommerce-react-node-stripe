import PropTypes from "prop-types";

import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SelectedOptionContext = createContext();

export const SelectedOptionProvider = ({ children }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const location = useLocation();
  useEffect(() => {
    // Obtener la ruta actual
    const currentPath = location.pathname;

    // Establecer el valor inicial basado en la ruta
    if (currentPath === "/") {
      setSelectedOption("Inicio");
    }
    if (currentPath === "/contact") {
      setSelectedOption("Contacto");
    }
    if (currentPath === "/about") {
      setSelectedOption("Sobre Nosotros");
    }
    if (currentPath === "/create-product") {
      setSelectedOption("Volver");
    }
    if (currentPath === "/profile") {
      setSelectedOption("Perfil");
    }
  }, []);

  return (
    <SelectedOptionContext.Provider
      value={{ selectedOption, setSelectedOption }}
    >
      {children}
    </SelectedOptionContext.Provider>
  );
};

SelectedOptionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSelectedOption = () => useContext(SelectedOptionContext);
