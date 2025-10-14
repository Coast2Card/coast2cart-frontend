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
import AdminAccountManagement from "./pages/Admin/AdminAccountManagement";
import "./App.css";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import { ChatProvider } from "./contexts/ChatContext";

function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" />
      <ChatProvider>
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
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashbord />
              </ProtectedRoute>
            }
          />
          <Route
            path="sellers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <SellerAccountManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="buyers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <BuyerAccountManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="admins"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <AdminAccountManagement />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* Auth routes without shared layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </ChatProvider>
    </>
  );
}

export default App;
