"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    const success = login(email, password);
    if (!success) {
      setError("Invalid credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-2xl w-80">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">Login</h2>

      {error && <p className="text-red-400 mb-3 text-center">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-cyan-400 text-black font-semibold py-2 rounded hover:bg-cyan-300 transition"
      >
        Login
      </button>
    </form>
  );
}
