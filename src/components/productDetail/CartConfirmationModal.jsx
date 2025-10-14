import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetItemByIdQuery, useUpdateCartItemMutation, useAddToCartMutation } from "../../services/api";

const CartConfirmationModal = ({ isOpen, onClose, product, seller, quantity: initialQuantity = 1 }) => {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const effectiveItemId = itemId || product?.id;
  const { data: itemFromRoute } = useGetItemByIdQuery(effectiveItemId, { skip: !effectiveItemId });
  const [quantity, setQuantity] = useState(initialQuantity);
  const [updateCartItem] = useUpdateCartItemMutation();
  const [addToCart] = useAddToCartMutation();
  const [arrowPosition, setArrowPosition] = useState({ right: "5rem" });
  const modalRef = useRef(null);

  // Function to calculate and update arrow position
  const updateArrowPosition = () => {
    const cartButton = document.querySelector('a[href="/cart"] img');
    const modal = modalRef.current;

    if (cartButton && modal) {
      const cartRect = cartButton.getBoundingClientRect();
      const modalRect = modal.getBoundingClientRect();

      // Calculate the center of the cart button
      const cartCenterX = cartRect.left + cartRect.width / 2;

      // Calculate the distance from the right edge of the modal to the cart center
      const modalRightEdge = modalRect.right;
      const distanceFromModalRight = modalRightEdge - cartCenterX;

      // Fine-tune adjustment to center the arrow on the cart button
      const fineTuneOffset = -9; // Adjust this value to move arrow left/right
      const finalPosition = distanceFromModalRight + fineTuneOffset;

      // Position the arrow to point exactly at the cart button center
      setArrowPosition({ right: `${finalPosition}px` });
    }
  };

  // Update quantity when initialQuantity prop changes
  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  useEffect(() => {
    if (isOpen) {
      // Wait for modal to render, then calculate position
      setTimeout(updateArrowPosition, 100);

      // Add resize listener to recalculate position when window resizes
      const handleResize = () => {
        updateArrowPosition();
      };

      window.addEventListener("resize", handleResize);

      // Cleanup function to remove event listener
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isOpen]);

  // defer early return until after hooks are declared to keep hook order stable

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleRemove = async () => {
    try {
      // If item already exists in cart, set quantity to 0 by using update endpoint semantics
      if (product?.id) {
        await updateCartItem({ itemId: product.id, quantity: 0 }).unwrap();
      }
    } catch {}
    onClose();
  };

  const handleViewCart = async () => {
    // Ensure cart reflects selected quantity before navigating
    try {
      if (product?.id) {
        if (quantity <= 0) {
          await updateCartItem({ itemId: product.id, quantity: 0 }).unwrap();
        } else {
          // Try to update, if fails assume add then update
          try {
            await updateCartItem({ itemId: product.id, quantity }).unwrap();
          } catch {
            await addToCart({ itemId: product.id, quantity }).unwrap();
          }
        }
      }
    } catch {}
    navigate("/cart");
    onClose();
  };

  const deriveUnitPrice = () => {
    if (typeof product?.price === "number" && product.price > 0) return product.price;
    if (product?.price != null) {
      const parsed = parseFloat(String(product.price).replace(/[^0-9.]/g, ""));
      if (!Number.isNaN(parsed) && parsed > 0) return parsed;
    }
    if (typeof product?.itemPrice === "number" && product.itemPrice > 0) return product.itemPrice;
    if (product?.formattedPrice) {
      const parsed = parseFloat(String(product.formattedPrice).replace(/[^0-9.]/g, ""));
      if (!Number.isNaN(parsed) && parsed > 0) return parsed;
    }
    if (product?.priceDisplay) {
      const parsed = parseFloat(String(product.priceDisplay).replace(/[^0-9.]/g, ""));
      if (!Number.isNaN(parsed) && parsed > 0) return parsed;
    }
    // Fallbacks from route item details
    if (typeof itemFromRoute?.itemPrice === "number" && itemFromRoute.itemPrice > 0) return itemFromRoute.itemPrice;
    if (itemFromRoute?.formattedPrice) {
      const parsed = parseFloat(String(itemFromRoute.formattedPrice).replace(/[^0-9.]/g, ""));
      if (!Number.isNaN(parsed) && parsed > 0) return parsed;
    }
    return 0;
  };
  const unitPrice = deriveUnitPrice();
  const totalPrice = unitPrice * quantity;

  // Determine max available quantity from product or route item
  const deriveMaxQuantity = () => {
    const direct = Number(product?.quantity);
    if (!Number.isNaN(direct) && direct > 0) return direct;
    const fromRoute = Number(itemFromRoute?.quantity);
    if (!Number.isNaN(fromRoute) && fromRoute > 0) return fromRoute;
    if (product?.formattedQuantity) {
      const parsed = parseFloat(String(product.formattedQuantity).replace(/[^0-9.]/g, ""));
      if (!Number.isNaN(parsed) && parsed > 0) return Math.floor(parsed);
    }
    if (itemFromRoute?.formattedQuantity) {
      const parsed = parseFloat(String(itemFromRoute.formattedQuantity).replace(/[^0-9.]/g, ""));
      if (!Number.isNaN(parsed) && parsed > 0) return Math.floor(parsed);
    }
    return undefined; // unknown
  };
  const maxQuantity = deriveMaxQuantity();

  // Clamp quantity if max is known
  useEffect(() => {
    if (maxQuantity && quantity > maxQuantity) {
      setQuantity(maxQuantity);
    }
  }, [maxQuantity]);

  return isOpen ? (
    <div
      className="fixed inset-0 flex justify-end items-start pt-20 pr-10 z-50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl p-6 w-[450px] max-w-[90vw] shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Arrow pointing to cart button - dynamically positioned to point exactly at cart */}
        <div
          className="absolute -top-2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200"
          style={{ right: arrowPosition.right }}
        ></div>
        {/* Seller Information */}
        <div className="flex items-center mb-5">
          <img
            src={seller?.profileImage || "/src/assets/icons/profile.png"}
            alt={seller?.name}
            className="w-12 h-12 rounded-full object-cover mr-3"
          />
          <div className="flex items-center gap-2">
            <span className="text-base font-medium text-gray-800">
              {seller?.name || product?.seller?.username || itemFromRoute?.seller?.username || "Juan Dela Cruz"}
            </span>
            <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              ✓
            </span>
          </div>
        </div>

        {/* Product Information */}
        <div className="flex gap-4 mb-5">
          <img
            src={product?.image || "/src/assets/images/bangus.png"}
            alt={product?.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {product?.name || "Bangus"}
            </h3>
            <p className="text-sm text-gray-600 mb-2 leading-relaxed">
              {product?.description || "Fresh Chilled Milkfish All Sizes"}
            </p>
            <p className="text-base font-bold text-gray-800">
              P{product?.price || 289}
            </p>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button
              className="bg-white border-none px-3 py-2 cursor-pointer text-base font-bold text-gray-800 hover:bg-gray-50 transition-colors"
              onClick={() => handleQuantityChange(-1)}
            >
              -
            </button>
            <span className="px-4 py-2 border-l border-r border-gray-300 text-base font-medium min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              className="bg-white border-none px-3 py-2 cursor-pointer text-base font-bold text-gray-800 hover:bg-gray-50 transition-colors"
              onClick={() => {
                if (maxQuantity && quantity >= maxQuantity) return;
                handleQuantityChange(1);
              }}
            >
              +
            </button>
          </div>
          {maxQuantity && (
            <span className="ml-3 text-xs text-gray-500">Max {maxQuantity}</span>
          )}
          <button
            className="bg-none border-none text-orange-500 text-sm cursor-pointer underline p-0 hover:text-orange-600"
            onClick={handleRemove}
          >
            Remove
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-5"></div>

        {/* Total Section */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-base font-medium text-gray-800">Total</span>
          <span className="text-lg font-bold text-green-600">
            P{totalPrice.toFixed(2)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            className="flex-1 bg-yellow-400 text-gray-800 border-none px-6 py-3 rounded-lg text-base font-semibold cursor-pointer hover:bg-yellow-500 transition-colors"
            onClick={handleViewCart}
          >
            View Cart
          </button>
          <button
            className="flex-1 bg-gray-100 text-gray-800 border border-gray-300 px-6 py-3 rounded-lg text-base font-medium cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={onClose}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default CartConfirmationModal;
