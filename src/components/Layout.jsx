import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navigation Header */}
      <nav className="bg-base-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary font-display">
                  Coast2Cart
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-primary text-primary-content"
                    : "text-base-content hover:text-primary hover:bg-base-200"
                }`}
              >
                Home
              </Link>
              <Link
                to="/seafood"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/seafood")
                    ? "bg-primary text-primary-content"
                    : "text-base-content hover:text-primary hover:bg-base-200"
                }`}
              >
                Seafood
              </Link>
              <Link
                to="/souvenirs"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/souvenirs")
                    ? "bg-primary text-primary-content"
                    : "text-base-content hover:text-primary hover:bg-base-200"
                }`}
              >
                Souvenirs
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/about")
                    ? "bg-primary text-primary-content"
                    : "text-base-content hover:text-primary hover:bg-base-200"
                }`}
              >
                About
              </Link>
              <Link
                to="/cart"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/cart")
                    ? "bg-primary text-primary-content"
                    : "text-base-content hover:text-primary hover:bg-base-200"
                }`}
              >
                Cart
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/profile")
                    ? "bg-primary text-primary-content"
                    : "text-base-content hover:text-primary hover:bg-base-200"
                }`}
              >
                Profile
              </Link>
              <Link
                to="/colors"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/colors")
                    ? "bg-primary text-primary-content"
                    : "text-base-content hover:text-primary hover:bg-base-200"
                }`}
              >
                Colors
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-base-content hover:text-primary hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger icon */}
                <svg
                  className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-base-100 border-t border-base-300">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive("/")
                  ? "bg-primary text-primary-content"
                  : "text-base-content hover:text-primary hover:bg-base-200"
              }`}
            >
              Home
            </Link>
            <Link
              to="/seafood"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive("/seafood")
                  ? "bg-primary text-primary-content"
                  : "text-base-content hover:text-primary hover:bg-base-200"
              }`}
            >
              Seafood
            </Link>
            <Link
              to="/souvenirs"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive("/souvenirs")
                  ? "bg-primary text-primary-content"
                  : "text-base-content hover:text-primary hover:bg-base-200"
              }`}
            >
              Souvenirs
            </Link>
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive("/about")
                  ? "bg-primary text-primary-content"
                  : "text-base-content hover:text-primary hover:bg-base-200"
              }`}
            >
              About
            </Link>
            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive("/cart")
                  ? "bg-primary text-primary-content"
                  : "text-base-content hover:text-primary hover:bg-base-200"
              }`}
            >
              Cart
            </Link>
            <Link
              to="/profile"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive("/profile")
                  ? "bg-primary text-primary-content"
                  : "text-base-content hover:text-primary hover:bg-base-200"
              }`}
            >
              Profile
            </Link>
            <Link
              to="/colors"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive("/colors")
                  ? "bg-primary text-primary-content"
                  : "text-base-content hover:text-primary hover:bg-base-200"
              }`}
            >
              Colors
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
