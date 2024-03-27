import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import PersonIcon from "@mui/icons-material/Person";

import "../../styles/scss/header/header.scss";
import { useSelectedOption } from "../../context/SelectedOptionContext";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const { selectedOption, setSelectedOption } = useSelectedOption();
  const { cartNumber } = useCart();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="header-container">
      <div className="header-content">
        <nav>
          <ul className="header-nav">
            <Button
              component={Link}
              to="/"
              onClick={() => setSelectedOption("Inicio")}
              style={{
                backgroundColor: selectedOption === "Inicio" ? "#e6e6e6" : "",
              }}
            >
              {isMobile ? (
                <HomeIcon className="icon" />
              ) : (
                <>
                  <HomeIcon className="icon" />
                  Inicio
                </>
              )}
            </Button>
            <Button
              component={Link}
              to="/about"
              onClick={() => setSelectedOption("Sobre Nosotros")}
              style={{
                backgroundColor:
                  selectedOption === "Sobre Nosotros" ? "#e6e6e6" : "",
              }}
            >
              {isMobile ? (
                <InfoIcon className="icon" />
              ) : (
                <>
                  <InfoIcon className="icon" />
                  Nosotros
                </>
              )}
            </Button>
            <Button
              component={Link}
              to="/contact"
              onClick={() => setSelectedOption("Contacto")}
              style={{
                backgroundColor: selectedOption === "Contacto" ? "#e6e6e6" : "",
              }}
            >
              {isMobile ? (
                <PermContactCalendarIcon className="icon" />
              ) : (
                <>
                  <PermContactCalendarIcon className="icon" />
                  Contacto
                </>
              )}
            </Button>
            <Button
              component={Link}
              to="/profile"
              onClick={() => setSelectedOption("Perfil")}
              style={{
                backgroundColor: selectedOption === "Perfil" ? "#e6e6e6" : "",
              }}
            >
              {isMobile ? (
                <PersonIcon className="icon" />
              ) : (
                <>
                  <PersonIcon className="icon" />
                  Perfil
                </>
              )}
            </Button>
          </ul>
        </nav>
        <Link
          className="logo-container"
          onClick={() => setSelectedOption("Inicio")}
          to="/"
        >
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: "175px", height: "65px" }}
          />
        </Link>
        <Badge
          badgeContent={cartNumber}
          color="secondary"
          component={Link}
          to="/cart"
        >
          <ShoppingCartIcon
            sx={{ fontSize: 32 }}
            onClick={() => setSelectedOption(null)}
          />
        </Badge>
      </div>
    </header>
  );
};

export default Header;
