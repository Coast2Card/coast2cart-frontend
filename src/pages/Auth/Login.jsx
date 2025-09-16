import React, { useState } from "react";

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
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow p-8 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-primary text-center">Login</h1>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered"
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </label>
        <button type="submit" className="btn btn-primary text-white">
          Sign in
        </button>
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-primary underline">
            Sign up
          </a>
        </p>
      </form>
    </main>
  );
};

export default Login;
