import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Seafood from "./pages/Seafood";
import Souvenirs from "./pages/Souvenirs";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import BuyerProfile from "./pages/BuyerProfile";
import SellerProfile from "./pages/SellerProfile";
import Colors from "./pages/Colors";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import OtpVerify from "./pages/Auth/OtpVerify";
import NotFound from "./pages/NotFound";
import SuperAdmin from "./pages/SuperAdmin";
import AdminLayout from "./components/AdminLayout";
import Dashbord from "./pages/Admin/Dashboard";
import BuyerAccountManagement from "./pages/Admin/BuyerAccountManagement";
import SellerAccountManagement from "./pages/Admin/SellerAccountManagement";
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
          <Route path="seafood/:itemId" element={<ProductDetail />} />
          <Route path="souvenirs" element={<Souvenirs />} />
          <Route path="about" element={<About />} />
          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile/buyer"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <BuyerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile/seller"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile/superadmin"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <SuperAdmin />
              </ProtectedRoute>
            }
          />
          <Route path="colors" element={<Colors />} />
        </Route>
        {/* Admin routes with AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashbord />} />
          <Route path="sellers" element={<SellerAccountManagement />} />
          <Route path="buyers" element={<BuyerAccountManagement />} />
        </Route>
        {/* Auth routes without shared layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
