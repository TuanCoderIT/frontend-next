import GroupDetailPage from "@/components/admin/groups/GroupDetailPage";

interface AdminGroupDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function AdminGroupDetailPage({ params }: AdminGroupDetailPageProps) {
    const { id } = await params;
    const groupId = parseInt(id);
    return <GroupDetailPage groupId={groupId} />;
}
