"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: string | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  // 🧠 Simulated Login
  const login = (email: string, password: string): boolean => {
    if (email === "student@tasktrek.com" && password === "1234") {
      setUser(email);
      return true; // ✅ Login success
    } else {
      return false; // ❌ Wrong credentials
    }
  };

  // 🧠 Simulated Registration
  const register = (email: string, password: string): boolean => {
    // In a real app, you’d call your backend API here.
    if (email && password) {
      setUser(email);
      return true;
    }
    return false; 
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
