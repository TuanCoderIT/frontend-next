export type ContentType = "quiz" | "course" | "video" | "document";

export type TypeColor = "blue" | "green" | "purple" | "orange";

export interface PurchaseItemBase {
    id: number;
    type: ContentType;
    title: string;
    description: string;
    thumbnailUrl?: string | null;
    priceTokens?: number | null; // null or 0 means free
    purchasedAt: string; // ISO string
}

export interface QuizPurchaseMeta {
    examId: number;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    durationMinutes: number;
    questionsCount: number;
    color?: string; // supports gradient key or hex
}

export type PurchaseItem =
    | (PurchaseItemBase & { type: "quiz"; meta: QuizPurchaseMeta })
    | (PurchaseItemBase & { type: "course"; meta?: Record<string, unknown> })
    | (PurchaseItemBase & { type: "video"; meta?: Record<string, unknown> })
    | (PurchaseItemBase & { type: "document"; meta?: Record<string, unknown> });

export const typeColorMap: Record<ContentType, TypeColor> = {
    quiz: "blue",
    course: "green",
    video: "purple",
    document: "orange",
};


