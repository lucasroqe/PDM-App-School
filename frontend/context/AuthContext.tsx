import React, { createContext, useState, useContext } from "react";
import { api } from "../services/api";

type User = { id: number; nome: string; email: string; tipo: string };

type AuthContextType = {
  user: User | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, senha: string) => {
    const res = await api.post("/auth/login", { email, senha });
    setUser(res.data.user);
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
