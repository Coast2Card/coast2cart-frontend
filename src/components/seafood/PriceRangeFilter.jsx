import React, { useState } from "react";

const PriceRangeFilter = ({ onPriceRangeChange }) => {
  const [selectedRanges, setSelectedRanges] = useState([]);

  const priceRanges = [
    { range: "P100.00 - P199.00", min: 100, max: 199 },
    { range: "P200.00 - P399.00", min: 200, max: 399 },
    { range: "P400.00 - P699.00", min: 400, max: 699 },
    { range: "P700.00 and above", min: 700, max: null },
  ];

  const handleRangeToggle = (range) => {
    setSelectedRanges((prev) => {
      const newRanges = prev.includes(range.range)
        ? prev.filter((r) => r !== range.range)
        : [...prev, range.range];

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
              checked={selectedRanges.includes(price.range)}
              onChange={() => handleRangeToggle(price)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="font-inter font-medium text-gray-700">
              {price.range}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PriceRangeFilter;
