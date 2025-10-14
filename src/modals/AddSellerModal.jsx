import React, { useEffect, useRef, useState } from "react";
import {
  UserCircle,
  EnvelopeSimple,
  Phone,
  MapPin,
  ImageSquare,
  Lock,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react";
import { toast } from "react-hot-toast";
import {
  useCreateSellerAccountMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "../services/api";

const Step = ({ index, topLabel, bottomLabel, active }) => (
  <div className="flex flex-col items-center gap-3">
    <div
      className={`relative z-10 w-12 h-12 rounded-full grid place-items-center text-lg font-extrabold shadow ${
        active ? "bg-warning text-white shadow-warning/50" : "text-base-content"
      }`}
      style={{ backgroundColor: active ? undefined : "#FFF6E5" }}
    >
      {index}
    </div>
    <div className="text-accent font-extrabold uppercase text-sm tracking-wide text-center leading-4">
      <div>{topLabel}</div>
      <div>{bottomLabel}</div>
    </div>
  </div>
);

const AddSellerModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1); // 1..3
  const progressPercent = ((step - 1) / 2) * 90; // 0, 45, 90 within rail inset
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [form, setForm] = useState({
    storeName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    dateOfBirth: "",
    email: "",
    contactNo: "",
    address: "",
    file: null,
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const autoSentRef = useRef(false);
  const [createSeller, { isLoading: isCreating }] =
    useCreateSellerAccountMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const startCooldown = (seconds) => {
    setCooldownSeconds(seconds);
  };
  useEffect(() => {
    if (step !== 3) return;
    if (autoSentRef.current) return;
    autoSentRef.current = true;
    // auto-send OTP when entering step 3
    resendOtp({ contactNo: form.contactNo })
      .unwrap()
      .then(() => {
        toast.success("OTP sent");
        startCooldown(60);
      })
      .catch((e) => {
        const msg = e?.data?.message || "Failed to send OTP";
        const m = String(msg).match(/(\d+)\s*seconds?/i);
        const retryAfter =
          Number(e?.error?.headers?.get?.("Retry-After")) ||
          (m ? Number(m[1]) : 60);
        startCooldown(retryAfter);
        toast.error(msg);
      });
  }, [step]);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const t = setInterval(
      () => setCooldownSeconds((s) => (s > 0 ? s - 1 : 0)),
      1000
    );
    return () => clearInterval(t);
  }, [cooldownSeconds]);

  useEffect(() => {
    if (step !== 3) {
      autoSentRef.current = false;
      setOtp("");
      setCooldownSeconds(0);
    }
  }, [step]);

  const handleChange = (key) => (e) => {
    const value = key === "file" ? e.target.files?.[0] || null : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleNextFromCredentials = async () => {
    // Submit create seller, then proceed to OTP step
    try {
      const fd = new FormData();
      fd.append("firstName", form.firstName);
      fd.append("lastName", form.lastName);
      if (form.middleName) fd.append("middleName", form.middleName);
      if (form.suffix) fd.append("suffix", form.suffix);
      if (form.dateOfBirth) fd.append("dateOfBirth", form.dateOfBirth);
      if (form.storeName) fd.append("storeName", form.storeName);
      if (form.email) fd.append("email", form.email);
      fd.append("contactNo", form.contactNo);
      if (form.address) fd.append("address", form.address);
      if (form.file) fd.append("file", form.file);
      fd.append("username", form.username);
      fd.append("password", form.password);
      fd.append("confirmPassword", form.confirmPassword);
      await createSeller(fd).unwrap();
      toast.success("Seller created. Verify OTP to finish.");
      setStep(3);
    } catch (e) {
      toast.error(e?.data?.message || "Failed to create seller");
    }
  };

  const handleVerify = async () => {
    try {
      await verifyOtp({ otp, contactNo: form.contactNo }).unwrap();
      toast.success("OTP verified");
      onClose?.();
    } catch (e) {
      toast.error(e?.data?.message || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ contactNo: form.contactNo }).unwrap();
      toast.success("OTP resent");
      startCooldown(60);
    } catch (e) {
      const msg = e?.data?.message || "Failed to resend OTP";
      const m = String(msg).match(/(\d+)\s*seconds?/i);
      const retryAfter =
        Number(e?.error?.headers?.get?.("Retry-After")) ||
        (m ? Number(m[1]) : 60);
      startCooldown(retryAfter);
      toast.error(msg);
    }
  };

  const isStep1Valid = () => {
    return (
      form.firstName.trim() &&
      form.lastName.trim() &&
      form.contactNo.trim() &&
      form.username.trim() &&
      form.password.trim() &&
      form.confirmPassword.trim() &&
      form.password === form.confirmPassword
    );
  };

  const isStep2Valid = () => {
    return (
      form.username.trim() &&
      form.password.trim() &&
      form.confirmPassword.trim() &&
      form.password === form.confirmPassword
    );
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-[92vw] sm:w-[560px] rounded-[24px] border-4 border-warning shadow-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-accent text-accent-content py-6 px-6 text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-4 text-accent-content text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-4xl font-extrabold tracking-wide">ADD</h2>
          <p className="text-3xl font-extrabold tracking-wide">
            SELLER ACCOUNT
          </p>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4">
          <div className="relative w-full max-w-[420px] mx-auto">
            {/* Rail wrapper spans from center of step 1 to center of step 3 */}
            <div className="absolute inset-x-0 top-0 h-0" aria-hidden>
              <div
                className="absolute top-6 -translate-y-1/2 z-0"
                style={{ left: 28, right: 28 }}
              >
                <div
                  className="h-5 w-full rounded-full"
                  style={{ backgroundColor: "#FFF6E5" }}
                ></div>
                <div
                  className="h-5 rounded-full -mt-5 transition-all duration-200"
                  style={{
                    width: `${progressPercent}%`,
                    background:
                      "linear-gradient(90deg, rgba(255,184,0,1) 0%, rgba(255,184,0,0.85) 50%, rgba(255,184,0,0.75) 100%)",
                  }}
                ></div>
              </div>
            </div>
            <div className="relative flex items-center justify-between">
              <button type="button" onClick={() => setStep(1)}>
                <Step
                  index={1}
                  topLabel="Personal"
                  bottomLabel="Information"
                  active={step === 1}
                />
              </button>
              <button type="button" onClick={() => setStep(2)}>
                <Step
                  index={2}
                  topLabel="Log in"
                  bottomLabel="Credentials"
                  active={step === 2}
                />
              </button>
              <button type="button" onClick={() => setStep(3)}>
                <Step
                  index={3}
                  topLabel="Verify"
                  bottomLabel="OTP"
                  active={step === 3}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 pb-8 flex-1 overflow-y-auto">
          <div className="relative max-w-[470px] mx-auto px-[28px] space-y-5">
            {/* Center vertical divider removed */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Store Name
                  </label>
                  <div className="relative">
                    <UserCircle
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-4 placeholder:text-base-content/40"
                      placeholder="Enter Store Name"
                      value={form.storeName}
                      onChange={handleChange("storeName")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <UserCircle
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-4 placeholder:text-base-content/40"
                      placeholder="Enter First Name"
                      value={form.firstName}
                      onChange={handleChange("firstName")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Middle Name (optional)
                  </label>
                  <div className="relative">
                    <UserCircle
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-4 placeholder:text-base-content/40"
                      placeholder="Enter Middle Name"
                      value={form.middleName}
                      onChange={handleChange("middleName")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <UserCircle
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-4 placeholder:text-base-content/40"
                      placeholder="Enter Last Name"
                      value={form.lastName}
                      onChange={handleChange("lastName")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Suffix (optional)
                  </label>
                  <div className="relative">
                    <UserCircle
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-4 placeholder:text-base-content/40"
                      placeholder="Enter Suffix"
                      value={form.suffix}
                      onChange={handleChange("suffix")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <UserCircle
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      type="date"
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-4 placeholder:text-base-content/40"
                      value={form.dateOfBirth}
                      onChange={handleChange("dateOfBirth")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Email Address (optional)
                  </label>
                  <div className="relative">
                    <EnvelopeSimple
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-4 placeholder:text-base-content/40"
                      placeholder="Enter Email Address"
                      value={form.email}
                      onChange={handleChange("email")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Contact Number
                  </label>
                  <div className="relative">
                    <Phone
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-4 placeholder:text-base-content/40"
                      placeholder="Enter Contact Number"
                      value={form.contactNo}
                      onChange={handleChange("contactNo")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-4 placeholder:text-base-content/40"
                      placeholder="Enter Address"
                      value={form.address}
                      onChange={handleChange("address")}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-lg sm:text-xl font-semibold">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-md bg-white border-2 border-row-outline grid place-items-center">
                      <ImageSquare size={28} className="text-base-content/50" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-base-content/70 italic mb-2">
                        Please upload square image, size less than 100KB
                      </p>
                      <div className="rounded-lg">
                        <input
                          type="file"
                          className="file-input file-input-bordered w-full max-w-xs bg-white"
                          onChange={handleChange("file")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <UserCircle
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-4 placeholder:text-base-content/40"
                      placeholder="Enter Username"
                      value={form.username}
                      onChange={handleChange("username")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      type={showPw ? "text" : "password"}
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-12 placeholder:text-base-content/40"
                      placeholder="Enter Password"
                      value={form.password}
                      onChange={handleChange("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/70"
                      onClick={() => setShowPw((v) => !v)}
                    >
                      {showPw ? <EyeSlash size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      type={showPw2 ? "text" : "password"}
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-12 placeholder:text-base-content/40"
                      placeholder="Re-enter Password"
                      value={form.confirmPassword}
                      onChange={handleChange("confirmPassword")}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/70"
                      onClick={() => setShowPw2((v) => !v)}
                    >
                      {showPw2 ? <EyeSlash size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Contact Number
                  </label>
                  <div className="relative">
                    <Phone
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-4 bg-gray-100"
                      value={form.contactNo}
                      readOnly
                      disabled
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Enter OTP
                  </label>
                  <div className="relative">
                    <input
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black px-4 placeholder:text-base-content/40 tracking-widest text-center"
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={handleResend}
                      disabled={cooldownSeconds > 0 || isResending}
                    >
                      {cooldownSeconds > 0
                        ? `Resend in ${cooldownSeconds}s`
                        : "Resend OTP"}
                    </button>
                    {isResending && (
                      <span className="text-sm opacity-70">Sending…</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2">
          <div className="max-w-[470px] mx-auto px-[28px]">
            <div className="flex justify-between">
              {step > 1 ? (
                <button
                  className="btn btn-ghost rounded-full px-4"
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                >
                  PREVIOUS
                </button>
              ) : (
                <span />
              )}
              {step === 1 && (
                <button
                  className="btn rounded-full bg-primary text-primary-content px-8"
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid()}
                >
                  NEXT
                </button>
              )}
              {step === 2 && (
                <button
                  className="btn rounded-full bg-primary text-primary-content px-8"
                  onClick={handleNextFromCredentials}
                  disabled={isCreating || !isStep2Valid()}
                >
                  {isCreating ? "CREATING…" : "NEXT"}
                </button>
              )}
              {step === 3 && (
                <button
                  className="btn rounded-full bg-primary text-primary-content px-8"
                  onClick={handleVerify}
                  disabled={!otp || isVerifying}
                >
                  {isVerifying ? "VERIFYING…" : "CONFIRM"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSellerModal;
