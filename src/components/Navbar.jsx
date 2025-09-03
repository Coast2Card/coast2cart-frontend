import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { navLinks } from "../data/navigation";
import c2cLogo from "../assets/logos/c2c_transparent.png";
import searchIcon from "../assets/icons/search.png";
import cartIcon from "../assets/icons/cart.png";
import profileIcon from "../assets/icons/profile.png";
import commentIcon from "../assets/icons/comment.png";
const Navbar = () => {
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
    <nav className="bg-base-300 shadow-lg py-2 sticky top-0 z-50">
      <div className="mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img src={c2cLogo} alt="Coast2Cart" className="h-17" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-md font-bold transition-colors ${
                  isActive(link.path)
                    ? " text-accent after:content-[''] after:block after:w-full after:h-0.5 after:bg-accent after:rounded-full"
                    : "text-black hover:text-primary hover:bg-base-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Icons - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <img
              src={searchIcon}
              alt="Search"
              className="h-5 w-5 lg:h-5.5 lg:w-5.5 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
            />
            <img
              src={commentIcon}
              alt="Comment"
              className="h-5 w-5 lg:h-5.5 lg:w-5.5 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
            />
            <img
              src={cartIcon}
              alt="Cart"
              className="h-5 w-5 lg:h-5.5 lg:w-5.5 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
            />
            <img
              src={profileIcon}
              alt="Profile"
              className="h-5 w-5 lg:h-5.5 lg:w-5.5 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-base-content hover:text-primary hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-base-100 border-t border-base-300">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive(link.path)
                  ? "bg-primary text-primary-content"
                  : "text-base-content hover:text-primary hover:bg-base-200"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Icons */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-base-300 mt-4">
            <img
              src={searchIcon}
              alt="Search"
              className="h-6 w-6 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
            />
            <img
              src={commentIcon}
              alt="Comment"
              className="h-6 w-6 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
            />
            <img
              src={cartIcon}
              alt="Cart"
              className="h-6 w-6 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
            />
            <img
              src={profileIcon}
              alt="Profile"
              className="h-6 w-6 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
