import GroupDetailPage from "@/components/admin/groups/GroupDetailPage";

interface AdminGroupDetailPageProps {
    params: {
        id: string;
    };
}

export default function AdminGroupDetailPage({ params }: AdminGroupDetailPageProps) {
    const groupId = parseInt(params.id);
    return <GroupDetailPage groupId={groupId} />;
}
