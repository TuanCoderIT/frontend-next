import useSWR from 'swr';
import { groupsApi } from '@/api/group';
import { GroupDetail } from '@/types/public/group';
import { useAuth } from '@/context/AuthContext'; // hoặc hook lấy current user

export function useGroupDetail(slug: string) {
    const { user } = useAuth(); // Lấy current user

    const { data, error, isLoading, mutate } = useSWR<GroupDetail>(
        ['group', slug],
        () => groupsApi.getGroupDetail(slug).then((res) => res.data),
        { revalidateOnFocus: false }
    );

    // Check membership
    const isMember = data?.members.some((m) => m.user_id === user?.id) || false;
    const isOwner = data?.owner_id === user?.id;
    const isAdmin =
        data?.members.find((m) => m.user_id === user?.id)?.role === 'admin' ||
        isOwner;
    const userRole = data?.members.find((m) => m.user_id === user?.id)?.role;

    const joinGroup = async () => {
        if (!data) return;
        try {
            await groupsApi.joinGroup(data.id);
            mutate(); // Refresh group detail
        } catch (err) {
            throw err;
        }
    };

    const leaveGroup = async () => {
        if (!data) return;
        try {
            await groupsApi.leaveGroup(data.id);
            mutate();
        } catch (err) {
            throw err;
        }
    };

    return {
        group: data,
        isLoading,
        isError: error,
        isMember,
        isOwner,
        isAdmin,
        userRole,
        joinGroup,
        leaveGroup,
        refresh: mutate,
    };
}