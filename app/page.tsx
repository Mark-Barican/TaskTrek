"use client";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Home() {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-950 text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col">
          <h1 className="text-2xl font-bold text-cyan-400 mb-8">🎓 TaskTrek</h1>
          <nav className="space-y-3">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`block w-full text-left px-2 py-1 rounded ${
                activeSection === "dashboard"
                  ? "bg-cyan-400 text-black font-semibold"
                  : "text-gray-300 hover:text-cyan-400"
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setActiveSection("taskManagement")}
              className={`block w-full text-left px-2 py-1 rounded ${
                activeSection === "taskManagement"
                  ? "bg-cyan-400 text-black font-semibold"
                  : "text-gray-300 hover:text-cyan-400"
              }`}
            >
              Task Management
            </button>

            <button
              onClick={() => setActiveSection("progressTracking")}
              className={`block w-full text-left px-2 py-1 rounded ${
                activeSection === "progressTracking"
                  ? "bg-cyan-400 text-black font-semibold"
                  : "text-gray-300 hover:text-cyan-400"
              }`}
            >
              Progress Tracking
            </button>
          </nav>

          <button
            onClick={logout}
            className="mt-auto text-red-400 hover:text-red-300 text-sm"
          >
            Logout
          </button>
        </aside>

        {/* Main Area */}
        <main className="flex-1 p-10 overflow-y-auto">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-cyan-300">
                {activeSection === "dashboard"
                  ? "Student Task Dashboard"
                  : activeSection === "taskManagement"
                  ? "Task Management"
                  : "Progress Tracking"}
              </h2>
            </div>

            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition">
              <Cog6ToothIcon className="h-6 w-6 text-cyan-400" />
            </button>
          </header>

          {activeSection === "dashboard" && (
            <section className="bg-gray-900 border border-gray-800 rounded-2xl h-60 flex items-center justify-center text-gray-500">
              (Dashboard content here)
            </section>
          )}
          {activeSection === "taskManagement" && (
            <section className="bg-gray-900 border border-gray-800 rounded-2xl h-60 flex items-center justify-center text-gray-500">
              (Task Management content)
            </section>
          )}
          {activeSection === "progressTracking" && (
            <section className="bg-gray-900 border border-gray-800 rounded-2xl h-60 flex items-center justify-center text-gray-500">
              (Progress Tracking content)
            </section>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
