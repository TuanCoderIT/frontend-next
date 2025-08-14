// context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/public/user";
import { fetchUser, loginApi, registerApi, logoutApi } from "@/api/auth";
import { axiosAPI } from "@/api/axios";

interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const savedToken = localStorage.getItem("token");
  //   if (savedToken) {
  //     setToken(savedToken);
  //     axiosAPI.defaults.headers.common[
  //       "Authorization"
  //     ] = `Bearer ${savedToken}`;
  //     fetchUser()
  //       .then(setUser)
  //       .catch((err: any) => console.error("Lỗi khi lấy user:", err));
  //   }
  // }, []);
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      axiosAPI.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      fetchUser()
        .then(setUser)
        .catch((err: any) => console.error("Lỗi khi lấy user:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginApi(email, password);
    setToken(data.token);
    setUser(data.user);
    axiosAPI.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    localStorage.setItem("token", data.token);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await registerApi(name, email, password);
    setToken(data.token);
    setUser(data.user);
    axiosAPI.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    localStorage.setItem("token", data.token);
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    delete axiosAPI.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);