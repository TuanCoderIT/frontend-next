import { axiosAPI } from "./axios";

export const topUpToken = async (amount: number): Promise<string> => {
    const res = await axiosAPI.post("/top-up", { amount });
    return res.data.payment_url;
};

export type Transaction = {
    id: number;
    created_at: string;
    type: "top_up" | "spend";
    amount: number;
    description: string | null;
    category?: "course" | "video" | "document" | "other" | null;
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
    const response = await axiosAPI.get("/me/transactions");
    console.log("Dữ liệu trả về từ /me/transactions:", response.data); // 👈 Thêm dòng này
    return response.data.transactions;
};

export const fetchWalletBalance = async (): Promise<number> => {
    const response = await axiosAPI.get("/me/wallet");
    return response.data.balance;
};
