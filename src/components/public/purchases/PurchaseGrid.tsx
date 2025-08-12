"use client";

import { PurchaseItem } from "@/types/public/purchase";
import PurchaseCard from "./PurchaseCard";

interface PurchaseGridProps {
    items: PurchaseItem[];
    hasMore?: boolean;
    onLoadMore?: () => void;
}

export default function PurchaseGrid({ items, hasMore, onLoadMore }: PurchaseGridProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {items.map((item) => (
                    <PurchaseCard key={`${item.type}-${item.id}`} item={item} />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center">
                    <button
                        onClick={onLoadMore}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium shadow-sm"
                    >
                        Load more
                    </button>
                </div>
            )}
        </div>
    );
}


