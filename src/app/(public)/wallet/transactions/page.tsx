// 'use client';

// import React from 'react';
// import { HandCoins, Download, Minus, LibraryBig, Video, FileText } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// // Transaction type definition (reuse from Wallet)
// type Transaction = {
//     id: string;
//     time: string;
//     type: 'top-up' | 'spend';
//     amount: number;
//     description: string;
//     category?: 'course' | 'video' | 'document' | 'other';
// };

// const sampleTransactions: Transaction[] = [
//     {
//         id: '1',
//         time: '2024-01-15T10:30:00',
//         type: 'top-up',
//         amount: 50,
//         description: 'Top-up via VNPay',
//     },
//     {
//         id: '2',
//         time: '2024-01-14T15:20:00',
//         type: 'spend',
//         amount: 10,
//         description: 'Advanced JavaScript Course',
//         category: 'course',
//     },
//     {
//         id: '3',
//         time: '2024-01-13T09:10:00',
//         type: 'spend',
//         amount: 5,
//         description: 'Download document',
//         category: 'document',
//     },
//     {
//         id: '4',
//         time: '2024-01-12T18:45:00',
//         type: 'spend',
//         amount: 8,
//         description: 'Watch video lesson',
//         category: 'video',
//     },
//     {
//         id: '5',
//         time: '2024-01-11T14:00:00',
//         type: 'top-up',
//         amount: 20,
//         description: 'Top-up via Stripe',
//     },
// ];

// const balance = 120;

// function getTransactionIcon(transaction: Transaction) {
//     if (transaction.type === 'top-up') return <Download className="text-green-500" size={22} />;
//     switch (transaction.category) {
//         case 'course': return <LibraryBig className="text-blue-500" size={22} />;
//         case 'video': return <Video className="text-purple-500" size={22} />;
//         case 'document': return <FileText className="text-orange-500" size={22} />;
//         default: return <Minus className="text-red-500" size={22} />;
//     }
// }

// function formatDate(dateString: string) {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('vi-VN', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//     });
// }

// export default function TransactionHistoryPage() {
//     const router = useRouter();
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-2 sm:px-4">
//             <div className="max-w-2xl mx-auto">
//                 {/* Balance summary */}
//                 <div className="flex items-center gap-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
//                     <HandCoins className="text-yellow-300" size={36} />
//                     <div>
//                         <div className="text-lg font-semibold">Current Balance</div>
//                         <div className="flex items-baseline gap-2">
//                             <span className="text-3xl font-bold">{balance}</span>
//                             <span className="text-lg text-blue-100">tokens</span>
//                         </div>
//                         <div className="text-xs text-blue-100">1 token = 1,000 VND</div>
//                     </div>
//                 </div>

//                 {/* Transaction List */}
//                 <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
//                     <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction History</h2>
//                     <ul className="divide-y divide-gray-100">
//                         {sampleTransactions.map((tx) => (
//                             <li key={tx.id} className="flex items-center gap-4 py-4">
//                                 <div className="flex-shrink-0">
//                                     <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shadow-sm">
//                                         {getTransactionIcon(tx)}
//                                     </div>
//                                 </div>
//                                 <div className="flex-1 min-w-0">
//                                     <div className="flex items-center gap-2">
//                                         <span className="font-semibold text-gray-900 text-base capitalize">
//                                             {tx.type === 'top-up' ? 'Top-up' : 'Spend'}
//                                         </span>
//                                         <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tx.type === 'top-up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                                             }`}>
//                                             {tx.type === 'top-up' ? 'Income' : 'Expense'}
//                                         </span>
//                                     </div>
//                                     <div className="text-gray-500 text-sm truncate">{tx.description}</div>
//                                     <div className="text-gray-400 text-xs mt-1">{formatDate(tx.time)}</div>
//                                 </div>
//                                 <div className="flex flex-col items-end min-w-[70px]">
//                                     <span className={`text-lg font-bold ${tx.type === 'top-up' ? 'text-green-600' : 'text-red-600'
//                                         }`}>
//                                         {tx.type === 'top-up' ? '+' : '-'}{tx.amount}
//                                     </span>
//                                     <span className="text-xs text-gray-400">tokens</span>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// }

'use client';

import React, { useEffect, useState } from 'react';
import { HandCoins, Download, Minus, LibraryBig, Video, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetchTransactions, fetchWalletBalance, Transaction } from '@/api/wallet';

function getTransactionIcon(transaction: Transaction) {
    if (transaction.type === 'top_up') return <Download className="text-green-500" size={22} />;
    const category = transaction.category;
    switch (category) {
        case 'course': return <LibraryBig className="text-blue-500" size={22} />;
        case 'video': return <Video className="text-purple-500" size={22} />;
        case 'document': return <FileText className="text-orange-500" size={22} />;
        default: return <Minus className="text-red-500" size={22} />;
    }
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function TransactionHistoryPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [txList, walletBalance] = await Promise.all([
                    fetchTransactions(),
                    fetchWalletBalance(),
                ]);
                setTransactions(txList);
                setBalance(walletBalance);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu giao dịch:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-2 sm:px-4">
            <div className="max-w-2xl mx-auto">
                {/* Balance summary */}
                <div className="flex items-center gap-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
                    <HandCoins className="text-yellow-300" size={36} />
                    <div>
                        <div className="text-lg font-semibold">Current Balance</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold">{balance}</span>
                            <span className="text-lg text-blue-100">tokens</span>
                        </div>
                        <div className="text-xs text-blue-100">1 token = 1,000 VND</div>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction History</h2>

                    {loading ? (
                        <div className="text-center text-gray-500 py-6">Loading...</div>
                    ) : !transactions || transactions.length === 0 ? (
                        <div className="text-center text-gray-500 py-6">No transactions found.</div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {transactions.map((tx) => (
                                <li key={tx.id} className="flex items-center gap-4 py-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shadow-sm">
                                            {getTransactionIcon(tx)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900 text-base capitalize">
                                                {tx.type === 'top_up' ? 'Top-up' : 'Spend'}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tx.type === 'top_up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {tx.type === 'top_up' ? 'Income' : 'Expense'}
                                            </span>
                                        </div>
                                        <div className="text-gray-500 text-sm truncate">{tx.description}</div>
                                        <div className="text-gray-400 text-xs mt-1">{formatDate(tx.created_at)}</div>
                                    </div>
                                    <div className="flex flex-col items-end min-w-[70px]">
                                        <span className={`text-lg font-bold ${tx.type === 'top_up' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'top_up' ? '+' : '-'}{tx.amount}
                                        </span>
                                        <span className="text-xs text-gray-400">tokens</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
