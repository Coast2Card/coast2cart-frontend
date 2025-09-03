import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content */}
      <main className=" mx-auto  ">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-base-100 border-t border-base-300 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base-content/70 text-sm">
            © 2024 Coast2Cart. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
