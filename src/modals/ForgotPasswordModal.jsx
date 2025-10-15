import React, { useState } from "react";
import { Phone, XCircle } from "@phosphor-icons/react";
import { useForgotPasswordMutation } from "../services/api";
import { useNavigate } from "react-router-dom";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [contactNo, setContactNo] = useState("");
  const [error, setError] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!contactNo.trim()) {
      setError("Please enter your contact number");
      return;
    }

    try {
      const result = await forgotPassword({
        contactNo: contactNo.trim(),
      }).unwrap();
      
      // Close modal and redirect to OTP verification for password reset
      onClose();
      navigate(
        `/verify-otp?contactNo=${encodeURIComponent(
          contactNo.trim()
        )}&otpSent=1&forgotPassword=true`
      );
    } catch (err) {
      setError(
        err?.data?.message ||
          err?.message ||
          "Failed to send reset message. Please try again."
      );
    }
  };

  const handleClose = () => {
    setContactNo("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={handleClose} />
      <div className="relative bg-white w-[92vw] sm:w-[480px] rounded-[24px] border-4 border-primary shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-primary-content py-6 px-6 text-center">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-5 top-4 text-primary-content text-2xl leading-none hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-3xl font-extrabold tracking-wide">
            FORGOT PASSWORD
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Phone size={32} className="text-primary" weight="bold" />
            </div>
            <p className="text-lg text-gray-700 mb-2 text-center">
              Enter your contact number and we'll send you a message to
              reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-lg font-semibold mb-2">
                Contact Number
              </label>
              <div className="relative">
                <Phone
                  size={22}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                />
                <input
                  type="tel"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-4 placeholder:text-base-content/40"
                  placeholder="Enter your contact number (9XXXXXXXXX)"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <XCircle size={20} className="text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary text-primary-content px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send Reset Code"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-secondary text-primary px-6 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
