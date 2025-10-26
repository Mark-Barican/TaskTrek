"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = login(email, password);

    if (success) {
      setError("");
      router.push("/"); // ✅ Redirect to main dashboard
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
          Welcome to TaskTrek
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-cyan-400 text-black font-semibold py-2 rounded hover:bg-cyan-300 transition"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-cyan-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
