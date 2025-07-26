// API get all users
import { axiosAPI } from "@/api/axios";

export const getUsers = async (params: Record<string, any> = {}) => {
  const res = await axiosAPI.get("/admin/users", { params });
  return res.data;
};

// CREATE
export const saveUser = async (formData: any) => {
  const formPayload = new FormData();
  formPayload.append("name", formData.name);
  formPayload.append("email", formData.email);
  formPayload.append("password", formData.password);
  formPayload.append("role", formData.role);
  formPayload.append("status", formData.status);
  if (formData.phone) formPayload.append("phone_number", formData.phone);
  if (formData.avatar) formPayload.append("avatar", formData.avatar);

  return await axiosAPI.post("/admin/users", formPayload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// READ (1 user)
export const getUserById = async (id: string | number) => {
  const token = localStorage.getItem("token"); // hoặc lấy từ store nếu bạn dùng Redux/Zustand

  return await axiosAPI.get(`/admin/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// UPDATE
export const updateUser = async (id: string | number, formData: any) => {
  const formPayload = new FormData();
  formPayload.append("_method", "PUT"); // Laravel hỗ trợ method override
  formPayload.append("name", formData.name);
  formPayload.append("role", formData.role);
  formPayload.append("status", formData.status);
  if (formData.phone) formPayload.append("phone_number", formData.phone);
  if (formData.avatar) formPayload.append("avatar", formData.avatar);

  return await axiosAPI.post(`/admin/users/${id}`, formPayload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// DELETE
export const deleteUser = async (id: string | number) => {
  return await axiosAPI.delete(`/admin/users/${id}`);
};
