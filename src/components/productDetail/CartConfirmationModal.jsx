import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CartConfirmationModal = ({ isOpen, onClose, product, seller }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
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

  if (!isOpen) return null;

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleRemove = () => {
    // Handle remove item logic
    onClose();
  };

  const handleViewCart = () => {
    // Navigate to cart page and close modal
    navigate("/cart");
    onClose();
  };

  const totalPrice = (product?.price || 0) * quantity;

  return (
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
              {seller?.name || "Juan Dela Cruz"}
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
              onClick={() => handleQuantityChange(1)}
            >
              +
            </button>
          </div>
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
  );
};

export default CartConfirmationModal;
