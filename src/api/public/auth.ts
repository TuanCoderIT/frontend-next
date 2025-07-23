// libs/auth.ts hoặc api/auth.ts

import { API } from "@/api/axios";

export const fetchUser = async () => {
  const res = await API.get("/user");
  return res.data;
};

export const loginApi = async (email: string, password: string) => {
  const res = await API.post("/login", { email, password });
  return res.data;
};

export const registerApi = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await API.post("/register", {
    name,
    email,
    password,
    password_confirmation: password,
  });
  return res.data;
};

export const logoutApi = async () => {
  await API.post("/logout");
};
