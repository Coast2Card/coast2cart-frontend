import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserCircle, SignOut } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { useState } from "react";
import { navLinks } from "../data/navigation";
import c2cLogo from "../assets/logos/c2c_transparent.png";
import searchIcon from "../assets/icons/search.png";
import cartIcon from "../assets/icons/cart.png";
import profileIcon from "../assets/icons/profile.png";
import commentIcon from "../assets/icons/comment.png";
import ChatPopup from "./ChatPopup";
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const isLoggedIn = Boolean(localStorage.getItem("auth_token"));
  const currentUser = (() => {
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const roleToProfilePath = (role) => {
    if (role === "seller") return "/profile/seller";
    if (role === "buyer") return "/profile/buyer";
    if (role === "superadmin") return "/profile/superadmin";
    return "/profile";
  };
  const profilePath = roleToProfilePath(currentUser?.role);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setIsProfileMenuOpen(false);
    navigate("/");
    toast.success("Logged out");
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
              onClick={toggleChat}
              className="h-5 w-5 lg:h-5.5 lg:w-5.5 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
            />
            <Link to="/cart">
              <img
                src={cartIcon}
                alt="Cart"
                className="h-5 w-5 lg:h-5.5 lg:w-5.5 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
              />
            </Link>
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen((v) => !v)}
                  className="flex items-center gap-2"
                >
                  <img
                    src={profileIcon}
                    alt="Profile"
                    className="h-5 w-5 lg:h-5.5 lg:w-5.5 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
                  />
                  {currentUser?.username && (
                    <span className="text-sm font-semibold text-black hidden lg:inline">
                      {currentUser.username}
                    </span>
                  )}
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-base-300 rounded-xl shadow-lg py-2">
                    <button
                      className="w-full flex items-center gap-1 px-4 py-2 text-sm font-medium text-black hover:bg-base-200 cursor-pointer"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate(profilePath);
                      }}
                    >
                      <UserCircle className="h-6 w-6" weight="regular" />
                      View profile
                    </button>
                    <div className="my-1 h-px bg-base-300" />
                    <button
                      className="w-full flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <SignOut className="h-5 w-5" weight="regular" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Log in
              </Link>
            )}
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
              onClick={toggleChat}
              className="h-6 w-6 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
            />
            <Link to="/cart" onClick={closeMobileMenu}>
              <img
                src={cartIcon}
                alt="Cart"
                className="h-6 w-6 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
              />
            </Link>
            {isLoggedIn ? (
              <Link to="/profile/buyer" onClick={closeMobileMenu}>
                <img
                  src={profileIcon}
                  alt="Profile"
                  className="h-6 w-6 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
                />
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Chat Popup */}
      <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </nav>
  );
};

export default Navbar;
