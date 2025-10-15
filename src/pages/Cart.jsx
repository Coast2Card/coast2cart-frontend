import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useClearCartMutation,
} from "../services/api";
import CartSkeleton from "../components/skeleton/CartSkeleton";

const CART_STORAGE_KEY = "cart_items";

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isBulkRemoving, setIsBulkRemoving] = useState(false);
  const { data: cartData, isLoading, isError, refetch } = useGetCartQuery();

  // Load cart items from API
  useEffect(() => {
    if (cartData && Array.isArray(cartData.items)) {
      setItems(cartData.items);
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData.items));
      } catch {}
    }
  }, [cartData]);

  const persist = (next) => {
    setItems(next);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
  };

  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [clearCartApi] = useClearCartMutation();

  const updateQty = async (id, delta) => {
    const current = items.find((i) => i.id === id);
    if (!current) return;
    const nextQty = Math.max(1, Math.min(99, (current.quantity || 1) + delta));
    const previous = items;
    setItems(
      items.map((it) => (it.id === id ? { ...it, quantity: nextQty } : it))
    );
    try {
      await updateCartItem({ itemId: id, quantity: nextQty }).unwrap();
      await refetch();
      toast.success("Quantity updated");
    } catch (e) {
      setItems(previous);
      toast.error(e?.data?.message || "Failed to update quantity");
    }
  };

  const removeItem = async (id) => {
    try {
      await removeFromCart(id).unwrap();
      toast.success("Removed from cart");
      await refetch();
    } catch (e) {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      await clearCartApi().unwrap();
      setItems([]);
      setSelectedItems(new Set());
      toast.success("Cart cleared");
      await refetch();
    } catch (e) {
      toast.error(e?.data?.message || "Failed to clear cart");
    }
  };

  const toggleItemSelection = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const selectAllItems = () => {
    setSelectedItems(new Set(items.map((item) => item.id)));
  };

  const deselectAllItems = () => {
    setSelectedItems(new Set());
  };

  const deleteSelectedItems = async () => {
    const ids = Array.from(selectedItems);
    console.log("[Cart] deleteSelectedItems submit:", ids);
    if (ids.length === 0) return;
    setIsBulkRemoving(true);
    let removed = 0;
    try {
      for (const id of ids) {
        try {
          console.log("[Cart] removeItem submit:", id);
          await removeFromCart(id).unwrap();
          removed += 1;
        } catch (err) {
          console.warn("[Cart] removeItem error (continuing):", err);
        }
      }
      setSelectedItems(new Set());
      await refetch();
      toast.success(`${removed} item(s) removed from cart`);
    } finally {
      setIsBulkRemoving(false);
    }
  };

  const selectedItemsList = useMemo(
    () => items.filter((item) => selectedItems.has(item.id)),
    [items, selectedItems]
  );

  const subtotal = useMemo(
    () =>
      selectedItemsList.reduce(
        (sum, it) => sum + (Number(it.price) || 0) * (it.quantity || 1),
        0
      ),
    [selectedItemsList]
  );
  const shipping = useMemo(
    () => (selectedItemsList.length > 0 ? 99 : 0),
    [selectedItemsList.length]
  );
  const total = subtotal + shipping;

  const serverItemCount = cartData?.itemCount ?? items.length;
  const serverSellerCount = cartData?.sellerCount ?? 0;
  const serverCartTotal = cartData?.cartTotal ?? 0;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-h-screen">
      <h1 className="text-xl sm:text-3xl font-bold text-black mb-2">
        Your Cart ({serverItemCount})
      </h1>
      <div className="mb-6 text-sm text-base-content/60 flex items-center gap-3">
        <span>
          Seller count:{" "}
          <span className="text-base-content font-medium">
            {serverSellerCount}
          </span>
        </span>
        <span className="opacity-30">|</span>
        <span>
          Cart total:{" "}
          <span className="text-base-content font-medium">
            ₱{Number(serverCartTotal).toFixed(2)}
          </span>
        </span>
      </div>

      {isLoading ? (
        <CartSkeleton />
      ) : isError ? (
        <div className="text-center py-20 bg-base-200 rounded-xl">
          <p className="text-black/70 mb-4">
            Failed to load cart. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="bg-primary text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-base-200 rounded-xl">
          <p className="text-black/70 mb-4">Your cart is empty.</p>
          <button
            onClick={() => navigate("/seafood")}
            className="bg-primary text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-primary/90"
          >
            Start shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Cart Controls */}
            <div className="mb-4 flex justify-between items-center">
              <div className="flex gap-4">
                <button
                  onClick={selectAllItems}
                  className="btn btn-sm btn-outline btn-primary"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAllItems}
                  className="text-sm text-base-content/60 hover:text-base-content/80  cursor-pointer transition-colors duration-200"
                >
                  Deselect All
                </button>
              </div>
              <div className="flex gap-2">
                {selectedItems.size > 0 && (
                  <button
                    onClick={deleteSelectedItems}
                    className="btn btn-sm btn-outline btn-error"
                    disabled={isBulkRemoving}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Remove Selected ({selectedItems.size})
                  </button>
                )}
              </div>
            </div>

            {/* Cart Items Header */}
            <div className="bg-base-100 text-base-content rounded-t-xl px-4 py-5">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1"></div>
                <div className="col-span-4 font-medium">Product</div>
                <div className="col-span-3 font-medium text-center">
                  Quantity
                </div>
                <div className="col-span-4 font-medium text-right">Total</div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="border border-base-300 rounded-b-xl bg-base-300 shadow-sm">
              {items.map((it, index) => (
                <div
                  key={it.id}
                  className={`grid grid-cols-12 gap-4 items-center p-4 py-6 ${
                    index !== items.length - 1 ? "border-b border-base-200" : ""
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div className="col-span-1 flex justify-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(it.id)}
                      onChange={() => toggleItemSelection(it.id)}
                      className="checkbox checkbox-primary"
                    />
                  </div>

                  {/* Product Image and Details */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-16 h-16 bg-base-200 rounded-lg flex-shrink-0">
                      {it.image ? (
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      ) : (
                        <div className="w-full h-full bg-base-200 rounded-lg"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base-content truncate">
                        {it.name}
                      </p>
                      <p className="text-base-content/60 text-sm">
                        ₱{Number(it.price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="col-span-3 flex justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(it.id, -1)}
                        className="w-8 h-8 rounded-full border-2 border-base-300 hover:bg-base-200 flex items-center justify-center text-base-content"
                      >
                        –
                      </button>
                      <input
                        type="number"
                        value={it.quantity || 1}
                        onChange={async (e) => {
                          const newQty = Math.max(
                            1,
                            Math.min(99, parseInt(e.target.value) || 1)
                          );
                          const previous = items;
                          persist(
                            items.map((item) =>
                              item.id === it.id
                                ? { ...item, quantity: newQty }
                                : item
                            )
                          );
                          try {
                            await updateCartItem({ itemId: it.id, quantity: newQty }).unwrap();
                            await refetch();
                          } catch (error) {
                            persist(previous);
                            toast.error(error?.data?.message || "Failed to update quantity");
                          }
                        }}
                        className="w-12 h-8 text-center border-2 border-base-300 rounded text-sm text-base-content [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="1"
                        max="99"
                      />
                      <button
                        onClick={() => updateQty(it.id, 1)}
                        className="w-8 h-8 rounded-full border-2 border-base-300 hover:bg-base-200 flex items-center justify-center text-base-content"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="col-span-4 text-right font-semibold text-base-content">
                    ₱{((Number(it.price) || 0) * (it.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <aside className="border border-base-300 rounded-xl bg-base-300 h-fit shadow-sm">
            {/* Order Summary Header */}
            <div className="bg-base-200 text-base-content rounded-t-xl px-4 py-5">
              <h2 className="font-medium">
                {selectedItemsList.length > 0
                  ? `Order Summary (${selectedItemsList.length} item${
                      selectedItemsList.length > 1 ? "s" : ""
                    })`
                  : "Order Summary"}
              </h2>
            </div>

            {/* Order Summary Content */}
            <div className="">
              <div className="space-y-6 p-4 text-sm">
                {selectedItemsList.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-base-content/70 mb-2">
                      No items selected
                    </p>
                    <p className="text-xs text-base-content/50">
                      Select items to see order summary
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-base-content">SUBTOTAL</span>
                      <span className="font-medium text-base-content">
                        ₱{subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content">DISCOUNT</span>
                      <span className="font-medium text-base-content">---</span>
                    </div>
                    <div className="h-px bg-base-200" />
                    <div className="flex justify-between text-base">
                      <span className="font-semibold text-base-content">
                        TOTAL
                      </span>
                      <span className="font-bold text-base-content">
                        ₱{total.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
