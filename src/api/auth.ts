import { axiosAPI } from "@/api/axios";

export const fetchUser = async () => {
  const res = await axiosAPI.get("/user");
  return res.data;
};

export const loginApi = async (email: string, password: string) => {
  const res = await axiosAPI.post("/login", { email, password });
  return res.data;
};

export const registerApi = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await axiosAPI.post("/register", {
    name,
    email,
    password,
    password_confirmation: password,
  });
  return res.data;
};

export const logoutApi = async () => {
  await axiosAPI.post("/logout");
};
