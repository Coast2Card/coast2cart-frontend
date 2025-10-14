import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useGetSouvenirsQuery, useAddToCartMutation } from "../services/api";
import CartConfirmationModal from "../components/productDetail/CartConfirmationModal";
import toast from "react-hot-toast";
import FishImage from "../assets/souvenir-items/fish.png";
import bisugo from "../assets/images/bisugo.png";

const Souvenirs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch souvenirs from API
  const { data, isLoading, isError } = useGetSouvenirsQuery({
    // Add any additional params here if needed
  });
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [showCartModal, setShowCartModal] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);

  const allSouvenirs = data?.items || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter and sort souvenirs
  const filteredAndSortedSouvenirs = allSouvenirs
    .filter((souvenir) => {
      const name = souvenir.itemName || souvenir.name || "";
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const nameA = a.itemName || a.name || "";
      const nameB = b.itemName || b.name || "";
      const priceA = parseFloat(a.itemPrice || a.price || 0);
      const priceB = parseFloat(b.itemPrice || b.price || 0);

      switch (sortBy) {
        case "name":
          return nameA.localeCompare(nameB);
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        default:
          return 0;
      }
    });

  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "price-low", label: "Price (Low to High)" },
    { value: "price-high", label: "Price (High to Low)" },
  ];

  return (
    <div className="max-w-8xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 mb-16 w-full mx-auto mt-16">
        {/* Left side - Text content */}
        <div className="lg:w-1/2 text-left">
          <h1
            className="text-5xl font-bold mb-6 font-display"
            style={{ color: "#FF6F47" }}
          >
            Souvenirs
          </h1>
          <p className="text-lg text-black font-primary leading-relaxed">
            Take home a piece of Barangay Baybayon with our locally made
            souvenirs. From handcrafted items and sea-inspired trinkets to
            products made by our fisherfolk and their families, each souvenir
            carries the story of our coastal community. Every purchase supports
            local livelihoods and keeps the spirit of Baybayon alive wherever
            you go.
          </p>
        </div>

        {/* Right side - Fish image */}
        <div className="flex-shrink-0 lg:w-1/2 flex justify-center">
          <img
            src={FishImage}
            alt="Decorative fish lantern"
            className="w-full h-auto max-w-sm"
          />
        </div>
      </div>

      <div className="w-full mx-auto flex flex-col gap-8">
        {/* Sorting and Search Section */}
        <div className="bg-white rounded-md p-6 [box-shadow:0_0_6px_rgba(0,0,0,0.25)] ">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Left side - Product count and sort */}
            <div className="flex items-center gap-4">
              <span className="text-black font-primary">
                {filteredAndSortedSouvenirs.length} Products
              </span>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-primary flex items-center gap-2 hover:bg-yellow-500 transition-colors"
                >
                  Sort by
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showSortDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors font-primary ${
                          sortBy === option.value
                            ? "bg-yellow-50 text-yellow-700"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Search bar */}
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search...."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors"
                  style={{ backgroundColor: "#102F76" }}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Souvenir Grid, Loading, Error, or No Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="block bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2 font-display">
                Failed to load souvenirs
              </h3>
              <p className="text-gray-500 font-primary">
                We couldn't load the souvenirs. Please try again later.
              </p>
            </div>
          </div>
        ) : filteredAndSortedSouvenirs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {filteredAndSortedSouvenirs.map((souvenir) => (
              <div
                key={souvenir.id || souvenir._id || souvenir.name}
                className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link to={`/seafood/${souvenir.id || souvenir._id}`}>
                  <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={souvenir.imageUrl || souvenir.image || bisugo}
                      alt={souvenir.itemName || souvenir.name || "Souvenir"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-outfit font-bold text-lg text-success">
                      {souvenir.priceDisplay ??
                        (souvenir.itemPrice != null
                          ? `₱${Number(souvenir.itemPrice).toLocaleString()}`
                          : souvenir.price != null
                          ? `₱${Number(souvenir.price).toLocaleString()}`
                          : "")}
                    </span>
                  </div>
                  <h3 className="font-outfit font-bold text-lg text-gray-800">
                    {souvenir.itemName || souvenir.name || "Unnamed Souvenir"}
                  </h3>
                  {souvenir.description && (
                    <p className="font-inter text-sm text-gray-600 mt-1">
                      {souvenir.description}
                    </p>
                  )}
                  <div className="mt-3">
                    <button
                      disabled={isAdding}
                      onClick={async () => {
                        const token = localStorage.getItem("auth_token");
                        if (!token) {
                          toast.error(
                            "Please log in to add items to your cart"
                          );
                          window.location.href = "/login";
                          return;
                        }
                        const itemId = souvenir.id || souvenir._id;
                        if (!itemId) return;
                        try {
                          console.log("[AddToCart:Souvenirs] Submitting:", {
                            itemId,
                            quantity: 1,
                          });
                          const res = await addToCart({
                            itemId,
                            quantity: 1,
                          }).unwrap();
                          console.log("[AddToCart:Souvenirs] Success:", res);
                          setModalProduct({
                            name: souvenir.itemName || souvenir.name,
                            description:
                              souvenir.description || "Local souvenir",
                            price: souvenir.itemPrice ?? souvenir.price ?? 0,
                            image:
                              souvenir.imageUrl || souvenir.image || bisugo,
                          });
                          setShowCartModal(true);
                        } catch (e) {
                          console.error("[AddToCart:Souvenirs] Error:", e);
                          toast.error(
                            e?.data?.message || "Failed to add to cart"
                          );
                        }
                      }}
                      className="w-full h-10 rounded-full bg-[#E4490F] hover:bg-[#d0410d] text-white font-semibold text-sm"
                    >
                      {isAdding ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2 font-display">
                No items found
              </h3>
              <p className="text-gray-500 font-primary">
                We couldn't find any souvenirs matching "{searchTerm}". Try
                searching for something else or browse all our products.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-primary"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}
      </div>
      <CartConfirmationModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        product={modalProduct || {}}
        seller={{ name: "", profileImage: "/src/assets/icons/profile.png" }}
        quantity={1}
      />
    </div>
  );
};

export default Souvenirs;
