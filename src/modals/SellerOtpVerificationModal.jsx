import React, { useState, useEffect, useRef } from "react";
import { useResendOtpMutation, useVerifyOtpMutation } from "../services/api";
import toast from "react-hot-toast";

const SellerOtpVerificationModal = ({ open, onClose, seller, onSuccess }) => {
  const [otp, setOtp] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [resendOtp] = useResendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();

  const autoSentRef = useRef(false);

  // Auto-send OTP when modal opens
  useEffect(() => {
    if (!open || !seller?.contactNo) return;
    if (autoSentRef.current) return;

    autoSentRef.current = true;
    handleResendOtp();
  }, [open, seller?.contactNo]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      autoSentRef.current = false;
      setOtp("");
      setCooldownSeconds(0);
    }
  }, [open]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  const handleResendOtp = async () => {
    if (!seller?.contactNo) {
      toast.error("Contact number not available");
      return;
    }

    setIsResending(true);
    try {
      await resendOtp({ contactNo: seller.contactNo }).unwrap();
      toast.success("OTP sent successfully");
      setCooldownSeconds(60);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send OTP");
      // Extract cooldown from error message if available
      const msg = error?.data?.message || "";
      const match = msg.match(/(\d+)\s*seconds?/i);
      if (match) {
        setCooldownSeconds(parseInt(match[1]));
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    if (!seller?.contactNo) {
      toast.error("Contact number not available");
      return;
    }

    setIsVerifying(true);
    try {
      await verifyOtp({ otp, contactNo: seller.contactNo }).unwrap();
      toast.success("OTP verified successfully");
      onSuccess?.();
      onClose?.();
    } catch (error) {
      toast.error(error?.data?.message || "Invalid OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-[92vw] sm:w-[480px] rounded-[24px] border-4 border-primary shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-primary-content py-6 px-6 text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-4 text-primary-content text-2xl leading-none hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-3xl font-extrabold tracking-wide">
            VERIFY SELLER OTP
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">
              {seller?.fullName || seller?.username || "Seller"}
            </h3>
            <p className="text-lg text-gray-700 mb-2">{seller?.contactNo}</p>
            <p className="text-sm text-gray-500">
              Enter the 6-digit OTP sent to the seller's phone number
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              className="w-full h-12 rounded-full border-2 border-black px-4 placeholder:text-base-content/40 tracking-widest text-center text-lg"
              placeholder="••••••"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(value);
              }}
              maxLength={6}
            />
          </div>

          {/* Resend OTP Button */}
          <div className="mb-6">
            <button
              onClick={handleResendOtp}
              disabled={cooldownSeconds > 0 || isResending}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                cooldownSeconds > 0 || isResending
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-secondary text-primary hover:bg-secondary/90"
              }`}
            >
              {isResending
                ? "Sending..."
                : cooldownSeconds > 0
                ? `Resend in ${cooldownSeconds}s`
                : "Resend OTP"}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleVerifyOtp}
              disabled={!otp || otp.length < 6 || isVerifying}
              className={`flex-1 px-6 py-3 rounded-full font-semibold transition-colors ${
                !otp || otp.length < 6 || isVerifying
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary text-primary-content hover:bg-primary/90"
              }`}
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-full font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOtpVerificationModal;
