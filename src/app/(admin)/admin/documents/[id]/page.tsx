import DocumentDetail from "@/components/admin/documents/DocumentDetail";

interface DocumentDetailPageProps {
    params: {
        id: string;
    };
}

export default function DocumentDetailPage({ params }: DocumentDetailPageProps) {
    const documentId = parseInt(params.id);

    return <DocumentDetail documentId={documentId} />;
}
