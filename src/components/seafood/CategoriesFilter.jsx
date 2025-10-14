import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useGetItemsQuery } from "../../services/api";

const CategoriesFilter = ({ onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch counts per category by requesting each category once.
  // Backend returns categoryTotalItems as a number for the requested category.
  const { data: freshFish } = useGetItemsQuery({ itemType: "seafood", category: "Fresh Fish" });
  const { data: shrimp } = useGetItemsQuery({ itemType: "seafood", category: "Shrimp & Prawns" });
  const { data: crabs } = useGetItemsQuery({ itemType: "seafood", category: "Crabs" });
  const { data: squid } = useGetItemsQuery({ itemType: "seafood", category: "Squid & Octopus" });
  const { data: shellfish } = useGetItemsQuery({ itemType: "seafood", category: "Shellfish" });
  const { data: seaweed } = useGetItemsQuery({ itemType: "seafood", category: "Seaweed" });
  const categories = useMemo(
    () => [
      { name: "Fresh Fish", count: freshFish?.categoryTotalItems || 0 },
      { name: "Shrimp & Prawns", count: shrimp?.categoryTotalItems || 0 },
      { name: "Crabs", count: crabs?.categoryTotalItems || 0 },
      { name: "Squid & Octopus", count: squid?.categoryTotalItems || 0 },
      { name: "Shellfish", count: shellfish?.categoryTotalItems || 0 },
      { name: "Seaweed", count: seaweed?.categoryTotalItems || 0 },
    ],
    [freshFish, shrimp, crabs, squid, shellfish, seaweed]
  );

  const handleCategoryClick = (category) => {
    setSelectedCategory((prev) => (prev === category.name ? null : category.name));
    // Intentionally not notifying parent; main grid should not change
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
      <h3 className="font-outfit font-bold text-xl text-primary mb-4">
        Categories
      </h3>
      <div className="space-y-3">
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category.name;
          const itemsForCategory =
            category.name === "Fresh Fish"
              ? freshFish?.items || []
              : category.name === "Shrimp & Prawns"
              ? shrimp?.items || []
              : category.name === "Crabs"
              ? crabs?.items || []
              : category.name === "Squid & Octopus"
              ? squid?.items || []
              : category.name === "Shellfish"
              ? shellfish?.items || []
              : category.name === "Seaweed"
              ? seaweed?.items || []
              : [];
          return (
            <div key={index} className="space-y-2">
              <div
                onClick={() => handleCategoryClick(category)}
                className={`flex items-center justify-between cursor-pointer transition-colors ${
                  isSelected ? "text-primary font-semibold" : "hover:text-primary"
                }`}
              >
                <span className="font-inter font-medium text-gray-700">
                  {category.name}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">({category.count})</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      isSelected ? "rotate-180" : ""
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
              {isSelected && itemsForCategory.length > 0 && (
                <ul className="space-y-1 max-h-48 overflow-auto bg-white rounded-lg border border-gray-100 p-3">
                  {itemsForCategory.slice(0, 10).map((it) => {
                    const itemId = it._id || it.id;
                    return (
                      <li key={itemId} className="text-sm">
                        <Link
                          to={`/seafood/${itemId}`}
                          className="text-gray-600 hover:text-primary hover:underline"
                        >
                          {it.itemName || it.name}
                        </Link>
                      </li>
                    );
                  })}
                  {itemsForCategory.length > 10 && (
                    <li>
                      <button
                        type="button"
                        className="text-xs text-primary hover:underline"
                        onClick={() => onCategoryChange?.(category.name)}
                      >
                        Show more
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesFilter;
