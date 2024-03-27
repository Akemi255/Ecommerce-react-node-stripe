import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Home from "../pages/home";
import Contact from "../pages/contact";
import About from "../pages/about";
import Cart from "../pages/cart";
import CreateProduct from "../pages/create-product";
import EditProduct from "../pages/edit-product";
import { SelectedOptionProvider } from "../context/SelectedOptionContext";
import SearchResults from "../pages/search-results";
import Profile from "../pages/profile";
import Login from "../pages/login";
import ForgotPassword from "../pages/forgot-password";
import Register from "../pages/register";
import CleanCart from "../pages/clean-cart";
import NotFound from "../pages/not-found";

const AppRouter = () => {
  return (
    <Router>
      <SelectedOptionProvider>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/log-in" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/clean-cart/:productDetails" element={<CleanCart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <br />
        <Footer />
      </SelectedOptionProvider>
    </Router>
  );
};

export default AppRouter;
