import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useResendOtpMutation, useVerifyOtpMutation } from "../../services/api";
import toast from "react-hot-toast";
import login_banner from "../../assets/images/login_banner.png";
import c2c_transparent from "../../assets/logos/c2c_transparent.png";

const useQuery = () => new URLSearchParams(useLocation().search);

const OtpVerify = () => {
  const query = useQuery();
  const navigate = useNavigate();
  // TEMP: use dummy contact to preview masked format; replace with query param after review
  const initialContact = query.get("contactNo") || "9123456789";
  const isForgotPassword = query.get("forgotPassword") === "true";

  const [contactNo] = useState(initialContact);
  const [otp, setOtp] = useState("");
  const [formError, setFormError] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const sent = params.get("otpSent");
    const cooldown = parseInt(params.get("otpCooldown") || "0", 10);
    if (!Number.isNaN(cooldown) && cooldown > 0) return cooldown;
    return sent ? 300 : 0;
  });

  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: resending }] = useResendOtpMutation();

  const contactValid = useMemo(() => /^9\d{9}$/.test(contactNo), [contactNo]);
  const otpValid = useMemo(() => /^\d{6}$/.test(otp), [otp]);

  useEffect(() => {}, [initialContact]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!otpValid) return setFormError("Enter the 6-digit OTP");
    try {
      const res = await verifyOtp({ contactNo, otp }).unwrap();
      if (res?.success === false) {
        setFormError(res?.message || "Verification failed");
        return;
      }

      if (isForgotPassword) {
        // For forgot password flow, just verify OTP and redirect to reset password page
        toast.success(
          "OTP verified successfully. You can now reset your password."
        );
        navigate(
          `/reset-password?contactNo=${encodeURIComponent(
            contactNo
          )}&otp=${encodeURIComponent(otp)}&verified=true`
        );
        return;
      }

      // Regular account verification flow
      const token = res?.data?.token;
      const user = res?.data?.user;
      const role = user?.role;
      if (role === "seller") {
        toast.success(
          "Your seller account is now pending approval. Please wait for administrator review."
        );
        navigate("/login");
        return;
      }
      if (token) {
        localStorage.setItem("auth_token", token);
      }
      if (user) {
        localStorage.setItem("auth_user", JSON.stringify(user));
      }
      const displayName = user?.username || user?.firstName || "";

      toast.success(
        displayName
          ? `Account verified successfully. Welcome, ${displayName}`
          : "Account verified successfully"
      );
      navigate("/");
    } catch (err) {
      const apiMessage = err?.data?.message || err?.error;
      setFormError(apiMessage || "Verification failed");
    }
  };

  const handleResend = async () => {
    setFormError("");
    if (!contactValid) return setFormError("Missing or invalid contact number");
    try {
      const res = await resendOtp({ contactNo }).unwrap();
      if (res?.success === false) {
        setFormError(res?.message || "Resend failed");
        return;
      }
      toast.success(res?.message || "OTP resent successfully");
      setCooldownSeconds(300);
    } catch (err) {
      const apiMessage = err?.data?.message || err?.error;
      setFormError(apiMessage || "Resend failed");
    }
  };

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const id = setInterval(() => {
      setCooldownSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [cooldownSeconds]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(1, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <main className="min-h-screen w-full font-outfit text-black bg-white flex flex-col md:flex-row">
      <div className="hidden md:block md:flex-1">
        <img
          className="h-full w-full object-cover object-left"
          src={login_banner}
        />
      </div>
      <section className="w-full md:max-w-[60vw] flex justify-center items-center px-4 md:px-6 py-8 min-h-screen md:min-h-0">
        <div className=" w-full max-w-lg h-full flex flex-col justify-around items-center">
          <div className="flex flex-col text-center mb-6 sm:mb-0">
            <a href="/">
              <img
                src={c2c_transparent}
                alt="Coast2Cart Logo"
                className="w-48 md:w-80 mb-1 mx-auto cursor-pointer"
              />
            </a>
            <h3 className="uppercase font-bold text-3xl">Verify OTP</h3>
            <p>
              Enter the 6-digit code sent to your phone
              {contactNo && (
                <>
                  {" "}
                  <span className="font-medium">
                    (+63 {contactNo.slice(0, 3)}
                    {"X".repeat(Math.max(0, contactNo.length - 5))}
                    {contactNo.slice(-2)})
                  </span>
                </>
              )}
            </p>
          </div>
          <form
            onSubmit={handleVerify}
            className="flex flex-col w-full gap-4 mt-2"
          >
            {/* OTP only; contact is shown masked above */}
            <label className="input input-lg rounded-2xl input-bordered border-2 border-black flex items-center gap-2 bg-white text-black w-full">
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full tracking-widest text-center"
                placeholder="------"
                inputMode="numeric"
                pattern="\d{6}"
                required
              />
            </label>
            {formError && (
              <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                {formError}
              </div>
            )}
            <button
              type="submit"
              disabled={verifying}
              className="bg-primary rounded-full text-lg px-12 py-2.5 text-white uppercase cursor-pointer hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {verifying ? "Verifying..." : "Verify"}
            </button>
          </form>
          <div className="mt-5 flex flex-col items-center justify-center w-full gap-1">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || cooldownSeconds > 0}
              className="text-primary hover:underline disabled:opacity-60"
            >
              {resending
                ? "Resending..."
                : cooldownSeconds > 0
                ? `Resend OTP in ${formatTime(cooldownSeconds)}`
                : "Resend OTP"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OtpVerify;
