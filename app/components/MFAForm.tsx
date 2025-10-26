"use client";

import { useState } from "react";

export default function MFAForm() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === "123456") {
      setMessage("✅ MFA Verified!");
    } else {
      setMessage("❌ Invalid code.");
    }
  };

  return (
    <form onSubmit={handleVerify} className="bg-gray-900 p-6 rounded-2xl w-80">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">MFA Verification</h2>

      {message && <p className="text-cyan-400 mb-3 text-center">{message}</p>}

      <input
        type="text"
        placeholder="Enter 6-digit code"
        className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-cyan-400 text-black font-semibold py-2 rounded hover:bg-cyan-300 transition"
      >
        Verify
      </button>
    </form>
  );
}
