import React from "react";

const CartSkeleton = () => {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-h-screen">
      <div className="h-7 w-48 bg-base-200 rounded mb-2" />
      <div className="flex items-center gap-3 mb-6">
        <div className="h-4 w-28 bg-base-200 rounded" />
        <span className="opacity-30">|</span>
        <div className="h-4 w-32 bg-base-200 rounded" />
        <div className="ml-auto h-7 w-20 bg-base-200 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-base-100 rounded-t-xl px-4 py-5">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1" />
              <div className="col-span-4 h-4 bg-base-200 rounded" />
              <div className="col-span-3 h-4 bg-base-200 rounded mx-auto w-24" />
              <div className="col-span-4 h-4 bg-base-200 rounded ml-auto w-24" />
            </div>
          </div>
          <div className="border border-base-300 rounded-b-xl bg-base-300 shadow-sm">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`grid grid-cols-12 gap-4 items-center p-4 py-6 ${
                  i !== 2 ? "border-b border-base-200" : ""
                }`}
              >
                <div className="col-span-1 flex justify-center">
                  <div className="w-5 h-5 bg-base-200 rounded" />
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-16 h-16 bg-base-200 rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <div className="h-4 w-40 bg-base-200 rounded mb-2" />
                    <div className="h-3 w-24 bg-base-200 rounded" />
                  </div>
                </div>
                <div className="col-span-3 flex justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-base-200 rounded-full" />
                    <div className="w-12 h-8 bg-base-200 rounded" />
                    <div className="w-8 h-8 bg-base-200 rounded-full" />
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="h-4 w-24 bg-base-200 rounded ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="border border-base-300 rounded-xl bg-base-300 h-fit shadow-sm">
          <div className="bg-base-200 rounded-t-xl px-4 py-5">
            <div className="h-4 w-32 bg-base-200 rounded" />
          </div>
          <div className="p-4 space-y-6">
            <div className="flex justify-between">
              <div className="h-3 w-20 bg-base-200 rounded" />
              <div className="h-3 w-16 bg-base-200 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 w-20 bg-base-200 rounded" />
              <div className="h-3 w-8 bg-base-200 rounded" />
            </div>
            <div className="h-px bg-base-200" />
            <div className="flex justify-between">
              <div className="h-4 w-16 bg-base-200 rounded" />
              <div className="h-4 w-24 bg-base-200 rounded" />
            </div>
            <div className="mt-2 h-10 w-full bg-base-200 rounded-b-xl" />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartSkeleton;
