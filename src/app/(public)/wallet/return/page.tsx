'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { axiosAPI } from "@/api/axios"; // Đảm bảo bạn đã cấu hình auth Bearer token
import Link from "next/link";

export default function WalletReturnPage() {
    const searchParams = useSearchParams();
    const status = searchParams.get("status");

    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "success") {
            setLoading(true);
            axiosAPI.get('me/wallet', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then((res) => {
                    setBalance(res.data.balance);
                })
                .catch((err) => {
                    console.error("Lỗi khi lấy số dư:", err);
                })
                .finally(() => setLoading(false));
        }
    }, [status]);

    return (
        <div className="max-w-xl mx-auto mt-20 text-center">
            {status === "success" && (
                <div>
                    <h2 className="text-2xl font-bold text-green-600 mb-4">✅ Nạp token thành công!</h2>
                    {loading ? (
                        <p>Đang cập nhật số dư ví...</p>
                    ) : (
                        <p className="text-lg">
                            Số dư hiện tại của bạn là: <strong>{balance}</strong> token
                            <br />
                            <Link href={'/wallet'}>Đến ví của tôi</Link>
                        </p>
                    )}
                </div>
            )}

            {status === "fail" && (
                <div className="text-xl text-red-600 font-semibold">❌ Thanh toán thất bại. Vui lòng thử lại.</div>
            )}

            {status === "invalid" && (
                <div className="text-xl text-yellow-600 font-semibold">⚠️ Dữ liệu không hợp lệ.</div>
            )}

            {status === "invalid_user" && (
                <div className="text-xl text-orange-500 font-semibold">⚠️ Không tìm thấy người dùng.</div>
            )}
        </div>
    );
}
