import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Envelope,
  Calendar,
  MagnifyingGlass,
  Star,
} from "@phosphor-icons/react";
import c2cLogo from "../assets/logos/c2c_white_transparent.png";
import bisugotImg from "../assets/images/bisugo.png";
import bangusImg from "../assets/images/bangus.png";
import hiponImg from "../assets/images/hipon.png";
import tunaImg from "../assets/images/tuna.png";
import hasaHasaImg from "../assets/images/hasa_hasa.png";
import dalangBukidImg from "../assets/images/dalagang_bukid.png";
import fishWalletImg from "../assets/images/fish_wallet.jpg";
import souvenir1 from "../assets/souvenir-items/souvenir1.png";
import souvenir2 from "../assets/souvenir-items/souvenir2.png";
import souvenir3 from "../assets/souvenir-items/souvenir3.png";
import souvenir4 from "../assets/souvenir-items/souvenir4.png";
import fisherManImg from "../assets/images/fisher_man.png";
import alumahanImg from "../assets/images/alumahan.png";
import pusitImg from "../assets/images/pusit.png";
import talakitokImg from "../assets/images/talakitok.png";
import baybayanFanImg from "../assets/images/baybayon_fan.jpg";
import customer1 from "../assets/images/home_test1.png";
import customer2 from "../assets/images/home_test2.png";
import customer3 from "../assets/images/home_test3.png";
import customer4 from "../assets/images/home_test4.png";

const SellerProfilePage = ({ sellerId }) => {
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data - Backend team can replace with API calls using sellerId
  const sellerData = {
    id: sellerId || 1,
    name: "Sarah Discaya",
    profileImage: fisherManImg,
    isVerified: true,
    location: "Barangay Baybayon, Quezon",
    phone: "0912 345 6789",
    email: "dpwh@gmail.com",
    memberSince: "2025",
    totalProducts: 15,
    totalSold: 8,
    averageRating: 4.8,
    totalReviews: 23,
  };

  const activeListings = [
    {
      id: 1,
      name: "Bisugo",
      price: "₱380/kg",
      image: bisugotImg,
      availability: "2 kg available",
      category: "fresh_catch",
    },
    {
      id: 2,
      name: "Hasa-Hasa",
      price: "₱170/kg",
      image: hasaHasaImg,
      availability: "4 kg available",
      category: "fresh_catch",
    },
    {
      id: 3,
      name: "Dalagang Bukid",
      price: "₱360/kg",
      image: dalangBukidImg,
      availability: "7 kg available",
      category: "fresh_catch",
    },
    {
      id: 4,
      name: "Bangus",
      price: "₱289/kg",
      image: bangusImg,
      availability: "10 kg available",
      category: "fresh_catch",
    },
    {
      id: 5,
      name: "Fish Wallet",
      price: "₱70",
      image: fishWalletImg,
      availability: "20 pcs available",
      category: "souvenirs",
    },
    {
      id: 6,
      name: "Boat Keychain",
      price: "₱55",
      image: souvenir1,
      availability: "10 pcs available",
      category: "souvenirs",
    },
    {
      id: 7,
      name: "Tuna",
      price: "₱280/kg",
      image: tunaImg,
      availability: "7 kg available",
      category: "dried_seafood",
    },
    {
      id: 8,
      name: "Hipon",
      price: "₱325/kg",
      image: hiponImg,
      availability: "10 kg available",
      category: "fresh_catch",
    },
    {
      id: 9,
      name: "Alumahan",
      price: "₱250/kg",
      image: alumahanImg,
      availability: "5 kg available",
      category: "fresh_catch",
    },
    {
      id: 10,
      name: "Pusit",
      price: "₱400/kg",
      image: pusitImg,
      availability: "3 kg available",
      category: "fresh_catch",
    },
    {
      id: 11,
      name: "Talakitok",
      price: "₱300/kg",
      image: talakitokImg,
      availability: "8 kg available",
      category: "fresh_catch",
    },
    {
      id: 12,
      name: "Baybayon Fan",
      price: "₱85",
      image: baybayanFanImg,
      availability: "15 pcs available",
      category: "souvenirs",
    },
    {
      id: 13,
      name: "Shell Keychain",
      price: "₱45",
      image: souvenir2,
      availability: "25 pcs available",
      category: "souvenirs",
    },
    {
      id: 14,
      name: "Coral Necklace",
      price: "₱120",
      image: souvenir3,
      availability: "8 pcs available",
      category: "souvenirs",
    },
    {
      id: 15,
      name: "Fish Magnet",
      price: "₱35",
      image: souvenir4,
      availability: "30 pcs available",
      category: "souvenirs",
    },
  ];

  const soldItems = [
    {
      id: 1,
      name: "Dalagang Bukid",
      quantity: "3 kg",
      image: dalangBukidImg,
      soldDate: "Sold 2 days ago",
      category: "fresh_catch",
    },
    {
      id: 2,
      name: "Bisugo",
      quantity: "4 kg",
      image: bisugotImg,
      soldDate: "Sold 2 days ago",
      category: "fresh_catch",
    },
    {
      id: 3,
      name: "Boat Keychain",
      quantity: "10 pcs",
      image: souvenir1,
      soldDate: "Sold 2 hrs ago",
      category: "souvenirs",
    },
    {
      id: 4,
      name: "Tuna",
      quantity: "7 kg",
      image: tunaImg,
      soldDate: "Sold 1 week ago",
      category: "dried_seafood",
    },
    {
      id: 5,
      name: "Bangus",
      quantity: "5 kg",
      image: bangusImg,
      soldDate: "Sold 3 days ago",
      category: "fresh_catch",
    },
    {
      id: 6,
      name: "Fish Wallet",
      quantity: "8 pcs",
      image: fishWalletImg,
      soldDate: "Sold 1 day ago",
      category: "souvenirs",
    },
    {
      id: 7,
      name: "Hipon",
      quantity: "2 kg",
      image: hiponImg,
      soldDate: "Sold 4 days ago",
      category: "fresh_catch",
    },
    {
      id: 8,
      name: "Baybayon Fan",
      quantity: "3 pcs",
      image: baybayanFanImg,
      soldDate: "Sold 5 days ago",
      category: "souvenirs",
    },
  ];

  const reviews = [
    {
      id: 1,
      customerName: "Claudine Co",
      rating: 4,
      comment:
        "Fresh bangus! Very good quality and the seller was very accommodating. Will definitely buy again!",
      date: "2 days ago",
      avatar: customer1,
    },
    {
      id: 2,
      customerName: "Jammy Cruz",
      rating: 5,
      comment:
        "Best seafood in Baybayon! Always fresh and reasonably priced. Highly recommended!",
      date: "1 week ago",
      avatar: customer2,
    },
    {
      id: 3,
      customerName: "Gela Alonte",
      rating: 5,
      comment:
        "Good service and fresh catch. The shrimp was excellent for my family dinner.",
      date: "2 weeks ago",
      avatar: customer3,
    },
    {
      id: 4,
      customerName: "Jasmine Chan",
      rating: 4,
      comment:
        "Fresh bangus! Very good quality and the seller was very accommodating. Will definitely buy again!",
      date: "2 days ago",
      avatar: customer4,
    },
  ];

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
    <div className="bg-gradient-to-r from-primary via-[#0058BA] to-primary rounded-lg p-6 md:p-8 mb-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="avatar">
          <div className="w-32 h-32 rounded-full ring ring-white ring-offset-2">
            <img
              src={sellerData.profileImage}
              alt={sellerData.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left text-white">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <h1 className="text-3xl font-bold font-display">
              {sellerData.name}
            </h1>
            {sellerData.isVerified && (
              <div className="badge badge-accent text-white">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified Seller
              </div>
            )}
          </div>

          <div className="space-y-2 text-white/90">
            <div className="flex items-center justify-center md:justify-start gap-2 p-1.5 rounded-lg">
              <MapPin size={18} />
              <span className="text-lg">{sellerData.location}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 p-1.5 rounded-lg">
              <Phone size={18} />
              <span className="text-lg">{sellerData.phone}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 p-1.5 rounded-lg">
              <Envelope size={18} />
              <span className="text-lg">{sellerData.email}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 p-1.5 rounded-lg">
              <Calendar size={18} />
              <span className="text-lg">
                Seller Since {sellerData.memberSince}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:block flex-shrink-0">
          <img
            src={c2cLogo}
            alt="Coast2Cart"
            className="h-12 w-auto opacity-90"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10"></div>
    </div>
  );

  // Tab Navigation Component
  const TabNavigation = () => (
    <div className="flex flex-wrap justify-center gap-3 mb-6">
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
            <div className="text-success text-2xl font-bold mb-1 font-primary group-hover:scale-105 transition-transform duration-200">
              {product.quantity}
            </div>
            <div className="text-gray-800 font-semibold text-lg mb-1 font-primary">
              {product.name}
            </div>
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
        <div className="avatar group flex-shrink-0">
          <div className="w-12 h-12 rounded-full ring-2 ring-gray-200 group-hover:ring-secondary transition-all duration-200 group-hover:scale-105">
            <img
              src={review.avatar}
              alt={review.customerName}
              className="w-full h-full object-cover rounded-full transition-transform duration-200 group-hover:scale-110"
            />
          </div>
        </div>
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
                weight="regular"
                className={`transition-all duration-200 hover:scale-110 ${
                  i < review.rating
                    ? "text-secondary hover:text-orange-500"
                    : "text-gray-300 hover:text-gray-400"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-500 font-primary">
              ({review.rating}/5)
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed font-primary group-hover:text-gray-700 transition-colors duration-200">
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  );

  // Active Listings Tab Content
  const ActiveListingsContent = () => (
    <div>
      <FilterControls />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {getFilteredProducts(activeListings).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );

  // Sold Items Tab Content
  const SoldItemsContent = () => (
    <div>
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="text-lg font-semibold text-gray-700 mb-2">
              {getFilteredProducts(soldItems).length} Products
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
        {getFilteredProducts(soldItems).map((product) => (
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
    <div className="max-w-6xl mx-auto px-4 pt-8">
      <SellerProfileHeader />
      <div className="mb-6">
        <TabNavigation />
      </div>

      {activeTab === "active" && <ActiveListingsContent />}
      {activeTab === "sold" && <SoldItemsContent />}
      {activeTab === "reviews" && <ReviewsContent />}
    </div>
  );
};

export default SellerProfilePage;
