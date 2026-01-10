import useSWR from 'swr';
import { groupsApi } from '@/api/group';
import { Group, PaginatedResponse } from '@/types/public/group';

interface UseGroupsParams {
    search?: string;
    visibility?: 'public' | 'private';
    page?: number;
}

export function useGroups(params?: UseGroupsParams) {
    const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Group>>(
        ['groups', params],
        () => groupsApi.getGroups(params).then((res) => res.data)
    );

    const joinGroup = async (groupId: number) => {
        try {
            await groupsApi.joinGroup(groupId);
            mutate(); // Refresh list
        } catch (err) {
            throw err;
        }
    };

    const leaveGroup = async (groupId: number) => {
        try {
            await groupsApi.leaveGroup(groupId);
            mutate(); // Refresh list
        } catch (err) {
            throw err;
        }
    };

    return {
        groups: data?.data || [],
        pagination: data
            ? {
                currentPage: data.current_page,
                lastPage: data.last_page,
                total: data.total,
            }
            : null,
        isLoading,
        isError: error,
        joinGroup,
        leaveGroup,
        refresh: mutate,
    };
}