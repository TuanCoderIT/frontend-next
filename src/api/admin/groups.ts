import { axiosAPI } from "../axios";
import { Group, GroupDetail, GroupMember, Post, PaginatedResponse } from "@/types/public/group";

export const adminGroupsApi = {
    // List all groups
    getGroups: (params?: {
        page?: number;
        search?: string;
        visibility?: 'public' | 'private';
        sort_by?: 'latest' | 'members' | 'oldest';
    }) => axiosAPI.get<PaginatedResponse<Group>>('/admin/groups', { params }),

    // Get group detail
    getGroupDetail: (groupId: number) =>
        axiosAPI.get<GroupDetail>(`/admin/groups/${groupId}`),

    // Delete group
    deleteGroup: (groupId: number) =>
        axiosAPI.delete(`/admin/groups/${groupId}`),

    // Get group members
    getMembers: (groupId: number, params?: {
        page?: number;
        search?: string;
        role?: 'owner' | 'admin' | 'member';
    }) => axiosAPI.get<PaginatedResponse<GroupMember>>(`/admin/groups/${groupId}/members`, { params }),

    // Update member role
    updateMemberRole: (groupId: number, userId: number, role: 'admin' | 'member') =>
        axiosAPI.put(`/admin/groups/${groupId}/members/${userId}`, { role }),

    // Remove member
    removeMember: (groupId: number, userId: number) =>
        axiosAPI.delete(`/admin/groups/${groupId}/members/${userId}`),

    // Get group posts
    getPosts: (groupId: number, params?: {
        page?: number;
        search?: string;
    }) => axiosAPI.get<PaginatedResponse<Post>>(`/admin/groups/${groupId}/posts`, { params }),

    // Hide/Unhide post
    togglePostVisibility: (groupId: number, postId: number, isHidden: boolean) =>
        axiosAPI.put(`/admin/groups/${groupId}/posts/${postId}`, { is_hidden: isHidden }),
};

