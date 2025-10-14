import React, { useState } from "react";

const PriceRangeFilter = ({ onPriceRangeChange }) => {
  const [selectedRanges, setSelectedRanges] = useState([]);

  // Backend priceRange tokens expected by /api/items?priceRange=...
  // Allowed tokens: 100-199 | 200-399 | 400-699 | 700+
  const priceRanges = [
    { label: "₱100 - ₱199", value: "100-199" },
    { label: "₱200 - ₱399", value: "200-399" },
    { label: "₱400 - ₱699", value: "400-699" },
    { label: "₱700+", value: "700+" },
  ];

  const handleRangeToggle = (range) => {
    setSelectedRanges((prev) => {
      const newRanges = prev.includes(range.value)
        ? prev.filter((r) => r !== range.value)
        : [...prev, range.value];

      // Notify parent component of selected ranges
      onPriceRangeChange?.(newRanges);
      return newRanges;
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
      <h3 className="font-outfit font-bold text-xl text-primary mb-4">
        Price Range
      </h3>
      <div className="space-y-3">
        {priceRanges.map((price, index) => (
          <label
            key={index}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedRanges.includes(price.value)}
              onChange={() => handleRangeToggle(price)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="font-inter font-medium text-gray-700">
              {price.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PriceRangeFilter;
