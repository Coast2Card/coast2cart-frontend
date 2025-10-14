import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetCartSummaryQuery, useGetItemsQuery } from "../services/api";
import { UserCircle, SignOut } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import { navLinks } from "../data/navigation";
import c2cLogo from "../assets/logos/c2c_transparent.png";
import searchIcon from "../assets/icons/search.png";
import cartIcon from "../assets/icons/cart.png";
import profileIcon from "../assets/icons/profile.png";
import commentIcon from "../assets/icons/comment.png";
import ChatPopup from "./ChatPopup";
import { useChatContext } from "../contexts/ChatContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { isChatOpen, openChat, closeChat } = useChatContext();

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
    if (isChatOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  const roleToProfilePath = (role) => {
    if (role === "seller") return "/profile/seller";
    if (role === "buyer") return "/profile/buyer";
    if (role === "superadmin") return "/profile/superadmin";
    return "/profile";
  };
  const profilePath = roleToProfilePath(currentUser?.role);
  const { data: cartSummary } = useGetCartSummaryQuery(undefined, {
    skip: !isLoggedIn,
  });

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setIsProfileMenuOpen(false);
    navigate("/");
    toast.success("Logged out");
  };

  // Live search for fish and souvenirs
  const enableSearch = searchQuery.trim().length >= 2;
  const fishSearch = useGetItemsQuery(
    { itemType: "fish", search: searchQuery, page: 1 },
    { skip: !enableSearch }
  );
  const souvenirsSearch = useGetItemsQuery(
    { itemType: "souvenirs", search: searchQuery, page: 1 },
    { skip: !enableSearch }
  );
  const fishResults = fishSearch?.data?.items || [];
  const souvenirResults = souvenirsSearch?.data?.items || [];
  const hasAnyResults = fishResults.length + souvenirResults.length > 0;

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isSearchOpen) return;
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

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
          <div className="hidden md:flex items-center gap-4 lg:gap-6 relative">
            <div ref={searchRef} className="relative flex items-center gap-2">
              <img
                src={searchIcon}
                alt="Search"
                onClick={() => setIsSearchOpen((v) => !v)}
                className="h-5 w-5 lg:h-5.5 lg:w-5.5 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
              />
              {isSearchOpen && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50 w-[360px]">
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }
                    }}
                    onBlur={() => {
                      // collapse back to icon when not active and empty
                      if (!searchQuery) setIsSearchOpen(false);
                    }}
                    placeholder="Search fish or souvenirs..."
                    className="w-full h-8 px-3 rounded-full border border-base-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {enableSearch && hasAnyResults && (
                    <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-lg border border-base-200 shadow-lg">
                      <div className="max-h-80 overflow-auto py-2">
                        {fishResults.length > 0 && (
                          <div className="py-1">
                            <div className="px-4 pb-1 text-xs font-semibold text-gray-500">
                              Fish
                            </div>
                            <ul className="divide-y divide-base-200">
                              {fishResults.slice(0, 5).map((it) => (
                                <li key={it._id || it.id}>
                                  <button
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-base-100 text-left"
                                    onClick={() => {
                                      setIsSearchOpen(false);
                                      setSearchQuery("");
                                      navigate(`/seafood/${it._id || it.id}`);
                                    }}
                                  >
                                    <img
                                      src={it.image || it.imageUrl}
                                      alt="thumb"
                                      className="w-10 h-10 rounded object-cover bg-gray-100"
                                    />
                                    <div className="flex-1">
                                      <div className="text-sm font-semibold">
                                        {it.itemName || it.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {it.formattedPrice || ""}
                                      </div>
                                    </div>
                                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                      Fish
                                    </span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {souvenirResults.length > 0 && (
                          <div className="py-1">
                            <div className="px-4 pb-1 text-xs font-semibold text-gray-500">
                              Souvenirs
                            </div>
                            <ul className="divide-y divide-base-200">
                              {souvenirResults.slice(0, 5).map((it) => (
                                <li key={it._id || it.id}>
                                  <button
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-base-100 text-left"
                                    onClick={() => {
                                      setIsSearchOpen(false);
                                      setSearchQuery("");
                                      navigate(`/seafood/${it._id || it.id}`);
                                    }}
                                  >
                                    <img
                                      src={it.image || it.imageUrl}
                                      alt="thumb"
                                      className="w-10 h-10 rounded object-cover bg-gray-100"
                                    />
                                    <div className="flex-1">
                                      <div className="text-sm font-semibold">
                                        {it.itemName || it.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {it.formattedPrice || ""}
                                      </div>
                                    </div>
                                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                      Souvenir
                                    </span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <img
              src={commentIcon}
              alt="Comment"
              onClick={toggleChat}
              className="h-5 w-5 lg:h-5.5 lg:w-5.5 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
            />
            <Link to="/cart" className="relative">
              <img
                src={cartIcon}
                alt="Cart"
                className="h-5 w-5 lg:h-5.5 lg:w-5.5 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
              />
              {cartSummary?.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] leading-none px-1.5 py-1 rounded-full">
                  {cartSummary.itemCount}
                </span>
              )}
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
                  {(() => {
                    const fn = (currentUser?.firstName || "").trim();
                    const ln = (currentUser?.lastName || "").trim();
                    const composed = [fn, ln].filter(Boolean).join(" ");
                    return (
                      composed ||
                      currentUser?.fullName ||
                      currentUser?.name ||
                      currentUser?.username
                    );
                  })() && (
                    <span className="text-sm font-semibold text-black hidden lg:inline">
                      {(() => {
                        const fn = (currentUser?.firstName || "").trim();
                        const ln = (currentUser?.lastName || "").trim();
                        const composed = [fn, ln].filter(Boolean).join(" ");
                        return (
                          composed ||
                          currentUser?.fullName ||
                          currentUser?.name ||
                          currentUser?.username
                        );
                      })()}
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
      <ChatPopup />
    </nav>
  );
};

export default Navbar;
