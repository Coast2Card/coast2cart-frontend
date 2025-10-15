import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeSlash } from "@phosphor-icons/react";
import { useResetPasswordMutation } from "../../services/api";
import login_banner from "../../assets/images/login_banner.png";
import c2c_transparent from "../../assets/logos/c2c_transparent.png";
import toast from "react-hot-toast";

const useQuery = () => new URLSearchParams(useLocation().search);

const ResetPassword = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const contactNo = query.get("contactNo");
  const otp = query.get("otp");
  const isVerified = query.get("verified") === "true";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // Redirect if not verified, no contact number, or no OTP
  useEffect(() => {
    if (!isVerified || !contactNo || !otp) {
      navigate("/login");
    }
  }, [isVerified, contactNo, otp, navigate]);

  const validateForm = () => {
    if (!newPassword.trim()) {
      return "Please enter a new password";
    }
    if (newPassword.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (newPassword !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const response = await resetPassword({ 
        contactNo, 
        otp,
        newPassword: newPassword.trim(),
        confirmPassword: confirmPassword.trim()
      }).unwrap();
      
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      setFormError(
        err?.data?.message || 
        err?.message || 
        "Failed to reset password. Please try again."
      );
    }
  };

  if (!isVerified || !contactNo || !otp) {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen w-full font-outfit text-black bg-white flex flex-col md:flex-row">
      <div className="hidden md:block md:flex-1">
        <img
          className="h-full w-full object-cover object-left"
          src={login_banner}
        />
      </div>
      <section className="w-full md:max-w-[60vw] flex justify-center items-center px-4 md:px-6 py-8 min-h-screen md:min-h-0">
        <div className="w-full max-w-lg h-full flex flex-col justify-around items-center">
          <div className="flex flex-col text-center mb-6 sm:mb-0">
            <a href="/">
              <img
                src={c2c_transparent}
                alt="Coast2Cart Logo"
                className="w-48 md:w-80 mb-1 mx-auto cursor-pointer"
              />
            </a>
            <h3 className="uppercase font-bold text-3xl">Reset Password</h3>
            <p className="text-gray-600">
              Enter your new password for{" "}
              <span className="font-medium">
                (+63 {contactNo.slice(0, 3)}
                {"X".repeat(Math.max(0, contactNo.length - 5))}
                {contactNo.slice(-2)})
              </span>
            </p>
          </div>
          
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full gap-6 mt-2"
          >
            <div>
              <div className="label px-0 mb-[-19px]">
                <span className="label-text text-lg text-black font-normal">
                  New Password
                </span>
              </div>
              <label className="input input-lg rounded-2xl input-bordered border-2 border-black flex items-center gap-2 bg-white text-black w-full">
                <Lock className="h-6 w-6" weight="regular" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                  placeholder="Enter your new password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-black/80 hover:text-black focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlash className="h-6 w-6" weight="regular" />
                  ) : (
                    <Eye className="h-6 w-6" weight="regular" />
                  )}
                </button>
              </label>
            </div>

            <div>
              <div className="label px-0 mb-[-19px]">
                <span className="label-text text-lg text-black font-normal">
                  Confirm New Password
                </span>
              </div>
              <label className="input input-lg rounded-2xl input-bordered border-2 border-black flex items-center gap-2 bg-white text-black w-full">
                <Lock className="h-6 w-6" weight="regular" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                  placeholder="Confirm your new password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="text-black/80 hover:text-black focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeSlash className="h-6 w-6" weight="regular" />
                  ) : (
                    <Eye className="h-6 w-6" weight="regular" />
                  )}
                </button>
              </label>
            </div>

            {formError && (
              <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary rounded-full text-lg px-12 py-2.5 text-white uppercase cursor-pointer hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-5 flex flex-col items-center justify-center w-full gap-1">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-primary hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ResetPassword;
