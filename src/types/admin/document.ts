export interface Document {
    id: number;
    title: string;
    description: string;
    is_premium: boolean;
    price_token: number;
    status: "draft" | "published" | "archived";
    file_url: string;
    file_type: string;
    file_size: number;
    thumbnail: string;
    created_at: string;
    updated_at: string;
    category: { id: number; name: string };
    owner: { id: number; name: string; email?: string };
}

export interface DocumentFormData {
    title: string;
    category_id: number;
    description?: string;
    is_premium: boolean;
    price_token: number;
    status: "draft" | "published" | "archived";
    file: File | null;
    thumbnail: File | null;
}

export interface DocumentFilters {
    category?: string;
    search?: string;
    status?: string;
    is_premium?: boolean;
}

export interface DocumentsResponse {
    data: Document[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}
