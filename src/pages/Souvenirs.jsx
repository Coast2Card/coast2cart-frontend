import { useState, useEffect, useRef } from 'react';
import FishImage from '../assets/souvenir-items/fish.png';
import Souvenir1 from '../assets/souvenir-items/souvenir1.png';
import Souvenir2 from '../assets/souvenir-items/souvenir2.png';
import Souvenir3 from '../assets/souvenir-items/souvenir3.png';
import Souvenir4 from '../assets/souvenir-items/souvenir4.png';
import Souvenir5 from '../assets/souvenir-items/souvenir5.png';
import Souvenir6 from '../assets/souvenir-items/souvenir6.png';
import Souvenir7 from '../assets/souvenir-items/souvenir7.png';
import Souvenir8 from '../assets/souvenir-items/souvenir8.png';

const Souvenirs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const allSouvenirs = [
    { id: 1, image: Souvenir1, name: "Baybayon Fan", price: "P95", priceValue: 95 },
    { id: 2, image: Souvenir2, name: "Fish Wallet", price: "P70", priceValue: 70 },
    { id: 3, image: Souvenir3, name: "Shell Necklace", price: "P65", priceValue: 65 },
    { id: 4, image: Souvenir4, name: "Keychain", price: "P55", priceValue: 55 },
    { id: 5, image: Souvenir5, name: "Boat Keychain", price: "P55", priceValue: 55 },
    { id: 6, image: Souvenir6, name: "Coconut Maracas", price: "P80", priceValue: 80 },
    { id: 7, image: Souvenir7, name: "Rattan Bag", price: "P340", priceValue: 340 },
    { id: 8, image: Souvenir8, name: "Bottle Opener", price: "P53", priceValue: 53 }
  ];

  // Filter and sort souvenirs
  const filteredAndSortedSouvenirs = allSouvenirs
    .filter(souvenir =>
      souvenir.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.priceValue - b.priceValue;
        case 'price-high':
          return b.priceValue - a.priceValue;
        default:
          return 0;
      }
    });

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price-low', label: 'Price (Low to High)' },
    { value: 'price-high', label: 'Price (High to Low)' }
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 mb-16">
        {/* Left side - Text content */}
        <div className="lg:w-1/2 lg:pr-16">
          <h1 className="text-5xl font-bold mb-6 font-display" style={{ color: '#FF6F47' }}>
            Souvenirs
          </h1>
          <p className="text-lg text-black font-primary leading-relaxed">
            Take home a piece of Barangay Baybayon with our locally made souvenirs. From handcrafted items and sea-inspired trinkets to products made by our fisherfolk and their families, each souvenir carries the story of our coastal community. Every purchase supports local livelihoods and keeps the spirit of Baybayon alive wherever you go.
          </p>
        </div>
        
        {/* Right side - Fish image */}
        <div className="flex-shrink-0 lg:w-1/2">
          <img 
            src={FishImage} 
            alt="Decorative fish lantern" 
            className="w-full h-auto max-w-md mx-auto lg:mx-0"
          />
        </div>
      </div>

      {/* Sorting and Search Section */}
      <div className="bg-white shadow-xl p-4 mb-20">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left side - Product count and sort */}
          <div className="flex items-center gap-4">
            <span className="text-black font-primary">{filteredAndSortedSouvenirs.length} Products</span>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-primary flex items-center gap-2 hover:bg-yellow-500 transition-colors"
              >
                Sort by
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                        sortBy === option.value ? 'bg-yellow-50 text-yellow-700' : 'text-gray-700'
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
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors" style={{ backgroundColor: '#102F76' }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Souvenir Grid or No Results */}
      {filteredAndSortedSouvenirs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAndSortedSouvenirs.map((souvenir) => (
            <div key={souvenir.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={souvenir.image} 
                  alt={souvenir.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <p className="text-xl font-bold mb-2" style={{ color: '#007A3F' }}>
                  {souvenir.price}
                </p>
                <h3 className="text-lg text-black font-primary font-medium">
                  {souvenir.name}
                </h3>
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
              We couldn't find any souvenirs matching "{searchTerm}". Try searching for something else or browse all our products.
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-primary"
            >
              Clear Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Souvenirs;
