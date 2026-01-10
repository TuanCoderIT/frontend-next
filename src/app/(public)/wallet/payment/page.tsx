'use client';

import TokenTopUp from "@/components/public/purchases/TokenTopUp";

export default function () {
    return (
        <TokenTopUp
            onPaymentRedirect={(url) => window.location.href = url}
            isLoading={false}
        />
    )
}