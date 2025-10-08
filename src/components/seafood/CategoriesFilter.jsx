import React, { useState } from "react";

const CategoriesFilter = ({ onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { name: "All", count: 0 },
    { name: "Fresh Fish", count: 0 },
    { name: "Shrimp & Prawns", count: 0 },
    { name: "Crabs", count: 0 },
    { name: "Squid & Octopus", count: 0 },
    { name: "Shellfish", count: 0 },
    { name: "Seaweed", count: 0 },
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.name);
    onCategoryChange?.(category.name === "All" ? null : category.name);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
      <h3 className="font-outfit font-bold text-xl text-primary mb-4">
        Categories
      </h3>
      <div className="space-y-3">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category)}
            className={`flex items-center justify-between cursor-pointer transition-colors ${
              selectedCategory === category.name
                ? "text-primary font-semibold"
                : "hover:text-primary"
            }`}
          >
            <span className="font-inter font-medium text-gray-700">
              {category.name}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">({category.count})</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  selectedCategory === category.name ? "rotate-180" : ""
                }`}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesFilter;
