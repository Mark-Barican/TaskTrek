"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Cog6ToothIcon,
  PlusIcon,
  PencilIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "./context/AuthContext";

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
  const router = useRouter();
  const { user, logout } = useAuth();

  // State to control which section is visible
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Task management state
  const [tasks, setTasks] = useState<Task[]>([]);

  const [showTaskModal, setShowTaskModal] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState<TaskFormState>({
    title: "",
    description: "",
    dueDate: "",
    assignee: "",
  });

  // Fetch tasks from database
  const fetchTasks = async () => {
    if (!user) return;
    
    setIsLoadingTasks(true);
    try {
      const response = await fetch(`/api/tasks?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks.map((task: any) => ({
          ...task,
          dueDate: task.dueDate.split('T')[0], // Format date for display
        })));
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Load tasks when user is available
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Function to handle adding/editing tasks
  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (currentTask) {
        // Update existing task
        const response = await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: currentTask.id,
            userId: user.id,
            ...taskForm,
          }),
        });

        if (response.ok) {
          await fetchTasks(); // Refresh tasks
        }
      } else {
        // Add new task
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...taskForm,
            userId: user.id,
            status: "not-started",
          }),
        });

        if (response.ok) {
          await fetchTasks(); // Refresh tasks
        }
      }

      // Reset form and close modal
      setTaskForm({ title: "", description: "", dueDate: "", assignee: "" });
      setCurrentTask(null);
      setShowTaskModal(false);
    } catch (error) {
      console.error("Error submitting task:", error);
    }
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
  const deleteTask = async (id: number) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/tasks?id=${id}&userId=${user.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchTasks(); // Refresh tasks
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Function to update task status
  const updateTaskStatus = async (
    id: number,
    newStatus: "not-started" | "in-progress" | "completed"
  ) => {
    if (!user) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          userId: user.id,
          status: newStatus,
        }),
      });

      if (response.ok) {
        await fetchTasks(); // Refresh tasks
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
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
            <div className="text-gray-400">
              Welcome, {user?.email || "Student"} 👋
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Conditionally Rendered Sections */}
        {activeSection === "dashboard" && (
          <section className="space-y-8">
            {/* Dashboard Header */}
            <div>
              <h2 className="text-3xl font-bold text-cyan-300"></h2>
              <p className="text-gray-400"></p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="text-gray-400 text-sm">Total Tasks</div>
                <div className="text-3xl font-bold text-white mt-1">
                  {tasks.length}
                </div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="text-gray-400 text-sm">Completed</div>
                <div className="text-3xl font-bold text-green-400 mt-1">
                  {tasks.filter((task) => task.status === "completed").length}
                </div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="text-gray-400 text-sm">In Progress</div>
                <div className="text-3xl font-bold text-yellow-400 mt-1">
                  {tasks.filter((task) => task.status === "in-progress").length}
                </div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="text-gray-400 text-sm">Not Started</div>
                <div className="text-3xl font-bold text-red-400 mt-1">
                  {tasks.filter((task) => task.status === "not-started").length}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
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
                  className="bg-cyan-600 h-4 rounded-full"
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

            {/* Upcoming Deadlines and Recent Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Deadlines */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Upcoming Deadlines
                </h3>
                <div className="space-y-3">
                  {tasks
                    .filter((task) => {
                      const today = new Date();
                      const dueDate = new Date(task.dueDate);
                      const diffTime = dueDate.getTime() - today.getTime();
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 24));
                      return diffDays >= 0 && diffDays <= 7;
                    })
                    .sort(
                      (a, b) =>
                        new Date(a.dueDate).getTime() -
                        new Date(b.dueDate).getTime()
                    )
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex justify-between items-center p-3 bg-gray-900 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-gray-400">
                            Due:{" "}
                            {new Date(task.dueDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              task.status === "not-started"
                                ? "bg-red-900/50 text-red-400"
                                : task.status === "in-progress"
                                ? "bg-yellow-900/50 text-yellow-400"
                                : "bg-green-900/50 text-green-400"
                            }`}
                          >
                            {task.status === "not-started"
                              ? "Not Started"
                              : task.status === "in-progress"
                              ? "In Progress"
                              : "Completed"}
                          </span>
                        </div>
                      </div>
                    ))}
                  {tasks.filter((task) => {
                    const today = new Date();
                    const dueDate = new Date(task.dueDate);
                    const diffTime = dueDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 24));
                    return diffDays >= 0 && diffDays <= 7;
                  }).length === 0 && (
                    <div className="text-gray-500 text-center py-4">
                      No upcoming deadlines in the next 7 days
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Recent Tasks</h3>
                <div className="space-y-3">
                  {[...tasks]
                    .sort((a, b) => b.id - a.id)
                    .slice(0, 5)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex justify-between items-center p-3 bg-gray-900 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-gray-400">
                            {new Date(task.dueDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            task.status === "not-started"
                              ? "bg-red-900/50 text-red-400"
                              : task.status === "in-progress"
                              ? "bg-yellow-900/50 text-yellow-400"
                              : "bg-green-900/50 text-green-400"
                          }`}
                        >
                          {task.status === "not-started"
                            ? "Not Started"
                            : task.status === "in-progress"
                            ? "In Progress"
                            : "Completed"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
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
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
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

                  {/* Status Update Buttons */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Status:</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            updateTaskStatus(task.id, "not-started")
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            task.status === "not-started"
                              ? "bg-red-500 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          Not Started
                        </button>
                        <button
                          onClick={() =>
                            updateTaskStatus(task.id, "in-progress")
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            task.status === "in-progress"
                              ? "bg-yellow-500 text-black"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() => updateTaskStatus(task.id, "completed")}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            task.status === "completed"
                              ? "bg-green-500 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          Completed
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          task.status === "not-started"
                            ? "bg-red-900/50 text-red-400"
                            : task.status === "in-progress"
                            ? "bg-yellow-900/50 text-yellow-400"
                            : "bg-green-900/50 text-green-400"
                        }`}
                      >
                        {task.status === "not-started"
                          ? "Not Started"
                          : task.status === "in-progress"
                          ? "In Progress"
                          : "Completed"}
                      </span>
                    </div>
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
