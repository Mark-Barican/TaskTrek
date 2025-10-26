"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const ok = login(email, password, role); 
    if (ok) {
      router.push("/"); 
    } else {
      setError("Invalid credentials or role. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Login to TaskTrek</h1>
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-80">
        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 rounded bg-gray-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 rounded bg-gray-800 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ✅ Added role selector */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "student" | "admin")}
          className="w-full mb-4 p-2 rounded bg-gray-800 text-white"
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={handleLogin}
          className="w-full py-2 bg-cyan-400 text-black font-bold rounded hover:bg-cyan-300 transition"
        >
          Login
        </button>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-cyan-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
