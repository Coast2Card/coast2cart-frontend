import React, { useEffect, useRef, useState } from "react";
import { useResendOtpMutation, useVerifyOtpMutation } from "../services/api";
import toast from "react-hot-toast";

const VerifyAdminOtpModal = ({ open, onClose, admin, onSuccess }) => {
  const [otp, setOtp] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const autoSentRef = useRef(false);
  const parseWaitSeconds = (err) => {
    const msg = err?.data?.message || err?.error || "";
    const retryAfter = Number(
      err?.data?.retryAfter || err?.headers?.["retry-after"] || 0
    );
    if (retryAfter > 0 && Number.isFinite(retryAfter))
      return Math.ceil(retryAfter);
    const match = String(msg).match(/(\d{1,5})\s*seconds?/i);
    if (match && match[1]) return Number(match[1]);
    return 0;
  };

  useEffect(() => {
    if (!admin) return;
    const digits = String(admin?.contactNo || "").replace(/\D/g, "");
    // Prefer 9XXXXXXXXX local format for API used elsewhere in app
    const normalized = digits.startsWith("63")
      ? digits.slice(2)
      : digits.startsWith("0") && digits[1] === "9"
      ? digits.slice(1)
      : digits;
    setContactNo(normalized);
  }, [admin]);

  useEffect(() => {
    if (!open) return;
    if (!contactNo) return;
    if (autoSentRef.current) return;
    autoSentRef.current = true;
    (async () => {
      try {
        await resendOtp({ contactNo }).unwrap();
        toast.success("OTP sent");
        setCooldownSeconds(60);
      } catch (e) {
        const wait = parseWaitSeconds(e);
        if (wait > 0) setCooldownSeconds(wait);
        toast.error(e?.data?.message || e?.error || "Failed to send OTP");
      }
    })();
  }, [open, contactNo]);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const id = setInterval(() => {
      setCooldownSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [cooldownSeconds]);

  useEffect(() => {
    if (!open) {
      // Reset auto-send guard and cooldown when modal closes
      autoSentRef.current = false;
      setCooldownSeconds(0);
      setOtp("");
    }
  }, [open]);

  if (!open) return null;

  const handleVerify = async () => {
    if (!otp || otp.length < 6) return toast.error("Enter the 6 digit OTP");
    if (!contactNo) return toast.error("Missing contact number");
    try {
      await verifyOtp({ contactNo, otp }).unwrap();
      toast.success("Admin verified successfully");
      onClose?.();
      onSuccess?.();
    } catch (e) {
      toast.error(e?.data?.message || e?.error || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    if (!contactNo) return toast.error("Missing contact number");
    try {
      await resendOtp({ contactNo }).unwrap();
      toast.success("OTP resent");
      setCooldownSeconds(60);
    } catch (e) {
      const wait = parseWaitSeconds(e);
      if (wait > 0) setCooldownSeconds(wait);
      toast.error(e?.data?.message || e?.error || "Failed to resend OTP");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-[92vw] sm:w-[480px] rounded-2xl shadow-2xl border border-row-outline p-6">
        <h3 className="text-xl font-bold mb-2">Verify Admin via OTP</h3>
        <p className="text-base-content/70 mb-4">
          Complete OTP verification to activate this admin account.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Contact Number
            </label>
            <input
              className="input input-bordered w-full bg-base-200/50 cursor-not-allowed"
              placeholder="9XXXXXXXXX"
              value={contactNo}
              readOnly
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">OTP Code</label>
            <input
              className="input input-bordered w-full text-center tracking-widest"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <button
            className="btn btn-ghost"
            onClick={handleResend}
            disabled={isResending || !contactNo || cooldownSeconds > 0}
          >
            {isResending
              ? "Resending..."
              : cooldownSeconds > 0
              ? `Resend in ${cooldownSeconds}s`
              : "Resend OTP"}
          </button>
          <div className="flex gap-3">
            <button
              className="btn bg-white text-base-content border border-row-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn bg-primary text-primary-content border border-primary"
              onClick={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAdminOtpModal;
