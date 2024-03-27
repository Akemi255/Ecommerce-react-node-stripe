import { Toaster } from "react-hot-toast";
import PropTypes from "prop-types";

import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

const Providers = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <div>
          {children}
          <Toaster position="bottom-center" reverseOrder={false} />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

Providers.propTypes = {
  children: PropTypes.node.isRequired,
};
export default Providers;
