import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartNumber, setCartNumber] = useState(() => {
    const storedCartNumber = localStorage.getItem('cartNumber');
    return storedCartNumber ? parseInt(storedCartNumber, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('cartNumber', cartNumber.toString());
  }, [cartNumber]);

  
  return (
    <CartContext.Provider value={{ cartNumber, setCartNumber }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => useContext(CartContext);
