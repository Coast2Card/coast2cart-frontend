import React from "react";
import { Link } from "react-router-dom";
import { useGetItemsQuery } from "../../services/api";
import bisugo from "../../assets/images/bisugo.png";

const RelatedProducts = ({ currentItemId }) => {
  const { data, isLoading, isError, isFetching } = useGetItemsQuery({
    limit: 12,
  });
  const items = Array.isArray(data?.items) ? data.items : [];
  const related = items
    .filter((i) => (i.id || i._id) !== currentItemId)
    .slice(0, 4);

  return (
    <section className="w-full">
      <div className="max-w-8xl mx-auto px-4 md:px-8 py-8">
        <h3 className="font-outfit font-bold text-xl text-primary mb-4">
          You May Also Like
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {isLoading && related.length === 0 ? (
            Array.from({ length: 4 }).map((_, i) => (
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
            ))
          ) : isError || related.length === 0 ? null : (
            <>
              {related.map((item) => (
                <Link
                  key={item.id || item._id}
                  to={`/seafood/${item.id || item._id}`}
                  className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={item.imageUrl || item.image || bisugo}
                      alt={item.itemName || item.name || "Item"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-outfit font-bold text-lg text-success">
                        {item.priceDisplay ??
                          (item.itemPrice != null
                            ? `₱${Number(item.itemPrice).toLocaleString()}/${
                                item.unit || ""
                              }`
                            : item.price != null
                            ? `₱${Number(item.price).toLocaleString()}`
                            : "")}
                      </span>
                    </div>
                    <div className="font-outfit font-bold text-lg text-gray-800">
                      {item.itemName || item.name}
                    </div>
                    {item.description && (
                      <div className="text-[11px] text-gray-500">
                        {item.description}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
              {isFetching &&
                Array.from({ length: Math.max(0, 4 - related.length) }).map(
                  (_, i) => (
                    <div
                      key={`sk-${i}`}
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
                  )
                )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
