'use client';

import { createDocument } from "@/api/documents";
import AdminBreadcrumb from "@/components/admin/common/AdminBreadcrumb";
import PageHeader from "@/components/admin/common/PageHeader";
import DocumentForm from "@/components/admin/documents/DocumentForm";
import { ArrowLeft, BookCheck } from "lucide-react";

export default function AddDocumentPage() {
    return (
        <div className="space-y-6 mx-4">
            <AdminBreadcrumb
                currentPage="Add New Document"
                parent={{ href: "/admin/documents", label: "Documents" }}
            />
            <PageHeader
                title="Add New Document"
                icon={<BookCheck />}
                actionLabel="Back to Documents"
                actionHref="/admin/documents"
                actionIcon={<ArrowLeft />}
                bgGradient="from-green-50 to-emerald-50"
                buttonGradient="from-green-500 to-emerald-600"
            />
            <DocumentForm
                mode="create"
                errors={{}}
                onSubmit={async (data) => {
                    await createDocument(data);
                }}
            />
        </div>
    );
}
