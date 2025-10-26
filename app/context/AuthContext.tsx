"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

// 🔹 Define user structure
interface User {
  email: string;
  password: string;
}

// 🔹 Define context type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string) => boolean;
  logout: () => void;
}

// 🔹 Create context
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  // Load users from localStorage (simulated database)
  const [users, setUsers] = useState<User[]>(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("users") || "[]")
      : []
  );

  const [user, setUser] = useState<User | null>(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("currentUser") || "null")
      : null
  );

  // ✅ Register new user
  const register = (email: string, password: string) => {
    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      alert("User already exists!");
      return false;
    }

    const newUser = { email, password };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert("Registration successful! You can now log in.");
    router.push("/login");
    return true;
  };

  // ✅ Login validation
  const login = (email: string, password: string) => {
    const existingUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (existingUser) {
      setUser(existingUser);
      localStorage.setItem("currentUser", JSON.stringify(existingUser));
      router.push("/");
      return true;
    } else {
      alert("Invalid email or password.");
      return false;
    }
  };

  // ✅ Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 Custom hook for convenience
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
