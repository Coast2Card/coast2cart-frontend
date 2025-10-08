import { useState } from "react";
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
  const [selectedCategory1, setSelectedCategory1] = useState("All");
  const [selectedCategory2, setSelectedCategory2] = useState("All");
  const [showSouvenirs, setShowSouvenirs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const [userData, setUserData] = useState({
    id: "buyer_001",
    name: "Gela Alonte",
    location: "Barangay Baybayon, Quezon",
    phone: "0912 345 6789",
    email: "dpwh@gmail.com",
    memberSince: "2025",
    profileImage: null,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
  });

  const [recentOrders, _setRecentOrders] = useState([
    {
      id: "order_001",
      image: bisugotImg,
      weight: "3 kg",
      type: "Bisugo",
      status: "Completed",
      seller: "Sarah Discaya",
      sellerId: "seller_001",
      category: "Fresh Catch",
      price: 450,
      currency: "PHP",
      orderDate: "2025-01-10T14:30:00Z",
      completedDate: "2025-01-10T16:45:00Z",
    },
    {
      id: "order_002",
      image: bottleOpenerImg,
      quantity: "5 pcs",
      type: "Boat Bottle Opener",
      status: "Completed",
      seller: "Katrina's Store",
      sellerId: "seller_002",
      category: "Souvenirs",
      price: 250,
      currency: "PHP",
      orderDate: "2025-01-08T11:20:00Z",
      completedDate: "2025-01-08T13:15:00Z",
    },
    {
      id: "order_003",
      image: hiponImg,
      weight: "7 kg",
      type: "Hipon",
      status: "Completed",
      seller: "Katrina's Store",
      sellerId: "seller_002",
      category: "Fresh Catch",
      price: 700,
      currency: "PHP",
      orderDate: "2025-01-07T09:30:00Z",
      completedDate: "2025-01-07T11:45:00Z",
    },
    {
      id: "order_004",
      image: bangusImg,
      weight: "5 kg",
      type: "Bangus",
      status: "Completed",
      seller: "Katrina's Store",
      sellerId: "seller_002",
      category: "Fresh Catch",
      price: 600,
      currency: "PHP",
      orderDate: "2025-01-06T15:20:00Z",
      completedDate: "2025-01-06T17:10:00Z",
    },
    {
      id: "order_005",
      image: tunaImg,
      weight: "2 kg",
      type: "Tuna",
      status: "Completed",
      seller: "Mark Allan",
      sellerId: "seller_003",
      category: "Fresh Catch",
      price: 320,
      currency: "PHP",
      orderDate: "2025-01-05T12:15:00Z",
      completedDate: "2025-01-05T14:30:00Z",
    },
    {
      id: "order_006",
      image: pusitImg,
      weight: "4 kg",
      type: "Pusit",
      status: "Completed",
      seller: "Sarah Discaya",
      sellerId: "seller_001",
      category: "Fresh Catch",
      price: 520,
      currency: "PHP",
      orderDate: "2025-01-04T16:45:00Z",
      completedDate: "2025-01-04T18:20:00Z",
    },
    {
      id: "order_007",
      image: fishWalletImg,
      quantity: "2 pcs",
      type: "Fish Wallet",
      status: "Completed",
      seller: "Mark Allan",
      sellerId: "seller_003",
      category: "Souvenirs",
      price: 180,
      currency: "PHP",
      orderDate: "2025-01-03T10:30:00Z",
      completedDate: "2025-01-03T12:15:00Z",
    },
    {
      id: "order_008",
      image: coconutMaracasImg,
      quantity: "3 pcs",
      type: "Coconut Maracas",
      status: "Completed",
      seller: "Katrina's Store",
      sellerId: "seller_002",
      category: "Souvenirs",
      price: 150,
      currency: "PHP",
      orderDate: "2025-01-02T14:00:00Z",
      completedDate: "2025-01-02T16:30:00Z",
    },
  ]);

  const [favoriteSellers, _setFavoriteSellers] = useState([
    {
      id: "seller_001",
      name: "Sarah Discaya",
      image: fisherManImg,
      rating: 4.0,
      purchases: 30,
      location: "Barangay Tubigan, Quezon",
      joinedDate: "2024-03-15T00:00:00Z",
      isVerified: true,
      specialties: ["Fresh Fish", "Crustaceans"],
      totalEarnings: 45000,
      responseTime: "2 hours",
      completionRate: 98.5,
    },
    {
      id: "seller_002",
      name: "Mark Allan",
      image: fisherManImg,
      rating: 5.0,
      purchases: 83,
      location: "Barangay Dalahican, Quezon",
      joinedDate: "2024-01-20T00:00:00Z",
      isVerified: true,
      specialties: ["Souvenirs", "Dried Seafood"],
      totalEarnings: 120000,
      responseTime: "1 hour",
      completionRate: 99.2,
    },
  ]);

  const [reviews, _setReviews] = useState([
    {
      id: "review_001",
      seller: "Sarah Discaya",
      sellerId: "seller_001",
      orderId: "order_004",
      productType: "Bangus",
      date: "2 days ago",
      createdAt: "2025-01-13T09:15:00Z",
      rating: 4,
      comment:
        "Fresh bangus! Very good quality and the seller was very accommodating. Will definitely buy again!",
      helpful: 12,
      verified: true,
      images: [],
      buyerResponse: null,
    },
    {
      id: "review_002",
      seller: "Mark Allan",
      sellerId: "seller_003",
      orderId: "order_003",
      productType: "Hipon",
      date: "3 days ago",
      createdAt: "2025-01-12T15:45:00Z",
      rating: 4,
      comment:
        "Good service and fresh catch. The shrimp was excellent for my family dinner.",
      helpful: 8,
      verified: true,
      images: [],
      buyerResponse: null,
    },
    {
      id: "review_003",
      seller: "Katrina's Store",
      sellerId: "seller_002",
      orderId: "order_002",
      productType: "Boat Bottle Opener",
      date: "2 days ago",
      createdAt: "2025-01-13T11:20:00Z",
      rating: 5,
      comment:
        "Fresh bangus! Very good quality and the seller was very accommodating. Will definitely buy again!",
      helpful: 15,
      verified: true,
      images: [],
      buyerResponse: null,
    },
  ]);

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

  // Filter function
  const getFilteredOrders = () => {
    let filtered = recentOrders;

    // Apply category filters
    if (showSouvenirs) {
      filtered = filtered.filter((order) => order.category === "Souvenirs");
    } else {
      const categories = [];
      if (selectedCategory1 !== "All") categories.push(selectedCategory1);
      if (selectedCategory2 !== "All") categories.push(selectedCategory2);

      if (categories.length > 0) {
        filtered = filtered.filter((order) =>
          categories.includes(order.category)
        );
      }
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.seller.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
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
    const filteredOrders = getFilteredOrders();

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:bg-gray-50/70 transition-all duration-300 group cursor-pointer active:scale-98 hover:border-2 hover:border-primary/20"
            onClick={() => {
              // Backend-ready click tracking
              console.log("Product clicked:", {
                orderId: order.id,
                productType: order.type,
                seller: order.seller,
                sellerId: order.sellerId,
                buyerId: userData.id,
                timestamp: new Date().toISOString(),
                action: "view_order_details",
              });
              // TODO: Send analytics to backend
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
              <div className="text-sm text-base-content/60 group-hover:text-base-content/80 transition-colors duration-300">
                From {order.seller}
              </div>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🐟</div>
            <p className="text-base-content/60 text-lg">
              No products found matching your filters.
            </p>
            <p className="text-base-content/40 text-sm mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderFavoriteSellers = () => (
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
    </div>
  );

  const renderMyReviews = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.map((review) => (
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
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-base-300">
      {/* Profile Header */}
      <div className="w-full px-8 pt-8">
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
                <Users
                  size={80}
                  weight="light"
                  className="text-gray-400"
                />
              </div>
            </div>

            {/* Right Side - User Info */}
            <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
              <div className="flex flex-col md:flex-row items-center md:items-center gap-3 mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {userData.name}
                </h1>
                {!isEditing && (
                  <button
                    onClick={handleEditProfile}
                    className="px-6 py-2 bg-white/90 hover:bg-white rounded-full text-[#FF773C] font-semibold transition-all duration-200 hover:scale-105 active:scale-95 text-sm md:text-base"
                  >
                    Edit Profile
                  </button>
                )}
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
                      <MapPin
                        size={22}
                        weight="fill"
                        className="text-white"
                      />
                      <span className="text-lg md:text-xl font-normal">{userData.location}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <Phone
                        size={22}
                        weight="fill"
                        className="text-white"
                      />
                      <span className="text-lg md:text-xl font-normal">{userData.phone}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <EnvelopeSimple
                        size={22}
                        weight="fill"
                        className="text-white"
                      />
                      <span className="text-lg md:text-xl font-normal">{userData.email}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <Users
                        size={22}
                        weight="fill"
                        className="text-white"
                      />
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab("recent")}
            className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-102 active:scale-98 ${
              activeTab === "recent"
                ? "bg-primary text-white shadow-lg hover:bg-primary/95 hover:shadow-xl"
                : "bg-white text-base-content hover:bg-base-100 hover:shadow-md hover:text-primary hover:border-2 hover:border-primary/20"
            }`}
          >
            Recent Orders
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-102 active:scale-98 ${
              activeTab === "favorites"
                ? "bg-primary text-white shadow-lg hover:bg-primary/95 hover:shadow-xl"
                : "bg-white text-base-content hover:bg-base-100 hover:shadow-md hover:text-primary hover:border-2 hover:border-primary/20"
            }`}
          >
            Favorite Sellers
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-102 active:scale-98 ${
              activeTab === "reviews"
                ? "bg-primary text-white shadow-lg hover:bg-primary/95 hover:shadow-xl"
                : "bg-white text-base-content hover:bg-base-100 hover:shadow-md hover:text-primary hover:border-2 hover:border-primary/20"
            }`}
          >
            My Reviews
          </button>
        </div>

        {/* Product Filter Bar */}
        {activeTab === "recent" && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-base-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left Side - Product Count and Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <span className="font-semibold text-base-content text-xl whitespace-nowrap">
                  {getFilteredOrders().length} Products
                </span>
                <div className="w-2 h-2 bg-yellow-400 rounded-full hidden sm:block"></div>
                <div className="flex items-center gap-4">
                  <select
                    className="select bg-[#B8D4E3] border-none rounded-lg px-6 py-4 pr-12 w-[180px] h-[52px] font-medium text-base text-gray-700 hover:bg-[#A5C9DC] transition-colors focus:ring-2 focus:ring-primary appearance-none focus:outline-none"
                    value={selectedCategory1}
                    onChange={(e) => {
                      setSelectedCategory1(e.target.value);
                      setShowSouvenirs(false);
                    }}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 12px center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "16px",
                      border: "none",
                      outline: "none",
                    }}
                  >
                    <option value="All">All Categories</option>
                    <option value="Fresh Catch">Fresh Catch</option>
                    <option value="Dried Seafood">Dried Seafood</option>
                  </select>
                  <select
                    className="select bg-[#B8D4E3] border-none rounded-lg px-6 py-4 pr-12 w-[160px] h-[52px] font-medium text-base text-gray-700 hover:bg-[#A5C9DC] transition-colors focus:ring-2 focus:ring-primary appearance-none focus:outline-none"
                    value={selectedCategory2}
                    onChange={(e) => {
                      setSelectedCategory2(e.target.value);
                      setShowSouvenirs(false);
                    }}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 12px center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "16px",
                      border: "none",
                      outline: "none",
                    }}
                  >
                    <option value="All">All Types</option>
                    <option value="Fresh Catch">Fresh Catch</option>
                    <option value="Dried Seafood">Dried Seafood</option>
                  </select>
                  <button
                    className={`btn border-none rounded-lg px-8 py-4 font-medium text-base transition-all duration-200 hover:scale-105 active:scale-95 w-[140px] h-[52px] ${
                      showSouvenirs
                        ? "bg-primary text-white shadow-lg hover:bg-primary/90"
                        : "bg-[#B8D4E3] text-gray-700 hover:bg-[#A5C9DC]"
                    }`}
                    onClick={() => {
                      setShowSouvenirs(!showSouvenirs);
                      setSelectedCategory1("All");
                      setSelectedCategory2("All");
                    }}
                  >
                    Souvenirs
                  </button>
                </div>
              </div>

              {/* Right Side - Search */}
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
    </div>
  );
};

export default BuyerProfilePage;
