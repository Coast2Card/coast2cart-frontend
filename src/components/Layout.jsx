import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import FooterImage from "../assets/Footer.png";

const Layout = () => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Navigation Header */}
      <Navbar />


      <main className=" mx-auto  ">
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
