import { PurchaseItem } from "@/types/public/purchase";
import { axiosAPI } from "./axios";

// Kiểm tra đã mua hay chưa
export const checkPurchase = async (targetType: string, targetId: number) => {
  const res = await axiosAPI.get("/purchase/check", {
    params: { target_type: targetType, target_id: targetId },
  });
  return res.data; // { purchased: boolean }
};

// Mua quiz
export const purchaseItem = async (targetType: string, targetId: number) => {
  const res = await axiosAPI.post("/purchase", {
    target_type: targetType,
    target_id: targetId,
  });
  return res.data; // { message: '...' }
};

export const fetchPurchases = async (): Promise<PurchaseItem[]> => {
  const res = await axiosAPI.get("/me/purchases");
  return res.data;
};