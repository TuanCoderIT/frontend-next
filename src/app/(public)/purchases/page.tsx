"use client";

import { useEffect, useMemo, useState } from "react";
import PurchaseHeader from "@/components/public/purchases/PurchaseHeader";
import FilterTabs from "@/components/public/purchases/FilterTabs";
import PurchaseGrid from "@/components/public/purchases/PurchaseGrid";
import EmptyState from "@/components/public/purchases/EmptyState";
import { PurchaseItem } from "@/types/public/purchase";
import { fetchPurchases } from "@/api/purchase";

type TabKey = "all" | "quiz" | "course" | "video" | "document";

export default function PurchasesPage() {
    const [active, setActive] = useState<TabKey>("quiz");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [items, setItems] = useState<PurchaseItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPurchases()
            .then(data => setItems(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        let filteredItems = active === "all" ? items : items.filter(i => i.type === active);
        if (q) {
            filteredItems = filteredItems.filter(
                i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
            );
        }
        return filteredItems;
    }, [items, active, search]);

    const pageSize = 8;
    const pagedItems = filtered.slice(0, page * pageSize);
    const hasMore = filtered.length > pagedItems.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <PurchaseHeader searchQuery={search} onSearchChange={setSearch} />

                {/* Sticky filter bar */}
                <div className="sticky top-0 z-10 py-4 bg-gradient-to-b from-white/80 to-white/40 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                    <FilterTabs active={active} onChange={(t) => { setActive(t); setPage(1); }} />
                </div>

                {/* Main content */}
                <div className="mt-4">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : pagedItems.length > 0 ? (
                        <PurchaseGrid
                            items={pagedItems}
                            hasMore={hasMore}
                            onLoadMore={() => setPage((p) => p + 1)}
                        />
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>
        </div>
    );
}
