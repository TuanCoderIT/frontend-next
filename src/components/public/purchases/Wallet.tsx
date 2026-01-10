'use client';

import { ChevronDown, ChevronUp, CirclePlus, Download, FileText, HandCoins, History, LibraryBig, Minus, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchTransactions, fetchWalletBalance, Transaction } from '@/api/wallet';

export default function Wallet() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [showAllTransactions, setShowAllTransactions] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'top_up' | 'spend'>('all');

    const filteredTransactions = transactions.filter(transaction => {
        if (selectedFilter === 'all') return true;
        return transaction.type === selectedFilter;
    });

    const displayedTransactions = showAllTransactions
        ? filteredTransactions
        : filteredTransactions.slice(0, 5);

    const handleTopUpClick = () => {
        router.push('/wallet/payment');
    };

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

    const getTransactionIcon = (transaction: Transaction) => {
        if (transaction.type === 'top_up') return <Download className="text-green-500" />;

        switch (transaction.category) {
            case 'course': return <LibraryBig className="text-blue-500" />;
            case 'video': return <Video className="text-purple-500" />;
            case 'document': return <FileText className="text-orange-500" />;
            default: return <Minus className="text-red-500" />;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Ví của tôi</h1>
                    <p className="text-gray-600">Quản lý tokens và xem lịch sử giao dịch</p>
                </div>

                {/* Balance Card */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">Current Balance</p>
                            <div className="flex items-center gap-3">
                                <HandCoins className="text-2xl text-yellow-300" />
                                <span className="text-4xl font-bold">{balance.toLocaleString()}</span>
                                <span className="text-xl text-blue-100">tokens</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-blue-100 text-sm">≈ {(balance * 1000).toLocaleString('vi-VN')} VND</p>
                            <p className="text-blue-100 text-xs">1 token = 1,000 VND</p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Download className="text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Tổng số nạp</h3>
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                            {transactions.filter(t => t.type === 'top_up').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <Minus className="text-red-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Tổng số chi</h3>
                        </div>
                        <p className="text-2xl font-bold text-red-600">
                            {transactions.filter(t => t.type === 'spend').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <History className="text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Tổng số giao dịch</h3>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                            {transactions.length}
                        </p>
                    </div>
                </div>

                {/* Top Up Button */}
                <div className="text-center my-6">
                    <button
                        onClick={handleTopUpClick}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-3 mx-auto"
                    >
                        <CirclePlus />
                        Nạp Tokens
                    </button>
                </div>

                {/* Transaction History */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <History className="text-gray-600 text-xl" />
                            <h2 className="text-2xl font-bold text-gray-900">Lịch sử giao dịch</h2>
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-2">
                            {(['all', 'top_up', 'spend'] as const).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setSelectedFilter(filter)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedFilter === filter
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {filter === 'all' ? 'Tất cả' : filter === 'top_up' ? 'Nạp' : 'Chi tiêu'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Transaction Cards */}
                    <div className="block lg:hidden">
                        {displayedTransactions.length === 0 ? (
                            <div className="text-center py-12">
                                <History className="text-gray-300 text-4xl mx-auto mb-4" />
                                <p className="text-gray-500">Không tìm thấy giao dịch</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {displayedTransactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                    {getTransactionIcon(transaction)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{transaction.description}</p>
                                                    <p className="text-sm text-gray-500">{formatDate(transaction.created_at)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-lg font-bold ${transaction.type === 'top_up' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {transaction.type === 'top_up' ? '+' : '-'}{transaction.amount}
                                                </span>
                                                <p className="text-xs text-gray-500 capitalize">{transaction.type}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Desktop Transaction Table */}
                    <div className="hidden lg:block">
                        {displayedTransactions.length === 0 ? (
                            <div className="text-center py-12">
                                <History className="text-gray-300 text-4xl mx-auto mb-4" />
                                <p className="text-gray-500">Không tìm thấy giao dịch</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">Thời gian</th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">Loại</th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">Mô tả</th>
                                            <th className="text-right py-4 px-4 font-semibold text-gray-700">Số lượng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedTransactions.map((transaction) => (
                                            <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-4 text-gray-600">
                                                    {formatDate(transaction.created_at)}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            {getTransactionIcon(transaction)}
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${transaction.type === 'top_up'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {transaction.type}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 font-medium text-gray-900">
                                                    {transaction.description}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <span className={`text-lg font-bold ${transaction.type === 'top_up' ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {transaction.type === 'top_up' ? '+' : '-'}{transaction.amount}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Show More/Less Button */}
                    {filteredTransactions.length > 5 && (
                        <div className="text-center mt-6">
                            <button
                                onClick={() => setShowAllTransactions(!showAllTransactions)}
                                className="flex items-center gap-2 mx-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
                            >
                                {showAllTransactions ? (
                                    <>
                                        <ChevronUp />
                                        Hiện ít hơn
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown />
                                        Hiện thêm ({filteredTransactions.length - 5} more)
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
