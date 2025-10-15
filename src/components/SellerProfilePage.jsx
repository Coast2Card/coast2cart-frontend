import React, { useState } from "react";
import {
  useGetSellerItemsQuery,
  useGetSellerReviewsQuery,
  useGetSellerInfoQuery,
  useGetSellerSoldItemsQuery,
} from "../services/api";
import {
  MapPin,
  Phone,
  Envelope,
  Calendar,
  MagnifyingGlass,
  Star,
  CheckCircle,
} from "@phosphor-icons/react";
import c2cLogo from "../assets/logos/c2c_white_transparent.png";
import bisugotImg from "../assets/images/bisugo.png";
// images kept for possible fallbacks above
import fisherManImg from "../assets/images/fisher_man.png";
// import baybayanFanImg from "../assets/images/baybayon_fan.jpg";
import customer1 from "../assets/images/home_test1.png";
import AddItemModal from "../modals/AddItemModal";

const SellerProfilePage = ({ sellerId }) => {
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const currentUser = (() => {
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  const currentUsername = currentUser?.username || "";

  // Determine sellerId from props or localStorage set at login
  const resolveSellerId = () => {
    if (sellerId) return sellerId;
    // Common JSON blobs: auth_user, user, account
    const jsonKeys = ["auth_user", "user", "account"];
    for (const key of jsonKeys) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const obj = JSON.parse(raw);
        const maybeId = obj?.id || obj?._id || obj?.user?.id || obj?.user?._id;
        if (maybeId) return maybeId;
      } catch {
        void 0; // intentionally ignore parse errors
      }
    }
    // Plain string IDs sometimes stored
    const strKeys = ["seller_id", "user_id", "account_id"];
    for (const key of strKeys) {
      const val = localStorage.getItem(key);
      if (val) return val;
    }
    // Decode JWT if present (auth_token) → payload.userId
    try {
      const token = localStorage.getItem("auth_token");
      if (token && token.split(".").length === 3) {
        const base64 = token
          .split(".")[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/");
        const json = JSON.parse(atob(base64));
        if (json?.userId) return json.userId;
      }
    } catch {
      void 0; // ignore malformed JWT
    }
    return undefined;
  };
  const resolvedSellerId = resolveSellerId();

  // Fetch seller items
  const { data: sellerItemsData, isFetching: isLoadingSellerItems } =
    useGetSellerItemsQuery(resolvedSellerId, {
      skip: !resolvedSellerId,
    });

  // Fetch seller profile info
  const { data: sellerInfo, isLoading: isLoadingSellerInfo } =
    useGetSellerInfoQuery(resolvedSellerId, {
      skip: !resolvedSellerId,
    });

  // Mock data - Backend team can replace with API calls using sellerId
  const sellerData = {
    id: sellerId || 1,
    name: sellerInfo?.name || "",
    profileImage: sellerInfo?.image || fisherManImg,
    isVerified: true,
    location: sellerInfo?.location || "",
    phone: sellerInfo?.phoneNumber || "",
    email: sellerInfo?.email || "",
    memberSince: sellerInfo?.createdAt
      ? new Date(sellerInfo.createdAt).getFullYear().toString()
      : "",
    totalProducts: 15,
    totalSold: 8,
    averageRating: 4.8,
    totalReviews: 23,
  };

  // Map API items to card data
  const apiActiveListings = (sellerItemsData?.items || []).map((it) => ({
    id: it?._id || it?.id,
    name: it?.itemName || it?.name || "",
    price:
      it?.formattedPrice ||
      (it?.itemPrice != null
        ? `₱${Number(it.itemPrice).toLocaleString()}/${it.unit || ""}`
        : it?.price != null
        ? `₱${Number(it.price).toLocaleString()}`
        : ""),
    image: it?.image || it?.imageUrl || bisugotImg,
    availability:
      it?.formattedQuantity ||
      (it?.quantity != null
        ? `${it.quantity} ${it.unit || "units"} available`
        : ""),
    category: it?.category || it?.itemType || "fresh_catch",
  }));

  // Helper function to format dates to PHT
  const formatToPHT = (isoString) => {
    if (!isoString) return "";
    try {
      const dtf = new Intl.DateTimeFormat("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Manila",
      });
      return dtf.format(new Date(isoString));
    } catch {
      return (isoString || "").slice(0, 10);
    }
  };

  // Fallback to mock listings if no sellerId or no items
  const activeListings = apiActiveListings.length > 0 ? apiActiveListings : [];

  // Seller sold items from API
  const { data: sellerSoldData } = useGetSellerSoldItemsQuery(
    resolvedSellerId,
    { skip: !resolvedSellerId }
  );
  const apiSoldItems = (sellerSoldData?.items || []).map((it) => {
    const item = it?.itemId && typeof it.itemId === "object" ? it.itemId : {};
    const name = item?.itemName || item?.name || it?.name || "";
    const image = item?.image || item?.imageUrl || it?.image || "";
    const category = item?.itemType || it?.category || "";
    const quantity =
      it?.quantity != null && it?.unit
        ? `${it.quantity} ${it.unit}`
        : item?.formattedQuantity || it?.quantity || "";
    const soldDateIso = it?.markedSoldAt || it?.updatedAt || it?.soldDate;
    const priceLabel =
      item?.formattedPrice ||
      (it?.totalPrice != null
        ? `₱${Number(it.totalPrice).toLocaleString()}`
        : "");
    const summary =
      it?.summary ||
      (quantity && priceLabel ? `${quantity} - ${priceLabel}` : "");
    return {
      id: it?.id || it?._id,
      name,
      image,
      category,
      quantity,
      soldDate: soldDateIso ? formatToPHT(soldDateIso) : "",
      priceLabel,
      summary,
    };
  });

  // Seller reviews from API
  const { data: sellerReviewsData } = useGetSellerReviewsQuery(
    resolvedSellerId,
    {
      skip: !resolvedSellerId,
    }
  );
  const reviews = (sellerReviewsData?.reviews || []).map((r) => ({
    id: r?.id,
    customerName: r?.reviewerName || "Anonymous",
    rating: r?.rating != null ? Number(r.rating) : 0,
    comment: r?.text || "",
    date: formatToPHT(r?.raw?.createdAt),
    avatar: customer1,
  }));

  // Filter functions for backend integration
  const getFilteredProducts = (products) => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  // Seller Profile Header Component
  const SellerProfileHeader = () => (
    <div className="bg-gradient-to-r from-[#0058BA] via-[#002854] via-30% to-[#002854] text-white rounded-2xl p-8 md:p-12 mb-6 relative overflow-hidden shadow-lg">
      {/* Coast2Cart Logo - Top Right */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8">
        <img
          src={c2cLogo}
          alt="Coast2Cart"
          className="h-14 md:h-16 w-auto opacity-95"
        />
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Left Side - Avatar */}
        <div className="flex-shrink-0">
          {isLoadingSellerInfo ? (
            <div className="w-40 h-40 md:w-48 md:h-48 bg-white/60 rounded-full animate-pulse" />
          ) : (
            <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src={sellerData.profileImage}
                alt={sellerData.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Right Side - Seller Info */}
        <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            {isLoadingSellerInfo ? (
              <div className="h-10 md:h-12 w-56 bg-white/60 rounded animate-pulse" />
            ) : (
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {sellerData.name}
              </h1>
            )}
            {!isLoadingSellerInfo && (
              <CheckCircle size={32} weight="fill" className="text-white" />
            )}
          </div>

          <div className="mb-6 text-center md:text-left">
            {isLoadingSellerInfo ? (
              <div className="h-4 w-40 bg-white/50 rounded animate-pulse" />
            ) : (
              <span className="text-sm md:text-base font-normal text-white/90">
                {currentUsername}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <MapPin size={22} weight="fill" className="text-white" />
              {isLoadingSellerInfo ? (
                <span className="h-5 w-56 bg-white/40 rounded animate-pulse" />
              ) : (
                <span className="text-lg md:text-xl font-normal">
                  {sellerData.location}
                </span>
              )}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Phone size={22} weight="fill" className="text-white" />
              {isLoadingSellerInfo ? (
                <span className="h-5 w-40 bg-white/40 rounded animate-pulse" />
              ) : (
                <span className="text-lg md:text-xl font-normal">
                  {sellerData.phone}
                </span>
              )}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Envelope size={22} weight="fill" className="text-white" />
              {isLoadingSellerInfo ? (
                <span className="h-5 w-48 bg-white/40 rounded animate-pulse" />
              ) : (
                <span className="text-lg md:text-xl font-normal">
                  {sellerData.email}
                </span>
              )}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Calendar size={22} weight="fill" className="text-white" />
              {isLoadingSellerInfo ? (
                <span className="h-5 w-56 bg-white/40 rounded animate-pulse" />
              ) : (
                <span className="text-lg md:text-xl font-normal">
                  Seller Since {sellerData.memberSince}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Tab Navigation Component
  const TabNavigation = () => (
    <div className="flex flex-wrap justify-center md:justify-between items-center gap-3 mb-6">
      <div className="hidden md:block"></div>
      <button
        onClick={() => setActiveTab("active")}
        className={`px-6 py-3 rounded-full font-medium font-primary transition-all duration-200 hover:scale-105 active:scale-95 ${
          activeTab === "active"
            ? "bg-accent text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            : "bg-white text-gray-600 hover:bg-blue-50 border border-gray-200 hover:border-primary/30 hover:text-primary hover:shadow-md"
        }`}
      >
        Active Listing
      </button>
      <button
        onClick={() => setActiveTab("sold")}
        className={`px-6 py-3 rounded-full font-medium font-primary transition-all duration-200 hover:scale-105 active:scale-95 ${
          activeTab === "sold"
            ? "bg-accent text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            : "bg-white text-gray-600 hover:bg-blue-50 border border-gray-200 hover:border-primary/30 hover:text-primary hover:shadow-md"
        }`}
      >
        Sold Items
      </button>
      <button
        onClick={() => setActiveTab("reviews")}
        className={`px-6 py-3 rounded-full font-medium font-primary transition-all duration-200 hover:scale-105 active:scale-95 ${
          activeTab === "reviews"
            ? "bg-accent text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            : "bg-white text-gray-600 hover:bg-blue-50 border border-gray-200 hover:border-primary/30 hover:text-primary hover:shadow-md"
        }`}
      >
        Reviews
      </button>
      <button
        className="px-6 py-3 rounded-full font-medium font-primary bg-primary text-white shadow-md hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 md:ml-auto"
        onClick={() => setIsAddOpen(true)}
      >
        Add Item
      </button>
    </div>
  );

  // Filter Controls Component
  const FilterControls = () => (
    <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="text-lg font-semibold text-gray-700 mb-2">
            {sellerData.totalProducts} Products
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-outline btn-sm font-primary hover:scale-105 hover:border-primary/50 hover:bg-blue-50 transition-all duration-200 active:scale-95"
            >
              {selectedCategory === "all"
                ? "All Categories"
                : selectedCategory === "fresh_catch"
                ? "Fresh Catch"
                : selectedCategory === "dried_seafood"
                ? "Dried Seafood"
                : "Souvenirs"}
              <svg
                className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-xl w-52 border border-gray-100 animate-fade-scale-in"
            >
              <li>
                <a
                  onClick={() => setSelectedCategory("all")}
                  className="font-primary hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  All Categories
                </a>
              </li>
              <li>
                <a
                  onClick={() => setSelectedCategory("fresh_catch")}
                  className="font-primary hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  Fresh Catch
                </a>
              </li>
              <li>
                <a
                  onClick={() => setSelectedCategory("dried_seafood")}
                  className="font-primary hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  Dried Seafood
                </a>
              </li>
              <li>
                <a
                  onClick={() => setSelectedCategory("souvenirs")}
                  className="font-primary hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  Souvenirs
                </a>
              </li>
            </ul>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                e.stopPropagation();
                setSearchTerm(e.target.value);
              }}
              onFocus={(e) => e.stopPropagation()}
              onBlur={(e) => e.stopPropagation()}
              className="input input-bordered input-sm pl-10 pr-10 w-full sm:w-64 font-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              autoComplete="off"
              spellCheck="false"
            />
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            {searchTerm && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchTerm("");
                }}
                onMouseDown={(e) => e.preventDefault()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                title="Clear search"
                type="button"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Product Card Component
  const ProductCard = ({ product, isSold = false }) => (
    <div
      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group border border-gray-100 hover:border-primary/30 active:scale-95"
      onClick={() => console.log("Product clicked:", product.name)}
    >
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!isSold && (
          <div className="absolute top-2 right-2 bg-success text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
            Available
          </div>
        )}
        {isSold && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            SOLD
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      </div>
      <div className="p-4 text-center group-hover:bg-blue-50/50 transition-all duration-200">
        {!isSold ? (
          <>
            <div className="text-success text-xl font-bold mb-1 font-primary group-hover:text-primary transition-all duration-200 group-hover:scale-105">
              {product.price}
            </div>
            <div className="text-gray-800 font-semibold text-lg mb-1 font-primary group-hover:text-primary transition-colors duration-200">
              {product.name}
            </div>
            <div className="text-gray-500 text-sm font-primary group-hover:text-gray-600">
              {product.availability}
            </div>
          </>
        ) : (
          <>
            <div className="text-gray-800 font-semibold text-lg mb-1 font-primary">
              {product.name}
            </div>
            {product.summary ? (
              <div className="text-success text-base font-semibold mb-1 font-primary">
                {product.summary}
              </div>
            ) : (
              <div className="text-success text-base font-semibold mb-1 font-primary">
                {product.quantity}
              </div>
            )}
            <div className="text-amber-600 text-sm font-primary font-medium">
              {product.soldDate}
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Review Card Component
  const ReviewCard = ({ review }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-secondary/30 hover:-translate-y-0.5 active:scale-98">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800 font-primary group-hover:text-primary transition-colors duration-200 truncate">
              {review.customerName}
            </h3>
            <span className="text-gray-400 text-sm font-primary flex-shrink-0 ml-2">
              {review.date}
            </span>
          </div>
          <div className="flex items-center mb-3 gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                weight={i < Math.round(review.rating) ? "fill" : "regular"}
                className={
                  i < Math.round(review.rating)
                    ? "text-secondary"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <p className="text-gray-600 leading-relaxed font-primary group-hover:text-gray-700 transition-colors duration-200">
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  );

  // Active Listings Tab Content
  const ActiveListingsContent = () => {
    const skeletonCards = Array.from({ length: 8 }).map((_, i) => (
      <div
        key={`skeleton-${i}`}
        className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
      >
        <div className="aspect-square bg-gray-100 animate-pulse" />
        <div className="p-4 space-y-2">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    ));

    const filtered = getFilteredProducts(activeListings);

    return (
      <div>
        <FilterControls />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoadingSellerItems ? (
            skeletonCards
          ) : filtered.length > 0 ? (
            filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center py-8 text-gray-600">
              No active listings yet.
            </div>
          )}
        </div>
      </div>
    );
  };

  // Sold Items Tab Content
  const SoldItemsContent = () => (
    <div>
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="text-lg font-semibold text-gray-700 mb-2">
              {getFilteredProducts(apiSoldItems).length} Products
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-outline btn-sm font-primary"
              >
                {selectedCategory === "all"
                  ? "All Categories"
                  : selectedCategory === "fresh_catch"
                  ? "Fresh Catch"
                  : selectedCategory === "dried_seafood"
                  ? "Dried Seafood"
                  : "Souvenirs"}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a
                    onClick={() => setSelectedCategory("all")}
                    className="font-primary"
                  >
                    All Categories
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => setSelectedCategory("fresh_catch")}
                    className="font-primary"
                  >
                    Fresh Catch
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => setSelectedCategory("dried_seafood")}
                    className="font-primary"
                  >
                    Dried Seafood
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => setSelectedCategory("souvenirs")}
                    className="font-primary"
                  >
                    Souvenirs
                  </a>
                </li>
              </ul>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search sold items..."
                value={searchTerm}
                onChange={(e) => {
                  e.stopPropagation();
                  setSearchTerm(e.target.value);
                }}
                onFocus={(e) => e.stopPropagation()}
                onBlur={(e) => e.stopPropagation()}
                className="input input-bordered input-sm pl-10 pr-10 w-full sm:w-64 font-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                autoComplete="off"
                spellCheck="false"
              />
              <MagnifyingGlass
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              {searchTerm && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm("");
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                  title="Clear search"
                  type="button"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {getFilteredProducts(apiSoldItems).map((product) => (
          <ProductCard key={product.id} product={product} isSold={true} />
        ))}
      </div>
    </div>
  );

  // Reviews Tab Content
  const ReviewsContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );

  // Main Render
  return (
    <div className="min-h-screen bg-base-300">
      <div className="max-w-8xl mx-auto px-4 md:px-8 pt-8">
        <SellerProfileHeader />
      </div>
      <div className="max-w-8xl mx-auto px-4 md:px-8">
        <div className="mb-6">
          <TabNavigation />
        </div>

        {activeTab === "active" && <ActiveListingsContent />}
        {activeTab === "sold" && <SoldItemsContent />}
        {activeTab === "reviews" && <ReviewsContent />}
      </div>

      {isAddOpen && (
        <AddItemModal open={isAddOpen} onClose={() => setIsAddOpen(false)} />
      )}
    </div>
  );
};

export default SellerProfilePage;
