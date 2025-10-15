import React, { useState } from "react";
import {
  Phone,
  Lock,
  Eye,
  EyeSlash,
  XCircle,
  CheckCircle,
} from "@phosphor-icons/react";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../services/api";
import toast from "react-hot-toast";

const CompleteForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Contact Number, 2: OTP + New Password, 3: Success
  const [contactNo, setContactNo] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const [forgotPassword, { isLoading: isSendingOtp }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!contactNo.trim()) {
      setError("Please enter your contact number");
      return;
    }

    try {
      await forgotPassword({ contactNo: contactNo.trim() }).unwrap();
      setStep(2);
      toast.success("Reset code sent successfully!");
    } catch (err) {
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to send reset code. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }
    if (!newPassword.trim()) {
      setError("Please enter a new password");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetPassword({
        contactNo: contactNo.trim(),
        otp: otp.trim(),
        newPassword: newPassword.trim(),
        confirmPassword: confirmPassword.trim(),
      }).unwrap();

      // Success - show success state
      setStep(3);
      toast.success(
        "Password reset successfully! You can now login with your new password."
      );
    } catch (err) {
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to reset password. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setStep(1);
    setContactNo("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  const handleSuccessClose = () => {
    handleClose();
    // Optionally redirect to login page or show login modal
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
            {step === 1
              ? "FORGOT PASSWORD"
              : step === 2
              ? "RESET PASSWORD"
              : "SUCCESS"}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            // Step 1: Contact Number
            <>
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone size={32} className="text-primary" weight="bold" />
                </div>
                <p className="text-lg text-gray-700 mb-2 text-center">
                  Enter your contact number and we'll send you a code to reset
                  your password.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
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
                      disabled={isSendingOtp}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle size={20} className="text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="flex-1 bg-primary text-primary-content px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingOtp ? "Sending..." : "Send Reset Code"}
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
            </>
          )}

          {step === 2 && (
            // Step 2: OTP + New Password
            <>
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Lock size={32} className="text-primary" weight="bold" />
                </div>
                <p className="text-lg text-gray-700 mb-2 text-center">
                  Enter the code sent to{" "}
                  <span className="font-medium">
                    (+63 {contactNo.slice(0, 3)}
                    {"X".repeat(Math.max(0, contactNo.length - 5))}
                    {contactNo.slice(-2)})
                  </span>{" "}
                  and your new password.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="w-full h-12 sm:h-14 rounded-full border-2 border-black px-4 placeholder:text-base-content/40 text-center tracking-widest"
                    placeholder="------"
                    disabled={isResetting}
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-12 placeholder:text-base-content/40"
                      placeholder="Enter your new password"
                      disabled={isResetting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    >
                      {showPassword ? (
                        <EyeSlash size={22} />
                      ) : (
                        <Eye size={22} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-12 placeholder:text-base-content/40"
                      placeholder="Confirm your new password"
                      disabled={isResetting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    >
                      {showConfirmPassword ? (
                        <EyeSlash size={22} />
                      ) : (
                        <Eye size={22} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle size={20} className="text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="flex-1 bg-primary text-primary-content px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResetting ? "Resetting..." : "Reset Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-secondary text-primary px-6 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 3 && (
            // Step 3: Success
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle
                  size={32}
                  className="text-green-600"
                  weight="bold"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Password Reset Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                Your password has been successfully reset. You can now login
                with your new password.
              </p>
              <button
                onClick={handleSuccessClose}
                className="bg-primary text-primary-content px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteForgotPasswordModal;
