import { useState } from "react";
import {
  useGetAccountByIdQuery,
  useGetBuyerRecentOrdersQuery,
  useGetBuyerFavoriteSellersQuery,
  useGetBuyerReviewsQuery,
  useCreateSellerReviewMutation,
} from "../services/api";
import toast from "react-hot-toast";
import {
  MapPin,
  Phone,
  EnvelopeSimple,
  Users,
  Star,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import c2cLogo from "../assets/logos/c2c_white_transparent.png";

// Import actual images
import bisugotImg from "../assets/images/bisugo.png";
import bangusImg from "../assets/images/bangus.png";
import hiponImg from "../assets/images/hipon.png";
import pusitImg from "../assets/images/pusit.png";
import tunaImg from "../assets/images/tuna.png";
import fisherManImg from "../assets/images/fisher_man.png";
import bottleOpenerImg from "../assets/images/bottle_opener.webp";
import fishWalletImg from "../assets/images/fish_wallet.jpg";
import coconutMaracasImg from "../assets/images/coconut_maracas.webp";

const BuyerProfilePage = () => {
  const [activeTab, setActiveTab] = useState("recent");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState({ stars: 5, reviewText: "" });

  // Resolve logged-in account id from localStorage
  const resolveAccountId = () => {
    try {
      const raw = localStorage.getItem("auth_user");
      if (raw) {
        const obj = JSON.parse(raw);
        return (
          obj?.id ||
          obj?._id ||
          obj?.user?.id ||
          obj?.user?._id ||
          obj?.accountId
        );
      }
    } catch {}
    const token = localStorage.getItem("auth_token");
    try {
      if (token && token.split(".").length === 3) {
        const base64 = token
          .split(".")[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/");
        const json = JSON.parse(atob(base64));
        return json?.userId || json?.accountId;
      }
    } catch {}
    return undefined;
  };
  const accountId = resolveAccountId();
  const { data: account, isLoading: isLoadingAccount } = useGetAccountByIdQuery(
    accountId,
    {
      skip: !accountId,
    }
  );

  // API calls for buyer data
  const {
    data: recentOrdersData,
    isLoading: isLoadingOrders,
    error: ordersError,
    refetch: refetchBuyerOrders,
  } = useGetBuyerRecentOrdersQuery(accountId, {
    skip: !accountId,
    // Auto refresh policies
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: favoriteSellersData,
    isLoading: isLoadingSellers,
    error: sellersError,
  } = useGetBuyerFavoriteSellersQuery(accountId, {
    skip: !accountId,
  });

  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    error: reviewsError,
    refetch: refetchBuyerReviews,
  } = useGetBuyerReviewsQuery(accountId, {
    skip: !accountId,
  });

  const [createSellerReview, { isLoading: isSubmittingReview }] =
    useCreateSellerReviewMutation();

  const [userData, setUserData] = useState(() => ({
    id: account?.id || "",
    name: account?.fullName || "",
    location: account?.address || "",
    phone: account?.contactNo || "",
    email: account?.email || "",
    memberSince: account?.memberSinceYear
      ? String(account.memberSinceYear)
      : "",
    profileImage: null,
    createdAt: account?.createdAt || "",
    updatedAt: "",
  }));

  // Keep local state in sync when account data loads
  if (account && !userData?.id) {
    setUserData((prev) => ({
      ...prev,
      id: account.id || prev.id,
      name: account.fullName || prev.name,
      location: account.address || prev.location,
      phone: account.contactNo || prev.phone,
      email: account.email || prev.email,
      memberSince: account.memberSinceYear
        ? String(account.memberSinceYear)
        : prev.memberSince,
      createdAt: account.createdAt || prev.createdAt,
    }));
  }

  // Transform API data to match UI expectations
  const recentOrders =
    recentOrdersData?.orders?.map((order) => {
      const item = order?.itemId && typeof order.itemId === "object" ? order.itemId : {};
      const sellerObj = order?.sellerId && typeof order.sellerId === "object" ? order.sellerId : {};

      const quantityLabel =
        (order?.quantity != null && order?.unit)
          ? `${order.quantity} ${order.unit}`
          : item?.formattedQuantity || "N/A";

      const categoryLabel = item?.itemType || item?.category || "Unknown";

      const sellerLabel =
        sellerObj?.username ||
        [sellerObj?.firstName, sellerObj?.lastName].filter(Boolean).join(" ") ||
        "Unknown Seller";

      const priceLabel = item?.formattedPrice || order?.totalPrice || item?.itemPrice || 0;

      return {
        id: order.id || order._id,
        image: item?.image || bisugotImg,
        weight: quantityLabel,
        type: item?.itemName || "Unknown Item",
        status: order?.status || "Sold",
        seller: sellerLabel,
        sellerId: sellerObj?._id || order?.sellerId || order?.seller_id,
        category: categoryLabel,
        price: priceLabel,
        currency: item?.formattedPrice ? undefined : "PHP",
        orderDate: order?.createdAt || undefined,
        completedDate: order?.updatedAt || order?.markedSoldAt || undefined,
        summary: order?.summary,
        raw: order,
      };
    }) || [];

  // Transform API data for favorite sellers
  const favoriteSellers =
    favoriteSellersData?.sellers?.map((seller) => ({
      id: seller.id || seller._id,
      name: seller.name || seller.sellerName || "Unknown Seller",
      image: seller.image || seller.profileImage || fisherManImg, // fallback to default image
      rating: seller.rating || seller.averageRating || 0,
      purchases: seller.purchaseCount || seller.purchases || 0,
      location: seller.location || seller.address || "Unknown Location",
      joinedDate: seller.joinedDate || seller.createdAt || seller.memberSince,
      isVerified: seller.isVerified || seller.verified || false,
      specialties: seller.specialties || seller.categories || [],
      totalEarnings: seller.totalEarnings || seller.earnings || 0,
      responseTime: seller.responseTime || "N/A",
      completionRate: seller.completionRate || seller.successRate || 0,
      raw: seller,
    })) || [];

  // Transform API data for reviews
  const reviews =
    reviewsData?.reviews?.map((review) => ({
      id: review.id || review._id,
      seller: review.sellerName || review.seller || "Unknown Seller",
      sellerId: review.sellerId || review.seller_id,
      orderId: review.orderId || review.order_id,
      productType:
        review.productName ||
        review.productType ||
        review.itemName ||
        "Unknown Product",
      date:
        review.date || review.createdAt
          ? new Date(review.createdAt).toLocaleDateString()
          : "Unknown Date",
      createdAt: review.createdAt || review.date,
      rating: review.rating || review.stars || review.score || 0,
      comment:
        review.comment ||
        review.reviewText ||
        review.text ||
        "No comment provided",
      helpful: review.helpful || review.helpfulCount || 0,
      verified: review.verified || review.isVerified || false,
      images: review.images || review.photos || [],
      buyerResponse: review.buyerResponse || review.response || null,
      raw: review,
    })) || [];

  // Profile editing functions
  const handleEditProfile = () => {
    setEditForm({ ...userData });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleSaveProfile = async () => {
    try {
      // Simulate API call to update profile
      console.log("Saving profile to backend:", editForm);

      // Update local state with new data and timestamp
      setUserData({
        ...editForm,
        updatedAt: new Date().toISOString(),
      });

      setIsEditing(false);
      setEditForm({});

      // Show success feedback
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Review handling functions
  const handleOpenReviewModal = (order) => {
    setSelectedOrder(order);
    setReviewForm({ stars: 5, reviewText: "" });
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedOrder(null);
    setReviewForm({ stars: 5, reviewText: "" });
  };

  const handleReviewSubmit = async () => {
    if (!selectedOrder || !reviewForm.reviewText.trim()) {
      toast.error("Please provide a review text");
      return;
    }

    try {
      await createSellerReview({
        sellerId: selectedOrder.sellerId,
        stars: reviewForm.stars,
        reviewText: reviewForm.reviewText.trim(),
      }).unwrap();

      toast.success("Review submitted successfully!");
      // Refresh reviews immediately
      try {
        await refetchBuyerReviews();
      } catch {}
      handleCloseReviewModal();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const handleReviewFormChange = (field, value) => {
    setReviewForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Filter function
  const getFilteredOrders = () => {
    let filtered = recentOrders;

    // Search filter only
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.type.toLowerCase().includes(q) ||
          order.seller.toLowerCase().includes(q)
      );
    }

    return filtered;
  };

  // Refetch when switching to Recent tab
  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    if (tab === "recent") {
      // Give React time to commit the state before refetch
      setTimeout(() => {
        try {
          refetchBuyerOrders?.();
        } catch {}
      }, 0);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        weight={index < rating ? "fill" : "regular"}
        className={index < rating ? "text-warning" : "text-base-300"}
      />
    ));
  };

  const renderRecentOrders = () => {
    if (isLoadingOrders) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (ordersError) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-base-content/60 text-lg">
            Failed to load recent orders
          </p>
          <p className="text-base-content/40 text-sm mt-2">
            {ordersError?.data?.message || "Please try again later"}
          </p>
        </div>
      );
    }

    const filteredOrders = getFilteredOrders();

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:bg-gray-50/70 transition-all duration-300 group cursor-pointer active:scale-98 hover:border-2 hover:border-primary/20"
            onClick={() => {
              console.log("Product clicked:", {
                orderId: order.id,
                productType: order.type,
                seller: order.seller,
                sellerId: order.sellerId,
                buyerId: userData.id,
                timestamp: new Date().toISOString(),
                action: "view_order_details",
              });
            }}
          >
            <div className="aspect-square bg-base-200 overflow-hidden">
              <img
                src={order.image}
                alt={order.type}
                className="w-full h-full object-cover group-hover:scale-102 group-hover:brightness-105 transition-all duration-500"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-success group-hover:text-success/90 transition-colors duration-300">
                  {order.weight || order.quantity}
                </span>
                <span className="text-base-content font-medium group-hover:text-primary transition-colors duration-300">
                  {order.type}
                </span>
              </div>
              <div className="text-sm text-success bg-success/10 px-3 py-1 rounded-full inline-block mb-2 group-hover:bg-success/15 transition-colors duration-300">
                {order.status}
              </div>
              <div className="text-sm text-base-content/60 group-hover:text-base-content/80 transition-colors duration-300 mb-3">
                From {order.seller}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenReviewModal(order);
                }}
                className="w-full px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200"
              >
                Add Review
              </button>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🐟</div>
            {recentOrdersData?.orders?.length === 0 ? (
              <>
                <p className="text-base-content/60 text-lg">
                  No recent orders yet
                </p>
                <p className="text-base-content/40 text-sm mt-2">
                  Start shopping to see your order history here
                </p>
              </>
            ) : (
              <>
                <p className="text-base-content/60 text-lg">
                  No products found matching your filters
                </p>
                <p className="text-base-content/40 text-sm mt-2">
                  Try adjusting your search or filters
                </p>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderFavoriteSellers = () => {
    if (isLoadingSellers) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (sellersError) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-base-content/60 text-lg">
            Failed to load favorite sellers
          </p>
          <p className="text-base-content/40 text-sm mt-2">
            {sellersError?.data?.message || "Please try again later"}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {favoriteSellers.map((seller) => (
          <div
            key={seller.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:bg-gray-50/70 transition-all duration-300 group cursor-pointer active:scale-98 hover:border-2 hover:border-primary/20"
            onClick={() => {
              // Backend-ready seller click tracking
              console.log("Seller clicked:", {
                sellerId: seller.id,
                sellerName: seller.name,
                rating: seller.rating,
                purchases: seller.purchases,
                buyerId: userData.id,
                timestamp: new Date().toISOString(),
                action: "view_seller_profile",
              });
              // TODO: Navigate to seller profile page
            }}
          >
            <div className="h-48 bg-base-200 overflow-hidden">
              <img
                src={seller.image}
                alt={seller.name}
                className="w-full h-full object-cover group-hover:scale-102 group-hover:brightness-105 transition-all duration-500"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors duration-300">
                {seller.name}
              </h3>
              <div className="flex items-center gap-1 mb-2 group-hover:scale-102 transition-transform duration-300">
                {renderStars(seller.rating)}
                <span className="ml-2 text-base-content font-medium group-hover:text-primary transition-colors duration-300">
                  {seller.rating}
                </span>
              </div>
              <div className="text-base-content/60 group-hover:text-base-content/80 transition-colors duration-300">
                {seller.purchases} purchases from this seller
              </div>
            </div>
          </div>
        ))}
        {favoriteSellers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            {favoriteSellersData?.sellers?.length === 0 ? (
              <>
                <p className="text-base-content/60 text-lg">
                  No favorite sellers yet
                </p>
                <p className="text-base-content/40 text-sm mt-2">
                  Start purchasing from sellers to add them to your favorites
                </p>
              </>
            ) : (
              <>
                <p className="text-base-content/60 text-lg">No sellers found</p>
                <p className="text-base-content/40 text-sm mt-2">
                  Try adjusting your search criteria
                </p>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderMyReviews = () => {
    if (isLoadingReviews) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    if (reviewsError) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-base-content/60 text-lg">Failed to load reviews</p>
          <p className="text-base-content/40 text-sm mt-2">
            {reviewsError?.data?.message || "Please try again later"}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">⭐</div>
            {reviewsData?.reviews?.length === 0 ? (
              <>
                <p className="text-base-content/60 text-lg">No reviews yet</p>
                <p className="text-base-content/40 text-sm mt-2">
                  Start reviewing your purchases to see them here
                </p>
              </>
            ) : (
              <>
                <p className="text-base-content/60 text-lg">No reviews found</p>
                <p className="text-base-content/40 text-sm mt-2">
                  Try adjusting your search criteria
                </p>
              </>
            )}
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md hover:bg-gray-50/70 transition-all duration-300 cursor-pointer active:scale-98 group hover:border-2 hover:border-primary/20"
              onClick={() => {
                // Backend-ready review click tracking
                console.log("Review clicked:", {
                  reviewId: review.id,
                  sellerId: review.sellerId,
                  orderId: review.orderId,
                  rating: review.rating,
                  buyerId: userData.id,
                  timestamp: new Date().toISOString(),
                  action: "view_review_details",
                });
                // TODO: Navigate to detailed review view
              }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-base-content mb-1 group-hover:text-primary transition-colors duration-300">
                  Review for {review.seller}
                </h3>
                <div className="text-sm text-base-content/60 mb-2 group-hover:text-base-content/80 transition-colors duration-300">
                  {review.date}
                </div>
                <div className="flex items-center gap-1 group-hover:scale-102 transition-transform duration-300">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="text-base-content/80 leading-relaxed group-hover:text-base-content transition-colors duration-300">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-300">
      {/* Profile Header */}
      <div className="max-w-8xl mx-auto px-4 md:px-8 pt-8">
        <div className="bg-gradient-to-r from-[#FF773C] via-[#E14400] via-30% to-[#E14400] text-white rounded-2xl p-8 md:p-12 mb-6 relative overflow-hidden shadow-lg">
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
              <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Users size={80} weight="light" className="text-gray-400" />
              </div>
            </div>

            {/* Right Side - User Info */}
            <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
              <div className="flex flex-col md:flex-row items-center md:items-center gap-3 mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {userData.name}
                </h1>
              </div>

              {isEditing ? (
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white/20 rounded-lg text-white placeholder-white/70 border border-white/30 focus:border-white focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editForm.location || ""}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white/20 rounded-lg text-white placeholder-white/70 border border-white/30 focus:border-white focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={editForm.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white/20 rounded-lg text-white placeholder-white/70 border border-white/30 focus:border-white focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white/20 rounded-lg text-white placeholder-white/70 border border-white/30 focus:border-white focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <MapPin size={22} weight="fill" className="text-white" />
                    <span className="text-lg md:text-xl font-normal">
                      {userData.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Phone size={22} weight="fill" className="text-white" />
                    <span className="text-lg md:text-xl font-normal">
                      {userData.phone}
                    </span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <EnvelopeSimple
                      size={22}
                      weight="fill"
                      className="text-white"
                    />
                    <span className="text-lg md:text-xl font-normal">
                      {userData.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Users size={22} weight="fill" className="text-white" />
                    <span className="text-lg md:text-xl font-normal">
                      Buyer Since {userData.memberSince}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-8xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button
            onClick={() => handleSetActiveTab("recent")}
            className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 cursor-pointer border-2 ${
              activeTab === "recent"
                ? "bg-primary text-white shadow-lg hover:bg-primary/95 hover:shadow-xl border-transparent"
                : "bg-white text-base-content hover:bg-base-100 hover:shadow-md hover:text-primary border-transparent hover:border-primary/20"
            }`}
          >
            Recent Orders
          </button>
          <button
            onClick={() => handleSetActiveTab("favorites")}
            className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 cursor-pointer border-2 ${
              activeTab === "favorites"
                ? "bg-primary text-white shadow-lg hover:bg-primary/95 hover:shadow-xl border-transparent"
                : "bg-white text-base-content hover:bg-base-100 hover:shadow-md hover:text-primary border-transparent hover:border-primary/20"
            }`}
          >
            Favorite Sellers
          </button>
          <button
            onClick={() => handleSetActiveTab("reviews")}
            className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 cursor-pointer border-2 ${
              activeTab === "reviews"
                ? "bg-primary text-white shadow-lg hover:bg-primary/95 hover:shadow-xl border-transparent"
                : "bg-white text-base-content hover:bg-base-100 hover:shadow-md hover:text-primary border-transparent hover:border-primary/20"
            }`}
          >
            My Reviews
          </button>
        </div>

        {/* Product Filter Bar */}
        {activeTab === "recent" && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-base-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left Side - Product Count */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <span className="font-semibold text-base-content text-xl whitespace-nowrap">
                  {getFilteredOrders().length} Products
                </span>
                <div className="w-2 h-2 bg-yellow-400 rounded-full hidden sm:block"></div>
                {/* Filters removed as requested */}
              </div>

              {/* Right Side - Search + Refresh */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products or sellers..."
                    className="input bg-base-100 border border-base-300 rounded-lg pl-4 pr-12 py-3 w-72 font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-base-200 rounded transition-all duration-200">
                    <MagnifyingGlass
                      size={20}
                      className="text-base-content/60"
                    />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    try { refetchBuyerOrders?.(); } catch {}
                  }}
                  className="px-3 py-2 bg-base-200 text-base-content rounded-lg hover:bg-base-300 transition-colors duration-200 cursor-pointer"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="mb-10">
          {activeTab === "recent" && renderRecentOrders()}
          {activeTab === "favorites" && renderFavoriteSellers()}
          {activeTab === "reviews" && renderMyReviews()}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-in {
          animation: slide-in 0.8s ease-out forwards;
        }
      `}</style>

      {/* Review Modal */}
      {showReviewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-base-content mb-4">
              Review {selectedOrder.seller}
            </h3>
            <p className="text-sm text-base-content/60 mb-4">
              Product: {selectedOrder.type}
            </p>

            {/* Star Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleReviewFormChange("stars", star)}
                    className="text-2xl transition-colors duration-200 cursor-pointer"
                  >
                    <Star
                      size={24}
                      weight={star <= reviewForm.stars ? "fill" : "regular"}
                      className={
                        star <= reviewForm.stars ? "text-warning" : "text-black"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Review</label>
              <textarea
                value={reviewForm.reviewText}
                onChange={(e) =>
                  handleReviewFormChange("reviewText", e.target.value)
                }
                placeholder="Share your experience with this seller..."
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none resize-none"
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCloseReviewModal}
                className="flex-1 px-4 py-2 bg-base-200 text-base-content rounded-lg hover:bg-base-300 transition-colors duration-200 cursor-pointer"
                disabled={isSubmittingReview}
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                disabled={isSubmittingReview || !reviewForm.reviewText.trim()}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmittingReview ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </span>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerProfilePage;
