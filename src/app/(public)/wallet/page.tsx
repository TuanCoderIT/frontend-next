import Wallet from '@/components/public/Wallet';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Wallet",
};

export default function WalletPage() {
    return <Wallet />;
}
