import { useState } from 'react';
import { MapPin, Phone, EnvelopeSimple, Users, Star, MagnifyingGlass } from '@phosphor-icons/react';
import c2cLogo from '../assets/logos/c2c_white_transparent.png';

// Import actual images
import bisugotImg from '../assets/images/bisugo.png';
import bangusImg from '../assets/images/bangus.png';
import hiponImg from '../assets/images/hipon.png';
import pusitImg from '../assets/images/pusit.png';
import tunaImg from '../assets/images/tuna.png';
import fisherManImg from '../assets/images/fisher_man.png';
import bottleOpenerImg from '../assets/images/bottle_opener.webp';
import fishWalletImg from '../assets/images/fish_wallet.jpg';
import coconutMaracasImg from '../assets/images/coconut_maracas.webp';

const BuyerProfilePage = () => {
  const [activeTab, setActiveTab] = useState('recent');
  const [selectedCategory1, setSelectedCategory1] = useState('All');
  const [selectedCategory2, setSelectedCategory2] = useState('All');
  const [showSouvenirs, setShowSouvenirs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const userData = {
    name: 'Gela Alonte',
    location: 'Barangay Baybayon, Quezon',
    phone: '0912 345 6789',
    email: 'dpwh@gmail.com',
    memberSince: '2025'
  };

  const recentOrders = [
    {
      id: 1,
      image: bisugotImg,
      weight: '3 kg',
      type: 'Bisugo',
      status: 'Completed',
      seller: 'Sarah Discaya',
      category: 'Fresh Catch'
    },
    {
      id: 2,
      image: bottleOpenerImg,
      quantity: '5 pcs',
      type: 'Boat Bottle Opener',
      status: 'Completed',
      seller: "Katrina's Store",
      category: 'Souvenirs'
    },
    {
      id: 3,
      image: hiponImg,
      weight: '7 kg',
      type: 'Hipon',
      status: 'Completed',
      seller: "Katrina's Store",
      category: 'Fresh Catch'
    },
    {
      id: 4,
      image: bangusImg,
      weight: '5 kg',
      type: 'Bangus',
      status: 'Completed',
      seller: "Katrina's Store",
      category: 'Fresh Catch'
    },
    {
      id: 5,
      image: tunaImg,
      weight: '2 kg',
      type: 'Tuna',
      status: 'Completed',
      seller: 'Mark Allan',
      category: 'Fresh Catch'
    },
    {
      id: 6,
      image: pusitImg,
      weight: '4 kg',
      type: 'Pusit',
      status: 'Completed',
      seller: 'Sarah Discaya',
      category: 'Fresh Catch'
    },
    {
      id: 7,
      image: fishWalletImg,
      quantity: '2 pcs',
      type: 'Fish Wallet',
      status: 'Completed',
      seller: 'Mark Allan',
      category: 'Souvenirs'
    },
    {
      id: 8,
      image: coconutMaracasImg,
      quantity: '3 pcs',
      type: 'Coconut Maracas',
      status: 'Completed',
      seller: "Katrina's Store",
      category: 'Souvenirs'
    }
  ];

  const favoriteSellers = [
    {
      id: 1,
      name: 'Sarah Discaya',
      image: fisherManImg,
      rating: 4.0,
      purchases: 30
    },
    {
      id: 2,
      name: 'Mark Allan',
      image: fisherManImg,
      rating: 5.0,
      purchases: 83
    }
  ];

  const reviews = [
    {
      id: 1,
      seller: 'Sarah Discaya',
      date: '2 days ago',
      rating: 4,
      comment: 'Fresh bangus! Very good quality and the seller was very accommodating. Will definitely buy again!'
    },
    {
      id: 2,
      seller: 'Mark Allan',
      date: '3 days ago',
      rating: 4,
      comment: 'Good service and fresh catch. The shrimp was excellent for my family dinner.'
    },
    {
      id: 3,
      seller: "Katrina's Store",
      date: '2 days ago',
      rating: 5,
      comment: 'Fresh bangus! Very good quality and the seller was very accommodating. Will definitely buy again!'
    }
  ];

  // Filter function
  const getFilteredOrders = () => {
    let filtered = recentOrders;

    // Apply category filters
    if (showSouvenirs) {
      filtered = filtered.filter(order => order.category === 'Souvenirs');
    } else {
      const categories = [];
      if (selectedCategory1 !== 'All') categories.push(selectedCategory1);
      if (selectedCategory2 !== 'All') categories.push(selectedCategory2);

      if (categories.length > 0) {
        filtered = filtered.filter(order => categories.includes(order.category));
      }
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(order =>
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
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg hover:bg-gray-50 transition-all duration-200 group cursor-pointer active:scale-95"
            onClick={() => console.log('Product clicked:', order.type)}
          >
            <div className="aspect-square bg-base-200 overflow-hidden">
              <img
                src={order.image}
                alt={order.type}
                className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-success group-hover:text-success/80 transition-colors duration-200">
                  {order.weight || order.quantity}
                </span>
                <span className="text-base-content font-medium group-hover:text-primary transition-colors duration-200">{order.type}</span>
              </div>
              <div className="text-sm text-success bg-success/10 px-3 py-1 rounded-full inline-block mb-2 group-hover:bg-success/20 transition-colors duration-200">
                {order.status}
              </div>
              <div className="text-sm text-base-content/60 group-hover:text-base-content/80 transition-colors duration-200">
                From {order.seller}
              </div>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🐟</div>
            <p className="text-base-content/60 text-lg">No products found matching your filters.</p>
            <p className="text-base-content/40 text-sm mt-2">Try adjusting your search or filters</p>
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
          className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg hover:bg-gray-50 transition-all duration-200 group cursor-pointer active:scale-95"
          onClick={() => console.log('Seller clicked:', seller.name)}
        >
          <div className="h-48 bg-base-200 overflow-hidden">
            <img
              src={seller.image}
              alt={seller.name}
              className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors duration-200">
              {seller.name}
            </h3>
            <div className="flex items-center gap-1 mb-2 group-hover:scale-105 transition-transform duration-200">
              {renderStars(seller.rating)}
              <span className="ml-2 text-base-content font-medium group-hover:text-primary transition-colors duration-200">{seller.rating}</span>
            </div>
            <div className="text-base-content/60 group-hover:text-base-content/80 transition-colors duration-200">
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
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer active:scale-95 group"
          onClick={() => console.log('Review clicked:', review.seller)}
        >
          <div className="mb-4">
            <h3 className="text-lg font-bold text-base-content mb-1 group-hover:text-primary transition-colors duration-200">
              Review for {review.seller}
            </h3>
            <div className="text-sm text-base-content/60 mb-2 group-hover:text-base-content/80 transition-colors duration-200">{review.date}</div>
            <div className="flex items-center gap-1 group-hover:scale-105 transition-transform duration-200">
              {renderStars(review.rating)}
            </div>
          </div>
          <p className="text-base-content/80 leading-relaxed group-hover:text-base-content transition-colors duration-200">{review.comment}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-base-300">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Side - Avatar and User Info */}
            <div className="flex flex-col md:flex-row items-center gap-6 flex-1">
              {/* Avatar */}
              <div className="w-36 h-36 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-white/30 hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95 group">
                <div className="w-28 h-28 bg-white/40 rounded-full flex items-center justify-center group-hover:bg-white/50 transition-colors duration-200">
                  <Users size={56} className="text-white group-hover:scale-110 transition-transform duration-200" />
                </div>
              </div>

              {/* User Info */}
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold mb-6">{userData.name}</h1>
                <div className="space-y-3">
                  <div className="flex items-center justify-center md:justify-start gap-3 hover:text-white/90 hover:scale-105 transition-all duration-200 cursor-pointer p-2 rounded-lg hover:bg-white/10">
                    <MapPin size={18} className="hover:scale-110 transition-transform duration-200" />
                    <span className="text-lg">{userData.location}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3 hover:text-white/90 hover:scale-105 transition-all duration-200 cursor-pointer p-2 rounded-lg hover:bg-white/10">
                    <Phone size={18} className="hover:scale-110 transition-transform duration-200" />
                    <span className="text-lg">{userData.phone}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3 hover:text-white/90 hover:scale-105 transition-all duration-200 cursor-pointer p-2 rounded-lg hover:bg-white/10">
                    <EnvelopeSimple size={18} className="hover:scale-110 transition-transform duration-200" />
                    <span className="text-lg">{userData.email}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3 hover:text-white/90 hover:scale-105 transition-all duration-200 cursor-pointer p-2 rounded-lg hover:bg-white/10">
                    <Users size={18} className="hover:scale-110 transition-transform duration-200" />
                    <span className="text-lg">Buyer Since {userData.memberSince}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Coast2Cart Logo */}
            <div className="flex-shrink-0">
              <img
                src={c2cLogo}
                alt="Coast2Cart"
                className="h-16 w-auto hover:opacity-90 hover:scale-110 transition-all duration-200 cursor-pointer active:scale-95"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-8 py-4 rounded-full font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
              activeTab === 'recent'
                ? 'bg-primary text-white shadow-lg hover:bg-primary/90'
                : 'bg-white text-base-content hover:bg-base-100 hover:shadow-md hover:text-primary'
            }`}
          >
            Recent Orders
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-8 py-4 rounded-full font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
              activeTab === 'favorites'
                ? 'bg-primary text-white shadow-lg hover:bg-primary/90'
                : 'bg-white text-base-content hover:bg-base-100 hover:shadow-md hover:text-primary'
            }`}
          >
            Favorite Sellers
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-8 py-4 rounded-full font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
              activeTab === 'reviews'
                ? 'bg-primary text-white shadow-lg hover:bg-primary/90'
                : 'bg-white text-base-content hover:bg-base-100 hover:shadow-md hover:text-primary'
            }`}
          >
            My Reviews
          </button>
        </div>

        {/* Product Filter Bar */}
        {activeTab === 'recent' && (
          <div className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-base-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left Side - Product Count and Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <span className="font-semibold text-base-content text-xl">
                  {getFilteredOrders().length} Products
                </span>
                <div className="flex flex-wrap gap-3">
                  <select
                    className="select bg-base-200 border-none rounded-lg px-4 py-3 min-w-36 font-medium text-base hover:bg-base-300 transition-colors focus:ring-2 focus:ring-primary"
                    value={selectedCategory1}
                    onChange={(e) => {
                      setSelectedCategory1(e.target.value);
                      setShowSouvenirs(false);
                    }}
                  >
                    <option value="All">All Categories</option>
                    <option value="Fresh Catch">Fresh Catch</option>
                    <option value="Dried Seafood">Dried Seafood</option>
                  </select>
                  <select
                    className="select bg-base-200 border-none rounded-lg px-4 py-3 min-w-36 font-medium text-base hover:bg-base-300 transition-colors focus:ring-2 focus:ring-primary"
                    value={selectedCategory2}
                    onChange={(e) => {
                      setSelectedCategory2(e.target.value);
                      setShowSouvenirs(false);
                    }}
                  >
                    <option value="All">All Types</option>
                    <option value="Fresh Catch">Fresh Catch</option>
                    <option value="Dried Seafood">Dried Seafood</option>
                  </select>
                  <button
                    className={`btn border-none rounded-lg px-6 py-3 font-medium text-base transition-all duration-200 hover:scale-105 active:scale-95 ${
                      showSouvenirs
                        ? 'bg-primary text-white shadow-lg hover:bg-primary/90'
                        : 'bg-base-200 hover:bg-base-300'
                    }`}
                    onClick={() => {
                      setShowSouvenirs(!showSouvenirs);
                      setSelectedCategory1('All');
                      setSelectedCategory2('All');
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
                    className="input bg-base-100 border border-base-300 rounded-lg pl-4 pr-12 py-3 w-64 font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-base-200 rounded transition-all duration-200">
                    <MagnifyingGlass size={20} className="text-base-content/60" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="mb-10">
          {activeTab === 'recent' && renderRecentOrders()}
          {activeTab === 'favorites' && renderFavoriteSellers()}
          {activeTab === 'reviews' && renderMyReviews()}
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