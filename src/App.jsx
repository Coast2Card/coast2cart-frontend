import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Seafood from "./pages/Seafood";
import Souvenirs from "./pages/Souvenirs";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import BuyerProfile from "./pages/BuyerProfile";
import SellerProfile from "./pages/SellerProfile";
import Colors from "./pages/Colors";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import OtpVerify from "./pages/Auth/OtpVerify";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        {/* Routes with shared layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="seafood" element={<Seafood />} />
          <Route path="souvenirs" element={<Souvenirs />} />
          <Route path="about" element={<About />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/buyer" element={<BuyerProfile />} />
          <Route path="profile/seller" element={<SellerProfile />} />
          <Route path="colors" element={<Colors />} />
        </Route>
        {/* Auth routes without shared layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
      </Routes>
    </>
  );
}

export default App;
