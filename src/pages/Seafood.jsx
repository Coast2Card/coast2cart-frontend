import seafoodBanner from "../assets/images/fisher_man.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetItemsQuery } from "../services/api";
import CategoriesFilter from "../components/seafood/CategoriesFilter";
import PriceRangeFilter from "../components/seafood/PriceRangeFilter";
// local fallback image for items without image
import bisugo from "../assets/images/bisugo.png";
// Footer comes from Layout; not needed here

const Seafood = () => {
  const [page, setPage] = useState(1);
  const [accumulatedItems, setAccumulatedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

  const { data, isLoading, isFetching, isError } = useGetItemsQuery({
    page,
    // Temporarily disable filters until backend supports them
    // ...(selectedCategory && { itemType: selectedCategory }),
  });
  const items = data && Array.isArray(data.items) ? data.items : [];
  const pagination = data?.pagination ?? null;

  // Debug logging
  console.log("Seafood Debug:", {
    selectedCategory,
    selectedPriceRanges,
    page,
    data,
    items,
    isLoading,
    isError,
    accumulatedItems: accumulatedItems.length,
  });

  useEffect(() => {
    if (page === 1) {
      setAccumulatedItems(items);
    } else if (items?.length) {
      setAccumulatedItems((prev) => [...prev, ...items]);
    }
  }, [items, page]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Don't reset data since filters aren't applied to API yet
    // setPage(1);
    // setAccumulatedItems([]);
  };

  const handlePriceRangeChange = (ranges) => {
    setSelectedPriceRanges(ranges);
    // Don't reset data since filters aren't applied to API yet
    // setPage(1);
    // setAccumulatedItems([]);
  };

  const totalItems = pagination?.totalItems ?? accumulatedItems.length;
  // const itemsPerPage = pagination?.itemsPerPage ?? (items.length || 0);
  const currentStart = accumulatedItems.length > 0 ? 1 : 0;
  const currentEnd = accumulatedItems.length;
  const hasMore = pagination ? page < (pagination.totalPages || 1) : false;

  return (
    <>
      <main className="relative overflow-x-hidden">
        {/* Seafood Banner */}
        <section className="w-full relative overflow-hidden h-[420px] sm:h-[500px] md:h-[560px] lg:h-[640px]">
          <div className="absolute inset-0 bg-primary opacity-100 z-10"></div>

          {/* Content Container */}
          <div className="relative z-20 h-full">
            <div className="h-full max-w-8xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center py-6 sm:py-8 md:py-0">
              {/* Left Side - Text Content */}
              <div className="w-full md:w-1/2 h-full flex items-center">
                <div className="text-white pt-6 sm:pt-8 md:pt-0">
                  <h1 className="font-outfit font-bold text-[24px] sm:text-[32px] md:text-[48px] lg:text-[64px] leading-tight md:leading-[1.15] lg:leading-[1.05] tracking-[0%] mb-4 sm:mb-5 md:mb-8 lg:mb-10">
                    <div className="mb-4">Discover the</div>
                    <div className="mb-4">Finest Seafood</div>
                    <div>Selection</div>
                  </h1>
                  <p className="font-inter font-normal text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-relaxed md:leading-[1.6] tracking-[0%] mb-4 sm:mb-5 md:mb-6 opacity-90 pb-8 md:pb-6">
                    From the shores of Barangay Baybayon to your table, our{" "}
                    <br />
                    fisherfolk bring in daily catches that are fresh, flavorful,{" "}
                    <br />
                    and carefully handled. Every purchase lets you enjoy the
                    <br />
                    best of the ocean while supporting our community's <br />
                    livelihood.
                  </p>
                </div>
              </div>

              {/* Right Side - Image */}
              <div className="hidden md:flex w-1/2 h-full items-center justify-end">
                <img
                  src={seafoodBanner}
                  alt="Fresh Seafood"
                  className="w-auto object-contain -mr-8 md:-mr-12 lg:-mr-16 xl:-mr-24 -mb-8 md:-mb-12 lg:-mb-14 md:h-[520px] lg:h-[720px] xl:h-[930px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* White Background Cover Section with Products */}
        <section className="relative z-30 bg-white py-16 -mt-20 md:-mt-36 lg:-mt-15">
          <div className="container mx-auto px-4 md:px-8  max-w-8xl">
            {/* Seafood Products Section */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar - Filters */}
              <div className="lg:w-1/4 space-y-8">
                <CategoriesFilter onCategoryChange={handleCategoryChange} />
                <PriceRangeFilter onPriceRangeChange={handlePriceRangeChange} />
              </div>

              {/* Right Side - Products */}
              <div className="lg:w-3/4">
                {/* Search and Info Bar */}
                <div className="bg-white p-6 mb-8">
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search...."
                        className="w-full pl-4 pr-16 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <button className="absolute right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="text-left">
                      <p className="font-inter font-bold text-gray-700 mb-1">
                        {isLoading && !accumulatedItems.length
                          ? "Loading items…"
                          : `Showing ${currentStart}-${currentEnd} of ${totalItems} item(s)`}
                      </p>
                      <p className="font-inter text-sm text-gray-500">
                        Below is the list of our available fresh fish for
                        today's catch.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Grid */}
                {isLoading && !accumulatedItems.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="block bg-white rounded-lg shadow-sm overflow-hidden"
                      >
                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                          <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : isError ? (
                  <div className="py-12 text-center text-red-600">
                    Failed to load items.
                  </div>
                ) : accumulatedItems.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    No items available.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {accumulatedItems.map((product) => (
                      <Link
                        key={product.id || product._id || product.name}
                        to={`/seafood/${product.id || product._id}`}
                        className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                          <img
                            src={product.imageUrl || product.image || bisugo}
                            alt={product.itemName || product.name || "Item"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-outfit font-bold text-lg text-success">
                              {product.priceDisplay ??
                                (product.itemPrice != null
                                  ? `₱${Number(
                                      product.itemPrice
                                    ).toLocaleString()}/${product.unit || ""}`
                                  : product.price != null
                                  ? `₱${Number(product.price).toLocaleString()}`
                                  : "")}
                            </span>
                          </div>
                          <h3 className="font-outfit font-bold text-lg text-gray-800 mb-2">
                            {product.itemName || product.name || "Unnamed Item"}
                          </h3>
                          {product.description && (
                            <p className="font-inter text-sm text-gray-600">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Load More Section */}
                {hasMore && (
                  <div className="text-center">
                    <p className="font-inter font-medium text-gray-600 mb-4">
                      Showing {currentEnd} of {totalItems} item(s)
                    </p>
                    <button
                      disabled={isFetching}
                      onClick={() => setPage((p) => p + 1)}
                      className="bg-secondary text-primary font-outfit font-bold px-8 py-3 rounded-full hover:bg-secondary/90 transition-colors disabled:opacity-60"
                    >
                      {isFetching ? "LOADING…" : "LOAD MORE >"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer is rendered by Layout */}
    </>
  );
};

export default Seafood;
