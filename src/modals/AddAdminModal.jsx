import { useState } from "react";
import {
  Eye,
  EyeSlash,
  Phone,
  UserCircle,
  EnvelopeSimple,
  MapPin,
  CalendarBlank,
  Lock,
} from "@phosphor-icons/react";
import {
  useCreateAdminAccountMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "../services/api";
import toast from "react-hot-toast";

const AddAdminModal = ({ open, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1 info, 2 contact, 3 credentials, 4 otp
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    dateOfBirth: "",
    contactNo: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [createAdmin, { isLoading }] = useCreateAdminAccountMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

  if (!open) return null;

  const next = () => setStep((s) => Math.min(4, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const handleCreate = async () => {
    if (!form.firstName || !form.lastName || !form.username)
      return toast.error("Missing required fields");
    if (!form.contactNo || !form.address || !form.email)
      return toast.error("Missing contact details");
    if (!form.password || form.password !== form.confirmPassword)
      return toast.error("Passwords do not match");
    const normalizePhContact = (value) => {
      const digits = String(value || "").replace(/\D/g, "");
      if (digits.startsWith("+")) return digits.replace(/^\+/, "");
      if (digits.startsWith("63")) return digits.slice(2);
      if (digits.startsWith("0") && digits[1] === "9") return digits.slice(1);
      return digits;
    };
    const normalizedContact = normalizePhContact(form.contactNo);
    if (
      !(normalizedContact.startsWith("9") && normalizedContact.length === 10)
    ) {
      return toast.error("Enter a valid PH mobile number, e.g. 9XXXXXXXXX");
    }
    try {
      const payload = { ...form, contactNo: normalizedContact };
      const res = await createAdmin(payload).unwrap();
      toast.success("Admin details submitted. Verify OTP to activate.");
      setStep(4);
    } catch (e) {
      toast.error(e?.data?.message || "Failed to create admin");
    }
  };

  const handleVerify = async () => {
    if (!otp || otp.length < 6) return toast.error("Enter the 6 digit OTP");
    try {
      const digits = String(form.contactNo || "").replace(/\D/g, "");
      const contact = digits.startsWith("63")
        ? digits.slice(2)
        : digits.startsWith("0") && digits[1] === "9"
        ? digits.slice(1)
        : digits;
      await verifyOtp({ contactNo: contact, otp }).unwrap();
      toast.success("Admin verified successfully");
      onClose?.();
      onSuccess?.();
    } catch (e) {
      toast.error(e?.data?.message || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    try {
      const digits = String(form.contactNo || "").replace(/\D/g, "");
      const contact = digits.startsWith("63")
        ? digits.slice(2)
        : digits.startsWith("0") && digits[1] === "9"
        ? digits.slice(1)
        : digits;
      await resendOtp({ contactNo: contact }).unwrap();
      toast.success("OTP resent");
    } catch (e) {
      toast.error(e?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-[92vw] sm:w-[560px] rounded-[24px] border-4 border-warning shadow-2xl overflow-hidden">
        <div className="bg-accent text-accent-content py-6 px-6 text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-4 text-accent-content text-2xl leading-none"
          >
            ×
          </button>
          <h2 className="text-4xl font-extrabold tracking-wide">ADD</h2>
          <p className="text-3xl font-extrabold tracking-wide">ADMIN ACCOUNT</p>
        </div>

        <div className="p-6 pb-8 max-h-[60vh] overflow-y-auto">
          <div className="max-w-[470px] mx-auto space-y-5">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <UserCircle
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 rounded-full border-2 border-black pl-12 pr-4"
                      placeholder="Enter First Name"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <UserCircle
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 rounded-full border-2 border-black pl-12 pr-4"
                      placeholder="Enter Last Name"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <UserCircle
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 rounded-full border-2 border-black pl-12 pr-4"
                      placeholder="Enter Username"
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <CalendarBlank
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      type="date"
                      className="w-full h-12 rounded-full border-2 border-black pl-12 pr-4"
                      value={form.dateOfBirth}
                      onChange={(e) =>
                        setForm({ ...form, dateOfBirth: e.target.value })
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <EnvelopeSimple
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 rounded-full border-2 border-black pl-12 pr-4"
                      placeholder="Enter Email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Contact Number
                  </label>
                  <div className="relative">
                    <Phone
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 rounded-full border-2 border-black pl-12 pr-4"
                      placeholder="Enter Contact Number"
                      value={form.contactNo}
                      onChange={(e) =>
                        setForm({ ...form, contactNo: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 rounded-full border-2 border-black pl-12 pr-4"
                      placeholder="Enter Address"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      type={showPw ? "text" : "password"}
                      className="w-full h-12 rounded-full border-2 border-black pl-12 pr-12"
                      placeholder="Enter Password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/70"
                      onClick={() => setShowPw((v) => !v)}
                    >
                      {showPw ? <EyeSlash size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      type={showPw2 ? "text" : "password"}
                      className="w-full h-12 rounded-full border-2 border-black pl-12 pr-12"
                      placeholder="Re enter Password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/70"
                      onClick={() => setShowPw2((v) => !v)}
                    >
                      {showPw2 ? <EyeSlash size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <p className="text-center text-base-content/70">
                  Enter the 6 digit OTP sent to {form.contactNo}
                </p>
                <div className="flex justify-center mt-4">
                  <input
                    className="input input-bordered w-40 text-center tracking-widest"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <div className="flex justify-center mt-3">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={isResending}
                    onClick={handleResend}
                  >
                    Resend OTP
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="px-6 pb-8">
          <div className="max-w-[470px] mx-auto flex justify-between">
            {step > 1 ? (
              <button
                className="btn btn-ghost rounded-full px-4"
                onClick={prev}
              >
                PREVIOUS
              </button>
            ) : (
              <span />
            )}
            {step < 3 && (
              <button
                className="btn rounded-full bg-primary text-primary-content px-8"
                onClick={next}
              >
                NEXT
              </button>
            )}
            {step === 3 && (
              <button
                className="btn rounded-full bg-primary text-primary-content px-8"
                onClick={handleCreate}
                disabled={isLoading}
              >
                CONFIRM
              </button>
            )}
            {step === 4 && (
              <button
                className="btn rounded-full bg-primary text-primary-content px-8"
                onClick={handleVerify}
                disabled={isVerifying}
              >
                VERIFY OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdminModal;
