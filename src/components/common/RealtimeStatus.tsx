"use client";

import { useRealtime } from '@/context/RealtimeContext';
import { Wifi, WifiOff } from 'lucide-react';

export default function RealtimeStatus() {
    const { isConnected } = useRealtime();

    return (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            isConnected 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
        }`}>
            {isConnected ? (
                <>
                    <Wifi className="w-4 h-4" />
                    <span>Đã kết nối</span>
                </>
            ) : (
                <>
                    <WifiOff className="w-4 h-4" />
                    <span>Mất kết nối</span>
                </>
            )}
        </div>
    );
}