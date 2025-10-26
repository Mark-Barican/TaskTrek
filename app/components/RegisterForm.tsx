"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const success = register(email, password);

    if (success) {
      setError("");
      setSuccessMessage("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500); // ✅ Redirect to login after 1.5 seconds
    } else {
      setError("Registration failed. Email might already be in use.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
          Create Your TaskTrek Account
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

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {successMessage && (
            <p className="text-green-400 text-sm text-center">{successMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-cyan-400 text-black font-semibold py-2 rounded hover:bg-cyan-300 transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-cyan-400 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
