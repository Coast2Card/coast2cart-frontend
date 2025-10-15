import { useNavigate, useParams } from "react-router-dom";
import { useGetItemByIdQuery, useAddToCartMutation } from "../services/api";
import toast from "react-hot-toast";
import SellerSection from "../components/productDetail/SellerSection";
import RelatedProducts from "../components/productDetail/RelatedProducts";
import CartConfirmationModal from "../components/productDetail/CartConfirmationModal";
import StartChatButton from "../components/StartChatButton";
import bisugo from "../assets/images/bisugo.png";
import { useState } from "react";

// Fallback image for items without image

const ProductDetail = () => {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const [showCartModal, setShowCartModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showAnimation, setShowAnimation] = useState(false);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  // Get current user info
  const currentUser = (() => {
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  // Fetch item by ID from API
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetItemByIdQuery(itemId, {
    skip: !itemId, // Skip query if no itemId
  });

  // Debug logging
  console.log("ProductDetail Debug:", {
    itemId,
    product,
    isLoading,
    isError,
    error,
  });

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="max-w-8xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Gallery skeleton */}
            <div className="flex gap-5">
              <div className="hidden sm:flex flex-col gap-4 w-24">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 shadow-sm animate-pulse"
                  />
                ))}
              </div>
              <div className="flex-1">
                <div
                  className="rounded-lg overflow-hidden bg-gray-100 shadow-sm animate-pulse"
                  style={{ height: "540px" }}
                />
              </div>
            </div>

            {/* Details skeleton */}
            <div className="pt-2">
              <div className="h-8 w-3/4 bg-gray-200 rounded mb-3 animate-pulse" />
              <div className="h-3 w-1/2 bg-gray-200 rounded mb-6 animate-pulse" />
              <div className="h-8 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
              <hr className="border-base-300 mb-4" />
              <div className="space-y-3 mb-6">
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-56 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-60 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-stretch gap-3 mb-3">
                <div className="h-11 w-28 rounded-full bg-gray-100 border border-gray-200 animate-pulse" />
                <div className="h-11 flex-1 rounded-full bg-gray-200 animate-pulse" />
              </div>
              <div className="w-full h-11 rounded-full border border-gray-200 bg-gray-50 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !product) {
    return (
      <div className="bg-white">
        <div className="max-w-8xl mx-auto px-4 py-16">
          <h1 className="font-outfit font-bold text-2xl mb-2">
            Product not found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/seafood")}
          >
            Back to Seafood
          </button>
        </div>
      </div>
    );
  }

  // Use item image or fallback
  const imageSrc = product.image || product.imageUrl || bisugo;

  // Check if current user is the seller of this item
  const isCurrentUserSeller = () => {
    if (!currentUser || !product) return false;

    const currentUserId = currentUser._id || currentUser.id;
    const sellerId =
      product?.seller?._id ||
      product?.seller?.id ||
      product?.postedBy?._id ||
      product?.postedBy?.id ||
      product?.owner?._id ||
      product?.owner?.id;

    // Only block if the current user is the specific seller of this item
    return currentUserId === sellerId;
  };

  // Handle quantity changes
  const handleQuantityChange = (change) => {
    const availableQuantity = product.quantity || 0;
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= availableQuantity) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart with debug logs
  const handleAddToCart = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.log("[AddToCart] No auth token → redirecting to login");
      toast.error("Please log in to add items to your cart");
      navigate("/login");
      return;
    }

    // Check if quantity exceeds available quantity
    const availableQuantity = product.quantity || 0;
    if (quantity > availableQuantity) {
      toast.error(
        `Cannot add ${quantity} items. Only ${availableQuantity} available.`
      );
      return;
    }

    const payload = { itemId, quantity };
    console.log("[AddToCart] Submitting:", payload);
    try {
      const res = await addToCart(payload).unwrap();
      console.log("[AddToCart] Success:", res);
      setShowAnimation(true);
      setTimeout(() => {
        setShowCartModal(true);
        setShowAnimation(false);
      }, 800);
    } catch (e) {
      console.error("[AddToCart] Error:", e);
      toast.error(e?.data?.message || "Failed to add to cart");
    }
  };

  // Prepare product data for modal
  const modalProduct = {
    name: product.itemName || product.name,
    description: product.description || "Fresh seafood from Barangay Baybayon",
    price: product.itemPrice || product.price || 0,
    image: imageSrc,
  };

  // Prepare seller data for modal (you can customize this based on your data structure)
  const modalSeller = {
    name: "Juan Dela Cruz", // You can get this from product.seller or API
    profileImage: "/src/assets/icons/profile.png",
  };

  return (
    <div className="bg-white">
      <div className="max-w-8xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <div className="flex gap-5">
            <div className="hidden sm:flex flex-col gap-4 w-24">
              {[imageSrc, imageSrc].map((src, i) => (
                <div
                  key={i}
                  className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 shadow-sm"
                >
                  <img
                    src={src}
                    alt="thumb"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="flex-1">
              <div
                className="rounded-lg overflow-hidden bg-gray-100 shadow-sm"
                style={{ height: "540px" }}
              >
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="pt-2">
            <h1 className="font-outfit font-bold text-[28px] md:text-[36px] text-gray-900 mb-1">
              {product.itemName || product.name}
            </h1>
            <p className="text-gray-500 text-xs md:text-[11px] mb-3">
              {product.description || "Fresh seafood from Barangay Baybayon"}
            </p>
            <div className="text-success font-outfit font-bold text-2xl md:text-3xl mb-4">
              {product.priceDisplay ??
                (product.itemPrice != null
                  ? `₱${Number(product.itemPrice).toLocaleString()}/${
                      product.unit || ""
                    }`
                  : product.price != null
                  ? `₱${Number(product.price).toLocaleString()}`
                  : "")}
            </div>
            <hr className="border-base-300 mb-4" />

            <div className="space-y-2 text-sm text-gray-700 mb-6">
              <p className="text-sm text-gray-600">
                {product.itemName || product.name}
              </p>
              <div className="space-y-2 mt-2">
                <div className="flex items-start gap-2">
                  <span className="text-[12px]">📦</span>
                  <span>
                    {product.itemPrice != null
                      ? `₱${Number(product.itemPrice).toLocaleString()} per ${
                          product.unit || "unit"
                        }`
                      : "Price available on request"}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[12px]">🐟</span>
                  <span>Freshly caught and carefully handled</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[12px]">⚖️</span>
                  <span>
                    Available quantity: {product.quantity || 0}{" "}
                    {product.unit || "units"}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[12px]">📍</span>
                  <span>
                    {product.location
                      ? `Catch location: ${product.location}`
                      : "Pickup at: Baybayon Market / agreed location"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-stretch gap-3 mb-3">
                <div
                  className={`flex items-center justify-between rounded-full border h-11 px-3 min-w-[112px] select-none ${
                    (product.quantity || 0) <= 0
                      ? "border-gray-200 bg-gray-50"
                      : "border-gray-300"
                  }`}
                >
                  <button
                    className={`${
                      quantity <= 1 || (product.quantity || 0) <= 0
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1 || (product.quantity || 0) <= 0}
                  >
                    −
                  </button>
                  <span
                    className={`font-medium ${
                      (product.quantity || 0) <= 0
                        ? "text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {quantity}
                  </span>
                  <button
                    className={`${
                      quantity >= (product.quantity || 0) ||
                      (product.quantity || 0) <= 0
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => handleQuantityChange(1)}
                    disabled={
                      quantity >= (product.quantity || 0) ||
                      (product.quantity || 0) <= 0
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  className={`flex-1 h-11 rounded-full font-semibold disabled:opacity-60 ${
                    (product.quantity || 0) <= 0 || isCurrentUserSeller()
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-[#E4490F] hover:bg-[#d0410d] text-white"
                  }`}
                  onClick={handleAddToCart}
                  disabled={
                    isAdding ||
                    (product.quantity || 0) <= 0 ||
                    isCurrentUserSeller()
                  }
                >
                  {isAdding
                    ? "Adding..."
                    : isCurrentUserSeller()
                    ? "Your Item"
                    : (product.quantity || 0) <= 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>
              </div>
              {(() => {
                const sellerId =
                  product?.seller?._id ||
                  product?.seller?.id ||
                  product?.postedBy?._id ||
                  product?.postedBy?.id ||
                  product?.owner?._id ||
                  product?.owner?.id;
                const sellerName =
                  product?.seller?.username ||
                  product?.seller?.name ||
                  product?.postedBy?.username ||
                  product?.postedBy?.name ||
                  product?.owner?.username ||
                  product?.owner?.name ||
                  "Seller";

                // Don't show message button if current user is the seller
                if (isCurrentUserSeller()) {
                  return (
                    <button
                      className="w-full h-11 rounded-full border border-gray-300 text-gray-400 cursor-not-allowed font-medium"
                      disabled
                    >
                      This is your item
                    </button>
                  );
                }

                if (sellerId) {
                  return (
                    <StartChatButton
                      userId={sellerId}
                      username={sellerName}
                      className="w-full h-11 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-50 font-medium"
                      productInfo={{
                        id: product._id || product.id,
                        name: product.itemName || product.name,
                        description: product.description,
                        price: product.itemPrice || product.price,
                        image: product.image || product.imageUrl,
                        unit: product.unit,
                      }}
                    >
                      Message Seller
                    </StartChatButton>
                  );
                } else {
                  return (
                    <button
                      className="w-full h-11 rounded-full border border-gray-300 text-gray-400 cursor-not-allowed font-medium"
                      disabled
                    >
                      Seller Info Unavailable
                    </button>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Seller info and reviews */}
      <SellerSection itemId={itemId} product={product} />
      {/* Related products */}
      <RelatedProducts currentItemId={itemId} currentItem={product} />

      {/* Flying Animation */}
      {showAnimation && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div
            className="absolute w-24 h-24 rounded-xl overflow-hidden shadow-2xl"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              animation: "flyToCart 1.0s ease-out forwards",
            }}
          >
            <img
              src={imageSrc}
              alt={product?.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Cart Confirmation Modal */}
      <CartConfirmationModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        product={modalProduct}
        seller={modalSeller}
        quantity={quantity}
      />
    </div>
  );
};

export default ProductDetail;
