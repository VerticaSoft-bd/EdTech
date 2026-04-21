"use client";

import React, { useState, useMemo } from 'react';
import FeeStatusCard from '../FeeStatusCard';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ChevronDown, BookOpen } from 'lucide-react';

interface Enrollment {
    _id: string;
    courseName: string;
    totalCourseFee: number;
    paidAmount: number;
    dueAmount: number;
}

interface PaymentFeeStatusProps {
    enrollments: Enrollment[];
    currency: string;
    studentEmail: string;
}

const PaymentFeeStatus: React.FC<PaymentFeeStatusProps> = ({
    enrollments,
    currency,
    studentEmail
}) => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(enrollments[0]?._id);

    const selectedEnrollment = useMemo(() => 
        enrollments.find(e => e._id === selectedEnrollmentId) || enrollments[0],
    [selectedEnrollmentId, enrollments]);

    if (!selectedEnrollment) return null;

    const { totalCourseFee, paidAmount, dueAmount, courseName } = selectedEnrollment;
    const nextDueDate = dueAmount > 0 ? "Contact Office" : "Paid";

    const handlePayNow = async () => {
        if (dueAmount <= 0) {
            toast.success("You have no outstanding dues for this course. Thank you!");
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
                    courseName: courseName || "Due Payment",
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
        <div className="h-full flex flex-col gap-4">
            <Toaster position="top-right" />
            
            {enrollments.length > 1 && (
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#6C5DD3]">
                        <BookOpen size={18} />
                    </div>
                    <select 
                        value={selectedEnrollmentId}
                        onChange={(e) => setSelectedEnrollmentId(e.target.value)}
                        className="w-full pl-12 pr-10 py-4 bg-[#F8FAFC] border border-gray-200 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all font-bold text-[#1A1D1F] cursor-pointer shadow-sm hover:shadow-md"
                    >
                        {enrollments.map((env) => (
                            <option key={env._id} value={env._id}>
                                {env.courseName}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-hover:text-[#6C5DD3] transition-colors">
                        <ChevronDown size={20} />
                    </div>
                </div>
            )}

            <FeeStatusCard
                totalFee={totalCourseFee}
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
