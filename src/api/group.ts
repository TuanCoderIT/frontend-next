import { axiosAPI } from "./axios";
import { CreateGroupRequest, Group, PaginatedResponse, GroupDetail, UpdateGroupRequest, GroupJoinRequest, MembershipStatus, GroupMember } from "@/types/public/group";

export const groupsApi = {
    // Lấy danh sách groups
    getGroups: (params?: {
        page?: number;
        search?: string;
        visibility?: 'public' | 'private';
        sort_by?: 'latest' | 'members' | 'oldest';
        per_page?: number;
    }) => axiosAPI.get<PaginatedResponse<Group>>('/groups', { params }),

    // Lấy groups của user hiện tại
    getMyGroups: () =>
        axiosAPI.get<Group[]>('/groups/my-groups'),

    // Tạo group mới
    createGroup: (data: CreateGroupRequest | FormData) =>
        axiosAPI.post<{ message: string; data: Group }>('/groups', data, {
            headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
        }),

    // Lấy chi tiết group
    getGroupDetail: (slug: string) =>
        axiosAPI.get<GroupDetail>(`/groups/${slug}`),

    // Kiểm tra membership status
    checkMembership: (groupId: number) =>
        axiosAPI.get<MembershipStatus>(`/groups/${groupId}/check-membership`),

    // Lấy danh sách members
    getMembers: (groupId: number, params?: {
        role?: 'owner' | 'admin' | 'member';
        search?: string;
    }) => axiosAPI.get<GroupMember[]>(`/groups/${groupId}/members`, { params }),

    // Cập nhật group
    updateGroup: (groupId: number, data: UpdateGroupRequest | FormData) =>
        axiosAPI.put(`/groups/${groupId}`, data, {
            headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
        }),

    // Xóa group
    deleteGroup: (groupId: number) =>
        axiosAPI.delete(`/groups/${groupId}`),

    // Join group
    joinGroup: (groupId: number) =>
        axiosAPI.post(`/groups/${groupId}/join`),

    // Leave group
    leaveGroup: (groupId: number) =>
        axiosAPI.post(`/groups/${groupId}/leave`),

    // Quản lý members
    kickMember: (groupId: number, userId: number) =>
        axiosAPI.post(`/groups/${groupId}/kick/${userId}`),

    promoteMember: (groupId: number, userId: number) =>
        axiosAPI.post(`/groups/${groupId}/promote/${userId}`),

    demoteMember: (groupId: number, userId: number) =>
        axiosAPI.post(`/groups/${groupId}/demote/${userId}`),

    // Join requests
    getJoinRequests: (groupId: number) =>
        axiosAPI.get<GroupJoinRequest[]>(`/groups/${groupId}/join-requests`),

    approveRequest: (requestId: number) =>
        axiosAPI.post(`/groups/join-request/${requestId}/approve`),

    rejectRequest: (requestId: number) =>
        axiosAPI.post(`/groups/join-request/${requestId}/reject`),
};