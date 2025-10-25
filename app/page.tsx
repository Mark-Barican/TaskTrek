"use client";

import { useState } from "react";
import {
  Cog6ToothIcon,
  PlusIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

// Define TypeScript interfaces
interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: "not-started" | "in-progress" | "completed";
  assignee?: string;
}

interface TaskFormState {
  title: string;
  description: string;
  dueDate: string;
  assignee: string;
}

export default function Home() {
  // State to control which section is visible
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  // Task management state
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Math Homework",
      description: "Complete algebra exercises",
      dueDate: "2025-10-30",
      status: "not-started",
    },
    {
      id: 2,
      title: "Science Project",
      description: "Research on climate change",
      dueDate: "2025-11-05",
      status: "in-progress",
    },
    {
      id: 3,
      title: "History Essay",
      description: "Write about World War II",
      dueDate: "2025-11-10",
      status: "completed",
    },
  ]);

  const [showTaskModal, setShowTaskModal] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState<TaskFormState>({
    title: "",
    description: "",
    dueDate: "",
    assignee: "",
  });

  // Function to handle adding/editing tasks
  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentTask) {
      // Update existing task
      setTasks(
        tasks.map((task) =>
          task.id === currentTask.id ? { ...task, ...taskForm } : task
        )
      );
    } else {
      // Add new task
      const newTask: Task = {
        id: Date.now(),
        ...taskForm,
        status: "not-started",
      };
      setTasks([...tasks, newTask]);
    }

    // Reset form and close modal
    setTaskForm({ title: "", description: "", dueDate: "", assignee: "" });
    setCurrentTask(null);
    setShowTaskModal(false);
  };

  // Function to open modal for adding a new task
  const openAddTaskModal = () => {
    setCurrentTask(null);
    setTaskForm({ title: "", description: "", dueDate: "", assignee: "" });
    setShowTaskModal(true);
  };

  // Function to open modal for editing a task
  const openEditTaskModal = (task: Task) => {
    setCurrentTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      assignee: task.assignee || "",
    });
    setShowTaskModal(true);
  };

  // Function to delete a task
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Function to update task status
  const updateTaskStatus = (
    id: number,
    newStatus: "not-started" | "in-progress" | "completed"
  ) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

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
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            {/* Task Management Header with + Button */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Manage Your Tasks</h3>
              <button
                onClick={openAddTaskModal}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition"
              >
                <PlusIcon className="h-5 w-5" />
                Add Task
              </button>
            </div>

            {/* Task List */}
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{task.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      {task.description}
                    </p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-sm text-gray-400">
                        Due:{" "}
                        {new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                      {task.assignee && (
                        <span className="text-sm text-gray-400">
                          Assigned to: {task.assignee}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditTaskModal(task)}
                      className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition"
                    >
                      <PencilIcon className="h-4 w-4 text-cyan-400" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 rounded bg-red-800 hover:bg-red-700 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === "progressTracking" && (
          <section className="bg-gray-900 border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-6">
              Task Progress Overview
            </h3>

            {/* Progress Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-300 mb-2">Not Started</h4>
                <p className="text-3xl font-bold text-red-40">
                  {tasks.filter((task) => task.status === "not-started").length}
                </p>
              </div>
              <div className="bg-gray-800 border border-gray-70 rounded-lg p-4">
                <h4 className="font-medium text-gray-300 mb-2">In Progress</h4>
                <p className="text-3xl font-bold text-yellow-400">
                  {tasks.filter((task) => task.status === "in-progress").length}
                </p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-300 mb-2">Completed</h4>
                <p className="text-3xl font-bold text-green-40">
                  {tasks.filter((task) => task.status === "completed").length}
                </p>
              </div>
            </div>

            {/* Progress Bar Visualization */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Overall Progress</span>
                <span className="text-gray-300">
                  {Math.round(
                    (tasks.filter((task) => task.status === "completed")
                      .length /
                      tasks.length) *
                      100
                  ) || 0}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-cyan-60 h-4 rounded-full"
                  style={{
                    width: `${
                      (tasks.filter((task) => task.status === "completed")
                        .length /
                        tasks.length) *
                        100 || 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Task Status Breakdown */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Task Status Breakdown</h4>

              {/* Not Started Tasks */}
              <div className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <h5 className="font-medium">
                    Not Started (
                    {
                      tasks.filter((task) => task.status === "not-started")
                        .length
                    }
                    )
                  </h5>
                </div>
                <div className="ml-5 space-y-2">
                  {tasks
                    .filter((task) => task.status === "not-started")
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center text-gray-300"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        <span>{task.title}</span>
                      </div>
                    ))}
                  {tasks.filter((task) => task.status === "not-started")
                    .length === 0 && (
                    <p className="text-gray-500 text-sm">
                      No tasks in this category
                    </p>
                  )}
                </div>
              </div>

              {/* In Progress Tasks */}
              <div className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <h5 className="font-medium">
                    In Progress (
                    {
                      tasks.filter((task) => task.status === "in-progress")
                        .length
                    }
                    )
                  </h5>
                </div>
                <div className="ml-5 space-y-2">
                  {tasks
                    .filter((task) => task.status === "in-progress")
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center text-gray-300"
                      >
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                        <span>{task.title}</span>
                      </div>
                    ))}
                  {tasks.filter((task) => task.status === "in-progress")
                    .length === 0 && (
                    <p className="text-gray-500 text-sm">
                      No tasks in this category
                    </p>
                  )}
                </div>
              </div>

              {/* Completed Tasks */}
              <div className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <h5 className="font-medium">
                    Completed (
                    {tasks.filter((task) => task.status === "completed").length}
                    )
                  </h5>
                </div>
                <div className="ml-5 space-y-2">
                  {tasks
                    .filter((task) => task.status === "completed")
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center text-gray-300"
                      >
                        <div className="w-2 h-2 bg-green-50 rounded-full mr-3"></div>
                        <span className="line-through text-gray-500">
                          {task.title}
                        </span>
                      </div>
                    ))}
                  {tasks.filter((task) => task.status === "completed")
                    .length === 0 && (
                    <p className="text-gray-500 text-sm">
                      No tasks in this category
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Task Creation/Edit Modal */}
        {showTaskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md p-6">
              <h3 className="text-xl font-semibold mb-4">
                {currentTask ? "Edit Task" : "Create New Task"}
              </h3>

              <form onSubmit={handleTaskSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, title: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, description: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    rows={3}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Due Date *</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, dueDate: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">
                    Assigned to
                  </label>
                  <input
                    type="text"
                    value={taskForm.assignee}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, assignee: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter assignee name"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTaskModal(false);
                      setCurrentTask(null);
                      setTaskForm({
                        title: "",
                        description: "",
                        dueDate: "",
                        assignee: "",
                      });
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition"
                  >
                    {currentTask ? "Update Task" : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
