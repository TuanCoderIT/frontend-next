import { axiosAPI } from '@/api/axios';
import { Document, DocumentFormData } from '@/types/admin/document';

const unwrapData = <T>(res: any): T => {
    return res?.data ?? res;
};

export const getDocuments = async (categoryId?: number | string) => {
    let url = "/documents";

    if (categoryId && categoryId !== "All") {
        url += `?category_id=${categoryId}`;
    }

    const res = await axiosAPI.get(url);
    const data = unwrapData<Document[]>(res.data);

    return Array.isArray(data) ? data : [];
};

export const getDocumentById = async (id: number) => {
    const res = await axiosAPI.get(`/documents/${id}`);
    return unwrapData<Document>(res.data);
};

const buildDocumentFormData = (formData: any, isUpdate = false) => {
    const formPayload = new FormData();

    // Hàm phụ trợ chỉ dành cho các trường KHÔNG phải là File
    const appendScalarField = (key: string, value: any) => {
        if (value !== undefined && value !== null) {
            formPayload.append(key, String(value));
        }
    };

    // Thêm các trường dữ liệu thông thường
    appendScalarField("title", formData.title);
    appendScalarField("category_id", formData.category_id.toString());
    appendScalarField("description", formData.description || "");
    appendScalarField("is_premium", formData.is_premium ? "1" : "0");
    appendScalarField("price_token", formData.price_token ?? 0);
    appendScalarField("status", formData.status || "draft");

    // THÊM CÁC TRƯỜNG FILE (KHÔNG ÉP KIỂU SANG CHUỖI!)
    if (formData.file instanceof File) {
        // Đảm bảo formData.file là đối tượng File hợp lệ
        formPayload.append("file", formData.file);
    }
    if (formData.thumbnail instanceof File) {
        // Đảm bảo formData.thumbnail là đối tượng File hợp lệ
        formPayload.append("thumbnail", formData.thumbnail);
    }

    if (isUpdate) {
        // Cần thiết nếu dùng PUT/PATCH qua POST
        formPayload.append("_method", "PUT");
    }

    return formPayload;
};

// 
export const createDocument = async (formData: any) => {
    const formPayload = buildDocumentFormData(formData);
    return await axiosAPI.post("admin/documents", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// UPDATE
export const updateDocument = async (id: number, formData: any) => {
    const formPayload = buildDocumentFormData(formData, true);
    return await axiosAPI.post(`admin/documents/${id}`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// Create new document
// export const createDocument = async (formData: DocumentFormData): Promise<Document> => {
//     const payload = new FormData();

//     payload.append("title", formData.title);
//     payload.append("category_id", formData.category_id.toString());
//     payload.append("description", formData.description || "");
//     payload.append("is_premium", formData.is_premium ? "1" : "0");
//     payload.append("price_token", formData.price_token.toString());

//     if (formData.file) {
//         payload.append("file", formData.file);
//     }
//     if (formData.thumbnail) {
//         payload.append("thumbnail", formData.thumbnail);
//     }

//     const response = await axiosAPI.post("/admin/documents", payload, {
//         headers: { "Content-Type": "multipart/form-data" },
//     });

//     return unwrapData<Document>(response.data);
// };

// // Update document
// export const updateDocument = async (
//     id: number,
//     formData: Partial<DocumentFormData>
// ): Promise<Document> => {

//     const payload = new FormData();

//     if (formData.title) payload.append("title", formData.title);
//     if (formData.description !== undefined) payload.append("description", formData.description);
//     if (formData.category_id !== undefined) {
//         payload.append("category_id", formData.category_id.toString());
//     }
//     if (formData.is_premium !== undefined) {
//         payload.append("is_premium", formData.is_premium ? "1" : "0");
//     }
//     if (formData.price_token !== undefined) {
//         payload.append("price_token", formData.price_token.toString());
//     }
//     if (formData.file) payload.append("file", formData.file);
//     if (formData.thumbnail) payload.append("thumbnail", formData.thumbnail);

//     payload.append("_method", "PUT");

//     const res = await axiosAPI.post(`/admin/documents/${id}`, payload, {
//         headers: { "Content-Type": "multipart/form-data" }
//     });

//     return unwrapData<Document>(res.data);
// };

// Delete document
export const deleteDocument = async (id: number): Promise<void> => {
    await axiosAPI.delete(`/admin/documents/${id}`);
};

// Download document file
export const downloadDocument = async (url: string, filename: string): Promise<void> => {
    try {
        const response = await axiosAPI.get(url, {
            responseType: "blob",
        });

        const blob = new Blob([response.data], { type: response.data.type });
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error("Download error:", error);
        alert("Không thể tải file — kiểm tra lại API.");
    }
};
