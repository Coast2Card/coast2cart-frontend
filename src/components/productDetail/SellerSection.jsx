import React from "react";

const reviews = [
  {
    name: "Claudine Co",
    time: "2 days ago",
    text: "Fresh bangus! Very good quality and the seller was very accommodating. Will definitely buy again!",
  },
  {
    name: "Jammy Cruz",
    time: "1 week ago",
    text: "Best seafood in Baybayon! Always fresh and reasonably priced. Highly recommended!",
  },
  {
    name: "Gela Alonte",
    time: "2 weeks ago",
    text: "Good service and fresh catch. The shrimp was excellent for my family dinner.",
  },
];

const StarRow = () => (
  <div className="flex gap-1 text-[#FFB400]">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i}>★</span>
    ))}
  </div>
);

const SellerSection = () => {
  return (
    <section className="w-full">
      {/* Top Seller banner */}
      <div className="max-w-8xl mx-auto px-4 md:px-8">
        <div className="bg-primary text-white rounded-t-[15px] rounded-b-[15px] relative z-10 px-4 md:px-6 lg:px-8 py-7 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-yellow-300 flex items-center justify-center text-primary font-bold">
              JD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-outfit font-semibold">
                  Juan Dela Cruz
                </span>
                <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded">
                  ✓
                </span>
              </div>
              <div className="mt-1">
                <span className="inline-block text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>
          <button className="rounded-full bg-white text-gray-900 hover:bg-gray-100 px-5 py-2 text-sm font-semibold">
            VIEW SHOP
          </button>
        </div>
      </div>

      {/* Reviews strip background */}
      <div className="max-w-8xl mx-auto px-4 md:px-8">
        <div className="bg-secondary-light rounded-t-[12px] -mt-6 pt-8 pb-8 px-4 md:px-8 relative z-0">
          <h3 className="font-outfit font-bold text-lg text-primary mb-4">
            Seller Reviews
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
            {reviews.map((r, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-outfit font-semibold text-gray-900">
                    {r.name}
                  </div>
                  <div className="text-xs text-gray-500">{r.time}</div>
                </div>
                <StarRow />
                <hr className="my-3 border-gray-200" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerSection;
