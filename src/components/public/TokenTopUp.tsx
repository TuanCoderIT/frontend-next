'use client';

import { CirclePoundSterling, IdCard, LoaderCircle } from 'lucide-react';
import React, { useState } from 'react';
import { topUpToken } from '@/api/wallet';

interface TokenTopUpProps {
    onPaymentRedirect?: (paymentUrl: string) => void;
    isLoading?: boolean;
}

const TokenTopUp: React.FC<TokenTopUpProps> = ({
    onPaymentRedirect,
    isLoading = false
}) => {
    const [tokenAmount, setTokenAmount] = useState<number>(0);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const presetAmounts = [10, 20, 50, 100];
    const tokenPrice = 1000; // 1 token = 1,000 VND

    const handlePresetClick = (amount: number) => {
        setTokenAmount(amount);
        setCustomAmount(amount.toString());
    };

    const handleCustomAmountChange = (value: string) => {
        setCustomAmount(value);
        const numValue = parseInt(value) || 0;
        setTokenAmount(numValue);
    };

    // const handleProceedToPayment = async () => {
    //     if (tokenAmount <= 0) return;

    //     setIsProcessing(true);

    //     try {
    //         // Simulate API call to get payment URL
    //         // In real implementation, this would be an actual API call
    //         const response = await fetch('/api/top-up', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 amount: tokenAmount,
    //                 currency: 'VND',
    //             }),
    //         });

    //         const data = await response.json();

    //         if (data.payment_url) {
    //             setShowSuccess(true);
    //             setTimeout(() => {
    //                 onPaymentRedirect?.(data.payment_url);
    //             }, 1500);
    //         }
    //     } catch (error) {
    //         console.error('Payment error:', error);
    //     } finally {
    //         setIsProcessing(false);
    //     }
    // };

    const handleProceedToPayment = async () => {
        if (tokenAmount <= 0) return;

        setIsProcessing(true);

        try {
            const paymentUrl = await topUpToken(tokenAmount);

            if (paymentUrl) {
                setShowSuccess(true); // Hiển thị thông báo
                setTimeout(() => {
                    onPaymentRedirect?.(paymentUrl); // hoặc window.location.href = paymentUrl;
                }, 1500); // đợi 1.5 giây rồi chuyển trang
            }
        } catch (error) {
            console.error('Payment error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const totalPrice = tokenAmount * tokenPrice;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
                        <CirclePoundSterling className="text-white text-2xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Top Up Tokens
                    </h1>
                    <p className="text-gray-600">
                        Purchase tokens to unlock premium features
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    {/* Token Amount Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Number of Tokens
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={customAmount}
                                onChange={(e) => handleCustomAmountChange(e.target.value)}
                                placeholder="Enter token amount"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                                min="1"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <CirclePoundSterling className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Preset Buttons */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Quick Select
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {presetAmounts.map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => handlePresetClick(amount)}
                                    className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${tokenAmount === amount
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                        }`}
                                >
                                    {amount} Tokens
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Display */}
                    {tokenAmount > 0 && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 font-medium">Total Price:</span>
                                <span className="text-2xl font-bold text-green-600">
                                    {totalPrice.toLocaleString('vi-VN')} VND
                                </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                Rate: 1 token = {tokenPrice.toLocaleString('vi-VN')} VND
                            </div>
                        </div>
                    )}

                    {/* Payment Button */}
                    <button
                        onClick={handleProceedToPayment}
                        disabled={tokenAmount <= 0 || isProcessing || isLoading}
                        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${tokenAmount > 0 && !isProcessing && !isLoading
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isProcessing || isLoading ? (
                            <>
                                <LoaderCircle className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <IdCard />
                                Proceed to Payment
                            </>
                        )}
                    </button>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-green-800 font-medium">Payment initiated successfully!</p>
                                <p className="text-green-600 text-sm">Redirecting to payment gateway...</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-blue-900 font-medium mb-1">Payment Information</h3>
                            <p className="text-blue-700 text-sm">
                                We accept payments via VNPay and Stripe. Your payment is secure and encrypted.
                                Tokens will be credited to your account immediately after successful payment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenTopUp; 