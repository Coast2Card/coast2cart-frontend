import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const CART_STORAGE_KEY = "cart_items";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod",
    notes: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Get selected items from cart page or all items if coming directly
    const selectedItemsFromCart = location.state?.selectedItems || new Set();
    setSelectedItems(selectedItemsFromCart);

    // Load cart items
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(parsed);
    } catch {
      setItems([]);
    }

    // Load user data if logged in
    const currentUser = (() => {
      try {
        const raw = localStorage.getItem("auth_user");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();

    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
      }));
    }
  }, [location.state]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedItemsList.length === 0) {
      toast.error("No items selected for checkout");
      return;
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Remove selected items from cart
      const remainingItems = items.filter(
        (item) => !selectedItems.has(item.id)
      );
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(remainingItems));

      toast.success("Order placed successfully!");
      navigate("/", {
        state: {
          orderSuccess: true,
          orderItems: selectedItemsList.length,
        },
      });
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedItemsList.length === 0) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-base-content mb-4">
            No items to checkout
          </h1>
          <p className="text-base-content/70 mb-6">
            Please select items from your cart first.
          </p>
          <button onClick={() => navigate("/cart")} className="btn btn-primary">
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-6">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-base-300 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-base-content mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-base-300 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-base-content mb-4">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="textarea textarea-bordered w-full"
                    placeholder="Enter your complete address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-base-content mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-base-300 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-base-content mb-4">
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleInputChange}
                    className="radio radio-primary"
                  />
                  <div>
                    <div className="font-medium text-base-content">
                      Cash on Delivery
                    </div>
                    <div className="text-sm text-base-content/70">
                      Pay when your order arrives
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="gcash"
                    checked={formData.paymentMethod === "gcash"}
                    onChange={handleInputChange}
                    className="radio radio-primary"
                  />
                  <div>
                    <div className="font-medium text-base-content">GCash</div>
                    <div className="text-sm text-base-content/70">
                      Pay via GCash mobile wallet
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-base-300 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-base-content mb-4">
                Order Notes
              </h2>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="textarea textarea-bordered w-full"
                placeholder="Any special instructions for your order?"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="btn btn-outline flex-1"
              >
                Back to Cart
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className={`btn btn-primary flex-1 ${
                  isProcessing ? "loading" : ""
                }`}
              >
                {isProcessing
                  ? "Processing..."
                  : `Place Order - ₱${total.toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-base-300 rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Order Summary ({selectedItemsList.length} item
              {selectedItemsList.length > 1 ? "s" : ""})
            </h2>

            {/* Selected Items */}
            <div className="space-y-3 mb-6">
              {selectedItemsList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-base-100 rounded-lg"
                >
                  <div className="w-12 h-12 bg-base-200 rounded-lg flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
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
                    <p className="font-medium text-base-content truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-base-content/70">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-base-content">
                    ₱
                    {((Number(item.price) || 0) * (item.quantity || 1)).toFixed(
                      2
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="space-y-3 border-t border-base-200 pt-4">
              <div className="flex justify-between">
                <span className="text-base-content">Subtotal</span>
                <span className="font-medium">₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content">Discount</span>
                <span className="font-medium text-base-content">---</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content">Shipping</span>
                <span className="font-medium">₱{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-base-200 pt-3">
                <span className="text-base-content">Total</span>
                <span className="text-primary">₱{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
