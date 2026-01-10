"use client";

import { getDocumentById, updateDocument } from "@/api/documents";
import AdminBreadcrumb from "@/components/admin/common/AdminBreadcrumb";
import PageHeader from "@/components/admin/common/PageHeader";
import DocumentForm from "@/components/admin/documents/DocumentForm";
import { PageLoading } from "@/components/common/LoadingScreen";
import { ArrowLeft, BookCheck } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function EditDocumentPage() {
    const { id } = useParams();
    const [existingDocumentData, setExistingDocumentData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                setIsLoading(true);
                const data = await getDocumentById(Number(id));
                setExistingDocumentData(data);
            } catch (err: any) {
                console.error(err);
                toast.error("Failed to load document");
                setError(err?.response?.data?.errors || {});
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchDocs();
    }, [id]);

    if (isLoading || !existingDocumentData)
        return <PageLoading text="Loading Document Information..." />;

    return (
        <div className="space-y-6 mx-4">
            <AdminBreadcrumb
                currentPage="Edit Document"
                parent={{ href: "/admin/documents", label: "Documents" }}
            />
            <PageHeader
                title="Edit Document"
                icon={<BookCheck />}
                actionLabel="Back to Documents"
                actionHref="/admin/documents"
                actionIcon={<ArrowLeft />}
                bgGradient="from-green-50 to-emerald-50"
                buttonGradient="from-green-500 to-emerald-600"
            />
            <DocumentForm
                mode="edit"
                initialData={existingDocumentData}
                errors={error || {}}
                onSubmit={async (data) => {
                    try {
                        await updateDocument(Number(id), data);
                    } catch (err: any) {
                        setError(err?.response?.data?.errors || {});
                        throw err; // Re-throw to let DocumentForm handle toast
                    }
                }}
            />
        </div>
    );
}
