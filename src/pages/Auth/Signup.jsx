import React, { useState } from "react";
import login_banner from "../../assets/images/login_banner.png";
import c2c_transparent from "../../assets/logos/c2c_transparent.png";
import { UserCircleIcon } from "@phosphor-icons/react/dist/csr/UserCircle";
import { LockIcon, Calendar, Phone, MapPin, At } from "@phosphor-icons/react";

const Signup = () => {
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

  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Hook up auth logic
    console.log(form);
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
            <img
              src={c2c_transparent}
              alt="Coast2Cart Logo"
              className="w-48 md:w-80 mb-1 mx-auto"
            />
            <h3 className="uppercase font-bold text-3xl">Create Account</h3>
            <p>Fill out the form</p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full gap-4 mt-2"
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
                      <input
                        type="tel"
                        name="contactNo"
                        value={form.contactNo}
                        onChange={handleChange}
                        className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                        placeholder="9123456789"
                        pattern="[0-9]{10,11}"
                        required
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-primary rounded-full text-lg px-12 py-2.5 text-white uppercase mb-4 md:mb-0"
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
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                        placeholder="Enter your password"
                        minLength={6}
                        required
                      />
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
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="grow bg-white text-black placeholder:font-light placeholder:text-gray-400 w-full"
                        placeholder="Confirm your password"
                        minLength={6}
                        required
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-between gap-3 flex-col sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-full text-lg px-12 py-2.5 text-primary uppercase border-2 border-primary bg-transparent"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-primary rounded-full text-lg px-12 py-2.5 text-white uppercase"
                  >
                    Create account
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
