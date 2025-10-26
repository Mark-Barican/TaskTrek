"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MfaPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    
    if (code === "123456") {
      router.push("/"); 
    } else {
      setError("Invalid verification code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
          Two-Factor Verification
        </h2>
        <p className="text-gray-400 text-sm mb-4 text-center">
          Enter the 6-digit code sent to your email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="••••••"
            className="w-full text-center text-2xl tracking-widest p-2 rounded bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-cyan-400 text-black font-semibold py-2 rounded hover:bg-cyan-300 transition"
          >
            Verify
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-4">
          Didn’t receive a code?{" "}
          <a href="#" className="text-cyan-400 hover:underline">
            Resend
          </a>
        </p>
      </div>
    </div>
  );
}
