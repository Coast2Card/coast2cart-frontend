import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import FooterImage from "../assets/Footer.png";

const Layout = () => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
        <Outlet />
      </main>

      {/* Footer Image - Fixed at bottom */}
      <div className="w-full">
        <img 
          src={FooterImage} 
          alt="Footer" 
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default Layout;
