import React, { useState } from "react";
import { useLoginMutation, useResendOtpMutation } from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import login_banner from "../../assets/images/login_banner.png";
import c2c_transparent from "../../assets/logos/c2c_transparent.png";
import { UserCircleIcon } from "@phosphor-icons/react/dist/csr/UserCircle";
import { LockIcon } from "@phosphor-icons/react/dist/ssr";
import { Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const [resendOtp] = useResendOtpMutation();
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      const res = await login({ identifier: email, password }).unwrap();
      if (res?.success === false) {
        // Handle unverified account flow
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
        setFormError(res?.message || "Login failed");
        return;
      }
      const token = res?.data?.token;
      const user = res?.data?.user;
      if (token) {
        localStorage.setItem("auth_token", token);
      }
      if (user) {
        localStorage.setItem("auth_user", JSON.stringify(user));
      }
      const displayName = user?.username || user?.firstName || "";
      toast.success(displayName ? `Welcome, ${displayName}` : "Welcome");
      const role = (user?.role || "").toLowerCase();
      if (role === "superadmin" || role === "super_admin") {
        navigate("/admin/admins");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      // Handle unverified account when server responds with non-2xx
      if (err?.data?.accountNotVerified && err?.data?.contactNo) {
        try {
          await resendOtp({ contactNo: err.data.contactNo }).unwrap();
        } catch {}
        toast.success("OTP sent. Please verify your phone.");
        navigate(
          `/verify-otp?contactNo=${encodeURIComponent(
            err.data.contactNo
          )}&otpSent=1`
        );
        return;
      }
      const apiMessage = err?.data?.message || err?.error;
      setFormError(apiMessage || "Login failed");
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
      <section className="w-full md:max-w-[60vw] flex-1 flex justify-center items-center px-4 md:px-6 py-8">
        <div className=" w-full px-6 max-w-lg flex flex-col justify-center md:justify-around items-center gap-6">
          <div className="flex flex-col text-center">
            <a href="/">
              <img
                src={c2c_transparent}
                alt="Coast2Cart Logo"
                className="w-48 md:w-80 mb-1 mx-auto cursor-pointer"
              />
            </a>
            <h3 className="uppercase font-bold text-3xl">Welcome Back</h3>
            <p>Fill out the form</p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full gap-6 mt-2"
          >
            <div className="label px-0 mb-[-19px]">
              <span className="label-text text-lg text-black font-normal">
                Username / Email / Contact No.
              </span>
            </div>
            <label className="mb-2 input input-lg rounded-2xl input-bordered border-2 border-black flex items-center gap-2 bg-white text-black w-full">
              <UserCircleIcon className="h-8 w-8" weight="light" />
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                placeholder="Enter username, email, or 9XXXXXXXXX"
                required
              />
            </label>
            <div className="label px-0 mb-[-19px] ">
              <span className="label-text text-lg text-black font-normal">
                Password
              </span>
            </div>
            <label className="input input-lg rounded-2xl input-bordered border-2 border-black flex items-center gap-2 bg-white text-black w-full">
              <LockIcon className="h-6 w-6" weight="regular" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                placeholder="Enter your password"
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
            <div className="flex w-full justify-end">
              <p className="text-lg text-black mb-6 mt-[-10px] hover:underline cursor-pointer">
                Forgot password?
              </p>
            </div>
            {formError && (
              <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 -mt-2">
                {formError}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary rounded-full text-lg px-12 py-2.5 text-white uppercase cursor-pointer hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {isLoading ? "Logging in..." : "LOG IN"}
            </button>
          </form>
          <div className="flex flex-col items-center gap-4">
            <p className="text-center font-normal text-md">
              Don't have an account?{" "}
              <a href="/signup" className="text-black underline">
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
