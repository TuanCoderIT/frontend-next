import DocumentDetail from "@/components/admin/documents/DocumentDetail";

interface DocumentDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function DocumentDetailPage({ params }: DocumentDetailPageProps) {
    const { id } = await params;
    const documentId = parseInt(id);

    return <DocumentDetail documentId={documentId} />;
}
