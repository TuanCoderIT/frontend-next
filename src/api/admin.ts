// API for admin dashboard
import { axiosAPI } from "./axios";

export interface DashboardCards {
    totalUsers: number;
    newUsers7Days: number;
    totalExams: number;
    totalGroups: number;
    totalPosts: number;
    totalTransactions: number;
}

export interface ChartDataPoint {
    date: string;
    total: number;
}

export interface MonthlyChartDataPoint {
    month: string;
    total: number;
}

export interface Transaction {
    id: number;
    user_id: number;
    amount: number;
    type: string;
    created_at: string;
}

export interface DashboardData {
    cards: DashboardCards;
    charts: {
        userPerDay: ChartDataPoint[];
        revenuePerDay: ChartDataPoint[];
        quizPerMonth: MonthlyChartDataPoint[];
    };
    tables: {
        latestTransactions: Transaction[];
    };
}

export const getDashboardData = async (): Promise<DashboardData> => {
    const { data } = await axiosAPI.get("/admin/dashboard");
    return data;
};

