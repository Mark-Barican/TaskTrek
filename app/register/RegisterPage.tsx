"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = () => {
    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const ok = register(email, password, role); // ✅ Now includes role

    if (ok) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1000);
    } else {
      setError("Registration failed. Try a different email.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">
        Register for TaskTrek
      </h1>
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-80">
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        {success && (
          <p className="text-green-400 text-sm mb-4 text-center">
            Registration successful! Redirecting to login...
          </p>
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
          onClick={handleRegister}
          className="w-full py-2 bg-cyan-400 text-black font-bold rounded hover:bg-cyan-300 transition"
        >
          Register
        </button>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-cyan-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
