import seafoodBanner from "../assets/images/fisher_man.png";
import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useGetItemsQuery, useAddToCartMutation } from "../services/api";
import CategoriesFilter from "../components/seafood/CategoriesFilter";
import PriceRangeFilter from "../components/seafood/PriceRangeFilter";
import SearchBar from "../components/seafood/SearchBar";
// local fallback image for items without image
import bisugo from "../assets/images/bisugo.png";
import CartConfirmationModal from "../components/productDetail/CartConfirmationModal";
import toast from "react-hot-toast";
// Footer comes from Layout; not needed here

const Seafood = () => {
  const [page, setPage] = useState(1);
  const [accumulatedItems, setAccumulatedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCartModal, setShowCartModal] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [modalSeller, setModalSeller] = useState({
    name: "",
    profileImage: "/src/assets/icons/profile.png",
  });
  const [addToCart] = useAddToCartMutation();
  const [addingId, setAddingId] = useState(null);

  // Get current user info
  const currentUser = (() => {
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const { data, isLoading, isFetching, isError } = useGetItemsQuery({
    page,
    itemType: "seafood",
    ...(selectedCategory && { category: selectedCategory }),
    ...(selectedPriceRanges.length > 0 && {
      // Pass as repeated query params: priceRange=100-199&priceRange=200-399
      priceRange: selectedPriceRanges,
    }),
  });
  const items = useMemo(() => {
    return data && Array.isArray(data.items) ? data.items : [];
  }, [data]);
  const pagination = data?.pagination ?? null;

  // Check if current user is the seller of an item
  const isCurrentUserSeller = (item) => {
    if (!currentUser || !item) return false;

    const currentUserId = currentUser._id || currentUser.id;
    const sellerId =
      item?.seller?._id ||
      item?.seller?.id ||
      item?.postedBy?._id ||
      item?.postedBy?.id ||
      item?.owner?._id ||
      item?.owner?.id;

    return currentUserId === sellerId;
  };

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return accumulatedItems;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return accumulatedItems.filter((item) => {
      const itemName = (item.itemName || item.name || "").toLowerCase();
      const description = (item.description || "").toLowerCase();

      return (
        itemName.includes(searchLower) || description.includes(searchLower)
      );
    });
  }, [accumulatedItems, searchTerm]);

  // Debug logging
  console.log("Seafood Debug:", {
    selectedCategory,
    selectedPriceRanges,
    searchTerm,
    page,
    data,
    items,
    isLoading,
    isError,
    accumulatedItems: accumulatedItems.length,
    filteredItems: filteredItems.length,
  });

  useEffect(() => {
    // Guard against unnecessary state updates that cause render loops
    setAccumulatedItems((prev) => {
      const normalizeId = (it) => it?.id || it?._id || it?.name;

      if (page === 1) {
        // If contents are effectively the same, do not update
        if (
          Array.isArray(items) &&
          prev.length === items.length &&
          prev.every((p, i) => normalizeId(p) === normalizeId(items[i]))
        ) {
          return prev;
        }
        return Array.isArray(items) ? items : [];
      }

      if (Array.isArray(items) && items.length > 0) {
        const existingIds = new Set(prev.map((p) => normalizeId(p)));
        const dedupedNew = items.filter(
          (it) => !existingIds.has(normalizeId(it))
        );
        if (dedupedNew.length === 0) return prev;
        return [...prev, ...dedupedNew];
      }
      return prev;
    });
  }, [items, page]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
    setAccumulatedItems([]);
  };

  const handlePriceRangeChange = (ranges) => {
    setSelectedPriceRanges(ranges);
    setPage(1);
    setAccumulatedItems([]);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const totalItems = searchTerm.trim()
    ? filteredItems.length
    : pagination?.totalItems ?? accumulatedItems.length;
  // const itemsPerPage = pagination?.itemsPerPage ?? (items.length || 0);
  const currentStart = filteredItems.length > 0 ? 1 : 0;
  const currentEnd = filteredItems.length;
  const hasMore = searchTerm.trim()
    ? false
    : pagination
    ? page < (pagination.totalPages || 1)
    : false;

  return (
    <>
      <main className="relative overflow-x-hidden">
        {/* Seafood Banner */}
        <section className="w-full relative overflow-hidden h-[420px] sm:h-[480px] md:h-[520px] lg:h-[480px] xl:h-[540px] max-h-[420px] sm:max-h-[500px] md:max-h-[560px] lg:max-h-[640px] xl:max-h-[720px]">
          <div className="absolute inset-0 bg-primary opacity-100 z-10"></div>

          {/* Content Container */}
          <div className="relative z-20 h-full">
            <div className="h-full max-w-8xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center py-4 sm:py-6 md:py-0">
              {/* Text Content - Full width on mobile, half on desktop */}
              <div className="w-full md:w-1/2 h-full flex items-center md:items-start justify-center md:justify-start">
                <div className="text-white pt-0 sm:pt-2 md:pt-8 lg:pt-5 xl:pt-8 text-center md:text-left max-w-full md:max-w-none">
                  <h1 className="font-outfit font-bold text-[35px] sm:text-[48px] md:text-[36px] lg:text-[48px] xl:text-[56px] leading-tight md:leading-[1.15] lg:leading-[1.05] tracking-[0%] mb-3 sm:mb-4 md:mb-6 lg:mb-8">
                    <div className="mb-1 sm:mb-2 md:mb-3">Discover the</div>
                    <div className="mb-1 sm:mb-2 md:mb-3">Finest Seafood</div>
                    <div>Selection</div>
                  </h1>
                  <p className="font-inter font-normal text-[15px] sm:text-[18px] md:text-[16px] lg:text-[18px] xl:text-[20px] leading-relaxed md:leading-[1.6] tracking-[0%] mb-4 sm:mb-5 md:mb-6 opacity-90 pb-8 sm:pb-12 md:pb-16 lg:pb-20 max-w-lg mx-auto md:mx-0">
                    From the shores of Barangay Baybayon to your table, our
                    fisherfolk bring in daily catches that are fresh, flavorful,
                    and carefully handled. Every purchase lets you enjoy the
                    best of the ocean while supporting our community's
                    livelihood.
                  </p>
                </div>
              </div>

              {/* Right Side - Image */}
              <div className="hidden md:flex w-1/2 h-full items-center justify-end">
                <img
                  src={seafoodBanner}
                  alt="Fresh Seafood"
                  className="w-auto object-contain -mr-8 md:-mr-12 lg:-mr-16 xl:-mr-24 md:h-[520px] lg:h-[600px] xl:h-[720px] transform md:translate-y-0 lg:translate-y-6 xl:translate-y-8"
                />
              </div>
            </div>
          </div>
        </section>

        {/* White Background Cover Section with Products */}
        <section className="relative z-30 bg-white py-16 -mt-20 md:-mt-36 lg:-mt-15">
          <div className="container mx-auto px-4 md:px-8  max-w-8xl">
            {/* Seafood Products Section */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar - Filters */}
              <div className="lg:w-1/4 space-y-8">
                <CategoriesFilter onCategoryChange={handleCategoryChange} />
                <PriceRangeFilter onPriceRangeChange={handlePriceRangeChange} />
              </div>

              {/* Right Side - Products */}
              <div className="lg:w-3/4">
                {/* Search and Info Bar */}
                <div className="bg-white p-6 mb-8">
                  <div className="flex flex-col gap-4">
                    <SearchBar onSearch={handleSearch} />
                    <div className="text-left">
                      <p className="font-inter font-bold text-gray-700 mb-1">
                        {isLoading || (isFetching && !accumulatedItems.length)
                          ? "Loading items…"
                          : searchTerm.trim()
                          ? `Found ${totalItems} item(s) matching "${searchTerm}"`
                          : `Showing ${currentStart}-${currentEnd} of ${totalItems} item(s)`}
                      </p>
                      <p className="font-inter text-sm text-gray-500">
                        Below is the list of our available fresh fish for
                        today's catch.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Grid */}
                {isLoading || (isFetching && !accumulatedItems.length) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg shadow-sm overflow-hidden"
                      >
                        <div className="h-48 bg-gray-100 animate-pulse" />
                        <div className="p-4 space-y-2">
                          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : isError ? (
                  <div className="py-12 text-center text-red-600">
                    Failed to load items.
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    {searchTerm.trim()
                      ? `No items found matching "${searchTerm}". Try a different search term.`
                      : "No items available."}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch">
                    {filteredItems.map((product) => (
                      <Link
                        key={product.id || product._id || product.name}
                        to={`/seafood/${product.id || product._id}`}
                        className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col"
                      >
                        <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                          <img
                            src={product.imageUrl || product.image || bisugo}
                            alt={product.itemName || product.name || "Item"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-outfit font-bold text-lg text-success">
                              {product.formattedPrice ??
                                product.priceDisplay ??
                                (product.itemPrice != null
                                  ? `₱${Number(
                                      product.itemPrice
                                    ).toLocaleString()}/${product.unit || ""}`
                                  : product.price != null
                                  ? `₱${Number(product.price).toLocaleString()}`
                                  : "")}
                            </span>
                          </div>
                          <h3 className="font-outfit font-bold text-lg text-gray-800 mb-2">
                            {product.itemName || product.name || "Unnamed Item"}
                          </h3>
                          {product.description && (
                            <p className="font-inter text-sm text-gray-600">
                              {product.description}
                            </p>
                          )}
                          <div className="mt-auto">
                            <button
                              disabled={
                                addingId === (product.id || product._id) ||
                                isCurrentUserSeller(product)
                              }
                              className={`w-full h-9 rounded-full font-semibold text-sm disabled:opacity-60 ${
                                isCurrentUserSeller(product)
                                  ? "bg-gray-400 cursor-not-allowed text-white"
                                  : "bg-[#E4490F] hover:bg-[#d0410d] text-white"
                              }`}
                              onClick={async (e) => {
                                e.preventDefault();
                                const token =
                                  localStorage.getItem("auth_token");
                                if (!token) {
                                  toast.error(
                                    "Please log in to add items to your cart"
                                  );
                                  window.location.href = "/login";
                                  return;
                                }
                                const itemId = product.id || product._id;
                                if (!itemId) return;
                                try {
                                  setAddingId(itemId);
                                  await addToCart({
                                    itemId,
                                    quantity: 1,
                                  }).unwrap();
                                  setModalProduct({
                                    id: product.id || product._id,
                                    name: product.itemName || product.name,
                                    description:
                                      product.description || "Fresh seafood",
                                    price:
                                      product.itemPrice ?? product.price ?? 0,
                                    formattedPrice:
                                      product.formattedPrice || null,
                                    image:
                                      product.imageUrl ||
                                      product.image ||
                                      bisugo,
                                  });
                                  setModalSeller({
                                    name: product?.seller?.username || "",
                                    profileImage:
                                      "/src/assets/icons/profile.png",
                                  });
                                  setShowCartModal(true);
                                } catch (err) {
                                  console.error(
                                    "[AddToCart:Seafood] Error:",
                                    err
                                  );
                                  toast.error(
                                    err?.data?.message ||
                                      "Failed to add to cart"
                                  );
                                } finally {
                                  setAddingId(null);
                                }
                              }}
                            >
                              {addingId === (product.id || product._id)
                                ? "Adding..."
                                : isCurrentUserSeller(product)
                                ? "Your Item"
                                : "Add to Cart"}
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Load More Section */}
                {hasMore && (
                  <div className="text-center">
                    <p className="font-inter font-medium text-gray-600 mb-4">
                      Showing {currentEnd} of {totalItems} item(s)
                    </p>
                    <button
                      disabled={isFetching}
                      onClick={() => setPage((p) => p + 1)}
                      className="bg-secondary text-primary font-outfit font-bold px-8 py-3 rounded-full hover:bg-secondary/90 transition-colors disabled:opacity-60"
                    >
                      {isFetching ? "LOADING…" : "LOAD MORE >"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer is rendered by Layout */}
      <CartConfirmationModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        product={modalProduct || {}}
        seller={modalSeller}
        quantity={1}
      />
    </>
  );
};

export default Seafood;
