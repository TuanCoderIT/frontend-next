import { axiosAPI } from "./axios";

export const adminGroupAPI = {
    list: () => axiosAPI.get("/admin/groups"),
    show: (id: number) => axiosAPI.get(`/admin/groups/${id}`),
    update: (id: number, data: any) => axiosAPI.put(`/admin/groups/${id}`, data),
    lock: (id: number) => axiosAPI.post(`/admin/groups/${id}/lock`),
    delete: (id: number) => axiosAPI.delete(`/admin/groups/${id}`)
};

export const adminGroupMemberAPI = {
    list: (groupId: number) =>
        axiosAPI.get(`/admin/groups/${groupId}/members`),

    remove: (groupId: number, userId: number) =>
        axiosAPI.delete(`/admin/groups/${groupId}/members/${userId}`),

    changeRole: (groupId: number, userId: number, role: string) =>
        axiosAPI.post(`/admin/groups/${groupId}/members/${userId}/role`, { role })
};

export const adminPostAPI = {
    list: () => axiosAPI.get("/admin/posts"),
    show: (id: number) => axiosAPI.get(`/admin/posts/${id}`),
    delete: (id: number) => axiosAPI.delete(`/admin/posts/${id}`),
    hide: (id: number) => axiosAPI.post(`/admin/posts/${id}/hide`)
};
