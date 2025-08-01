import { axiosAPI } from "@/api/axios";
import { UpdateProfileData, ChangePasswordData } from "@/types/public/user";

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

export const updateProfileApi = async (formData: UpdateProfileData) => {
  const payload = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      payload.append(key, value);
    }
  });

  payload.append("_method", "PUT");

  const res = await axiosAPI.post("/profile", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const changePasswordApi = async (data: ChangePasswordData) => {
  const res = await axiosAPI.post("/change-password", data);
  return res.data;
};

export const getUserStatsApi = async () => {
  const res = await axiosAPI.get("/profile");
  return res.data;
};
