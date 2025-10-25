"use client";

import { useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function Home() {
  // State to control which section is visible
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
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
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-cyan-300">
              {activeSection === "dashboard"
                ? "Student Task Dashboard"
                : activeSection === "taskManagement"
                ? "Task Management"
                : "Progress Tracking"}
            </h2>
            <p className="text-gray-400">
              {activeSection === "dashboard"
                ? "View and filter your tasks efficiently"
                : activeSection === "taskManagement"
                ? "Create, assign, delete, and manage due dates"
                : "Monitor task progress: Not Started, In Progress, Completed"}
            </p>
          </div>

          <div className="flex items-center space-x-6">
            {/* Settings Button */}
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition">
              <Cog6ToothIcon className="h-6 w-6 text-cyan-400" />
            </button>

            {/* User Welcome */}
            <div className="text-gray-400">Welcome, Student 👋</div>
          </div>
        </header>

        {/* Conditionally Rendered Sections */}
        {activeSection === "dashboard" && (
          <section className="bg-gray-900 border border-gray-800 rounded-2xl h-60 flex items-center justify-center text-gray-500">
            (Dashboard content will go here)
          </section>
        )}

        {activeSection === "taskManagement" && (
          <section className="bg-gray-900 border border-gray-800 rounded-2xl h-60 flex items-center justify-center text-gray-500">
            (Task Management UI will go here)
          </section>
        )}

        {activeSection === "progressTracking" && (
          <section className="bg-gray-900 border border-gray-800 rounded-2xl h-60 flex items-center justify-center text-gray-500">
            (Progress Tracking UI will go here)
          </section>
        )}
      </main>
    </div>
  );
}



