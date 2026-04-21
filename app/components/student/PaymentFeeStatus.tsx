"use client";

import React, { useState } from 'react';
import FeeStatusCard from '../FeeStatusCard';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface PaymentFeeStatusProps {
    totalFee: number;
    paidAmount: number;
    dueAmount: number;
    nextDueDate: string;
    currency: string;
    studentEmail: string;
}

const PaymentFeeStatus: React.FC<PaymentFeeStatusProps> = ({
    totalFee,
    paidAmount,
    dueAmount,
    nextDueDate,
    currency,
    studentEmail
}) => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayNow = async () => {
        if (dueAmount <= 0) {
            toast.success("You have no outstanding dues. Thank you!");
            return;
        }

        setIsProcessing(true);
        toast.loading("Initializing payment...");

        try {
            const res = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: dueAmount,
                    courseName: "Due Payment",
                    email: studentEmail
                })
            });

            toast.dismiss();

            if (res.status === 401) {
                toast.error("Please login to proceed");
                router.push('/login');
                return;
            }

            const data = await res.json();

            if (res.ok && data.payment_url) {
                toast.success("Redirecting to payment gateway...");
                window.location.href = data.payment_url;
            } else {
                toast.error(data.error || "Failed to initialize payment");
            }
        } catch (error) {
            toast.dismiss();
            console.error("Payment Error:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleHistory = () => {
        const historySection = document.getElementById('transaction-history');
        if (historySection) {
            historySection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="h-full">
            <Toaster position="top-right" />
            <FeeStatusCard
                totalFee={totalFee}
                paidAmount={paidAmount}
                nextDueDate={nextDueDate}
                currency={currency}
                onPayNow={handlePayNow}
                onHistory={handleHistory}
            />
            {isProcessing && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9999] flex items-center justify-center">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-[#6C5DD3] border-t-transparent rounded-full animate-spin"></div>
                        <p className="font-bold text-[#1A1D1F]">Processing Payment...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentFeeStatus;
