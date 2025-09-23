import React, { useMemo, useState } from "react";
import login_banner from "../../assets/images/login_banner.png";
import c2c_transparent from "../../assets/logos/c2c_transparent.png";
import { UserCircleIcon } from "@phosphor-icons/react/dist/csr/UserCircle";
import { LockIcon, Calendar, Phone, MapPin, At } from "@phosphor-icons/react";
import { Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
import { useResendOtpMutation, useSignupMutation } from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const COUNTRY_CODE = "+63";
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
    role: "buyer",
  });

  const [step, setStep] = useState(1);
  const [formError, setFormError] = useState("");
  const [signup, { isLoading }] = useSignupMutation();
  const [resendOtp] = useResendOtpMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isAdult = useMemo(() => {
    if (!form.dateOfBirth) return false;
    const dob = new Date(form.dateOfBirth);
    const now = new Date();
    const age =
      now.getFullYear() -
      dob.getFullYear() -
      (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate())
        ? 1
        : 0);
    return age >= 18;
  }, [form.dateOfBirth]);

  const validate = () => {
    if (!/^[A-Za-z]{2,50}$/.test(form.firstName))
      return "First name must be 2-50 letters";
    if (!/^[A-Za-z]{2,50}$/.test(form.lastName))
      return "Last name must be 2-50 letters";
    if (!/^\w{3,30}$/.test(form.username))
      return "Username must be 3-30 chars, letters/numbers/_ only";
    if (!isAdult) return "You must be at least 18 years old";
    if (!/^9\d{9}$/.test(form.contactNo)) return "Enter a valid phone number.";
    if (form.address.length < 10 || form.address.length > 200)
      return "Address must be 10-200 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Enter a valid email";
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password))
      return "Password must be 8+ chars, include lower/upper/number";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    if (!["buyer", "seller"].includes(form.role)) return "Select a valid role";
    return "";
  };

  const handleNextStep = () => {
    setFormError("");
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.username.trim()
    ) {
      setFormError("Please complete your name and username.");
      return;
    }
    if (!isAdult) {
      setFormError("You must be at least 18 years old");
      return;
    }
    if (!/^9\d{9}$/.test(form.contactNo)) {
      setFormError("Enter a valid phone number.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const msg = validate();
    if (msg) {
      setFormError(msg);
      return;
    }
    try {
      const payload = { ...form };
      const res = await signup(payload).unwrap();
      if (res?.success === false) {
        if (res?.accountNotVerified && res?.contactNo) {
          try {
            await resendOtp({ contactNo: res.contactNo }).unwrap();
          } catch {}
          toast.success("OTP sent. Please verify your phone.");
          navigate(
            `/verify-otp?contactNo=${encodeURIComponent(
              res.contactNo
            )}&otpSent=1`
          );
          return;
        }
        setFormError(res?.message || "Signup failed");
        return;
      }
      toast.success(res?.message || "Account created successfully");
      const userId = res?.data?.userId;
      const contactNo = res?.data?.contactNo;
      if (userId) {
        navigate(
          `/verify-otp?userId=${encodeURIComponent(
            userId
          )}&contactNo=${encodeURIComponent(contactNo || "")}`
        );
      }
    } catch (err) {
      const apiMessage = err?.data?.message || err?.error;
      setFormError(apiMessage || "Signup failed");
    }
  };

  return (
    <main className="min-h-screen w-full font-outfit text-black bg-white flex flex-col md:flex-row">
      <div className="hidden md:block md:flex-1">
        <img
          className="h-full w-full object-cover object-left"
          src={login_banner}
        />
      </div>
      <section className="w-full md:max-w-[60vw] flex justify-center items-center px-4 md:px-6 py-8">
        <div className=" w-full max-w-lg h-full flex flex-col justify-around items-center">
          <div className="flex flex-col text-center">
            <a href="/">
              <img
                src={c2c_transparent}
                alt="Coast2Cart Logo"
                className="w-48 md:w-80 mb-1 mx-auto cursor-pointer"
              />
            </a>
            <h3 className="uppercase font-bold text-3xl">Create Account</h3>
            <p>Fill out the form</p>
          </div>
          {/* Step indicator */}
          <div className="w-full mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-black">
                Step {step} of 2
              </span>
              <span className="text-xs text-black/60">
                {step === 1 ? "Personal details" : "Account details"}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-base-200 overflow-hidden">
              <div
                className="h-2 bg-primary transition-all"
                style={{ width: `${step === 1 ? 50 : 100}%` }}
              />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full gap-4 mt-2 mb-7"
          >
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="label px-0 mb-[-19px]">
                      <span className="label-text text-lg text-black font-normal">
                        First Name
                      </span>
                    </div>
                    <label className="mb-2 input input-lg rounded-2xl input-bordered border-2 border-black flex items-center gap-2 bg-white text-black w-full">
                      <UserCircleIcon className="h-8 w-8" weight="light" />
                      <input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                        placeholder="Enter your first name"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <div className="label px-0 mb-[-19px]">
                      <span className="label-text text-lg text-black font-normal">
                        Last Name
                      </span>
                    </div>
                    <label className="mb-2 input input-lg rounded-2xl input-bordered border-2 border-black flex items-center gap-2 bg-white text-black w-full">
                      <UserCircleIcon className="h-8 w-8" weight="light" />
                      <input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                        placeholder="Enter your last name"
                        required
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <div className="label px-0 mb-[-19px]">
                    <span className="label-text text-lg text-black font-normal">
                      Username
                    </span>
                  </div>
                  <label className="mb-2 input input-lg rounded-2xl input-bordered border-2 border-black flex items-center gap-2 bg-white text-black w-full">
                    <UserCircleIcon className="h-8 w-8" weight="light" />
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                      placeholder="Enter your username"
                      required
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="label px-0 mb-[-19px]">
                      <span className="label-text text-lg text-black font-normal">
                        Date of Birth
                      </span>
                    </div>
                    <label className="mb-2 input input-lg rounded-2xl input-bordered border-2 border-black flex items-center gap-2 bg-white text-black w-full">
                      <Calendar className="h-6 w-6" weight="light" />
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={form.dateOfBirth}
                        onChange={handleChange}
                        className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <div className="label px-0 mb-[-19px]">
                      <span className="label-text text-lg text-black font-normal">
                        Contact No.
                      </span>
                    </div>
                    <label className="mb-2 input input-lg rounded-2xl input-bordered border-2 border-black flex items-center gap-2 bg-white text-black w-full">
                      <Phone className="h-6 w-6" weight="light" />
                      <span className="text-black/80">{COUNTRY_CODE}</span>
                      <input
                        type="tel"
                        name="contactNo"
                        value={form.contactNo}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            contactNo: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10),
                          }))
                        }
                        className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                        placeholder="9123456789"
                        inputMode="numeric"
                        pattern="9[0-9]{9}"
                        maxLength={10}
                        required
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <div className="label px-0 mb-[-19px]">
                    <span className="label-text text-lg text-black font-normal">
                      Role
                    </span>
                  </div>
                  <label className="mb-2 input input-lg rounded-2xl input-bordered border-2 border-black flex items-center gap-2 bg-white text-black w-full">
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="grow bg-white text-black w-full"
                      required
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                    </select>
                  </label>
                </div>

                {formError && (
                  <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                    {formError}
                  </div>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-primary rounded-full text-lg px-12 py-2.5 text-white uppercase cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <div className="label px-0 mb-[-19px]">
                    <span className="label-text text-lg text-black font-normal">
                      Address
                    </span>
                  </div>
                  <label className="mb-2 input input-lg rounded-2xl input-bordered border-2 border-black flex items-center gap-2 bg-white text-black w-full">
                    <MapPin className="h-6 w-6" weight="light" />
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                      placeholder="123 Main Street, Quezon City, Philippines"
                      required
                    />
                  </label>
                </div>

                <div>
                  <div className="label px-0 mb-[-19px]">
                    <span className="label-text text-lg text-black font-normal">
                      Email
                    </span>
                  </div>
                  <label className="mb-2 input input-lg rounded-2xl input-bordered border-2 border-black flex items-center gap-2 bg-white text-black w-full">
                    <At className="h-6 w-6" weight="light" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                      placeholder="john.doe@email.com"
                      required
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="label px-0 mb-[-19px]">
                      <span className="label-text text-lg text-black font-normal">
                        Password
                      </span>
                    </div>
                    <label className="mb-2 input input-lg rounded-2xl input-bordered border-2 border-black flex items-center gap-2 bg-white text-black w-full">
                      <LockIcon className="h-6 w-6" weight="regular" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                        placeholder="Enter your password"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-black/80 hover:text-black focus:outline-none"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
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
                        Confirm Password
                      </span>
                    </div>
                    <label className="mb-2 input input-lg rounded-2xl input-bordered border-2 border-black flex items-center gap-2 bg-white text-black w-full">
                      <LockIcon className="h-6 w-6" weight="regular" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                        placeholder="Confirm your password"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="text-black/80 hover:text-black focus:outline-none"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        title={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeSlash className="h-6 w-6" weight="regular" />
                        ) : (
                          <Eye className="h-6 w-6" weight="regular" />
                        )}
                      </button>
                    </label>
                  </div>
                </div>

                {formError && (
                  <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                    {formError}
                  </div>
                )}

                <div className="flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-full text-lg px-12 py-2.5 text-primary uppercase border-2 border-primary bg-transparent cursor-pointer hover:bg-primary/5 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary rounded-full text-lg px-12 py-2.5 text-white uppercase cursor-pointer hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {isLoading ? "Creating..." : "Create account"}
                  </button>
                </div>
              </>
            )}
          </form>
          <div className="flex flex-col items-center gap-4">
            <p className="text-center font-normal text-md">
              Already have an account?{" "}
              <a href="/login" className="text-black underline">
                Log in here
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Signup;
