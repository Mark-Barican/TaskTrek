"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

interface User {
  email: string;
  role: "student" | "admin";
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: "student" | "admin") => boolean;
  register: (email: string, password: string, role: "student" | "admin") => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (email: string, password: string, role: "student" | "admin") => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find(
      (u: any) => u.email === email && u.password === password && u.role === role
    );

    if (found) {
      const fakeToken = `jwt-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      const loggedUser = { email, role, token: fakeToken };
      localStorage.setItem("user", JSON.stringify(loggedUser));
      setUser(loggedUser);
      return true;
    }
    return false;
  };

  const register = (email: string, password: string, role: "student" | "admin") => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const exists = users.some((u: any) => u.email === email);
    if (exists) return false;

    const newUser = { email, password, role };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
