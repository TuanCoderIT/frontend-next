// API for categories CRUD operations
import { axiosAPI } from "@/api/axios";

// GET all categories
export const getCategories = async (params: Record<string, any> = {}) => {
    const res = await axiosAPI.get("/admin/categories", { params });
    // Laravel Resource usually wraps in 'data'
    return res.data.data || res.data;
};

// CREATE category
export const saveCategory = async (formData: {
    name: string;
    slug: string;
    color?: string;
    is_active: boolean;
}) => {
    return await axiosAPI.post("/admin/categories", formData);
};

// READ (1 category)
export const getCategoryById = async (id: string | number) => {
    const token = localStorage.getItem("token");
    return await axiosAPI.get(`/admin/categories/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// UPDATE category
export const updateCategory = async (
    id: string | number,
    formData: {
        name: string;
        slug: string;
        color?: string;
        is_active: boolean;
    }
) => {
    return await axiosAPI.put(`/admin/categories/${id}`, formData);
};

// DELETE category
export const deleteCategory = async (id: string | number) => {
    return await axiosAPI.delete(`/admin/categories/${id}`);
};

