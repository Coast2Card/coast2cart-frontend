import React, { useState } from "react";
import login_banner from "../../assets/images/login_banner.png";
import c2c_transparent from "../../assets/logos/c2c_transparent.png";
import { UserCircleIcon } from "@phosphor-icons/react/dist/csr/UserCircle";
import { LockIcon } from "@phosphor-icons/react/dist/ssr";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Hook up auth logic
    // For now, just log the values
    console.log({ email, password });
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
        <div className=" w-full px-6 max-w-lg h-full flex flex-col justify-around items-center">
          <div className="flex flex-col text-center">
            <img
              src={c2c_transparent}
              alt="Coast2Cart Logo"
              className="w-48 md:w-80 mb-1 mx-auto"
            />
            <h3 className="uppercase font-bold text-3xl">Welcome Back</h3>
            <p>Fill out the form</p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full gap-6 mt-2"
          >
            <div className="label px-0 mb-[-19px]">
              <span className="label-text text-lg text-black font-normal">
                Username
              </span>
            </div>
            <label className="mb-2 input input-lg rounded-2xl input-bordered border-2 border-black flex items-center gap-2 bg-white text-black w-full">
              <UserCircleIcon className="h-8 w-8" weight="light" />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                placeholder="Enter your username"
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
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </label>
            <div className="flex w-full justify-end">
              <p className="text-lg text-black mb-6 mt-[-10px] hover:underline cursor-pointer">
                Forgot password?
              </p>
            </div>
          </form>
          <div className="flex flex-col items-center gap-4">
            <button
              type="submit"
              className="bg-primary rounded-full text-lg px-12 py-2.5 text-white uppercase text-white"
            >
              LOG IN
            </button>
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
