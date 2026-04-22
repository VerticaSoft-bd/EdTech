"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as fp from "@/lib/fpixel";


interface EnrollmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: any;
    discountedPrice: number;
}

export default function EnrollmentModal({ isOpen, onClose, course, discountedPrice }: EnrollmentModalProps) {
    const router = useRouter();
    const [paymentType, setPaymentType] = useState<"full" | "partial">("full");
    const [customAmount, setCustomAmount] = useState<number>(discountedPrice);

    // Calculate minimum required payment (e.g., 20% of discounted price)
    const minAmount = Math.ceil(discountedPrice * 0.20);
    const totalModules = course?.modules?.length || 10;

    useEffect(() => {
        if (paymentType === "full") {
            setCustomAmount(discountedPrice);
        } else if (customAmount > discountedPrice) {
            setCustomAmount(discountedPrice);
        } else if (paymentType === "partial" && customAmount < minAmount) {
            setCustomAmount(minAmount);
        }
    }, [paymentType, discountedPrice, minAmount]);

    if (!isOpen || !course) return null;

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = minAmount;
        if (val > discountedPrice) val = discountedPrice;
        setCustomAmount(val);
    };

    const handleEnrollment = () => {
        fp.event("InitiateCheckout", {
            content_name: course.title,
            content_category: "Course",
            content_ids: [course.slug],
            value: customAmount,
            currency: "BDT"
        });
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        let url = `/checkout/${course.slug}`;
        if (paymentType === "partial") {
            url += `?amount=${customAmount}`;
        }

        if (!user || !token) {
            window.location.href = `/login?redirect=${encodeURIComponent(url)}`;
        } else {
            router.push(url);
        }
    };

    // Calculate dynamic unlocked modules
    const unlockPercentage = customAmount / discountedPrice;
    const unlockedModulesCount = Math.max(1, Math.floor(totalModules * unlockPercentage));

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center pt-20 pb-10 px-4">
            {/* Backdrop overlay */}
            <div
                className="absolute inset-0 bg-[#0B1221]/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-full">
                {/* Header */}
                <div className="bg-[#F8FAFC] border-b border-gray-100 p-6 flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-xl font-extrabold text-[#1A1D1F]">Payment Options</h3>
                        <p className="text-sm text-gray-500 font-medium mt-1 truncate max-w-[300px]">{course.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* Body - scrollable area */}
                <div className="p-6 md:p-8 space-y-8 overflow-y-auto">
                    {/* Course Price Box */}
                    <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-5 text-center px-4">
                        <span className="text-[#059669] font-bold text-sm uppercase tracking-wider mb-2 block">Total Course Fee</span>
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-3xl font-black text-[#1A1D1F]">৳{discountedPrice.toLocaleString()}</span>
                            {course.discountPercentage > 0 && (
                                <span className="text-lg text-gray-400 font-bold line-through">৳{course.regularFee.toLocaleString()}</span>
                            )}
                        </div>
                    </div>

                    {/* Payment Type Toggle */}
                    <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl">
                        <button
                            onClick={() => setPaymentType("full")}
                            className={`py-3 px-4 font-bold text-[14px] rounded-lg transition-all ${paymentType === "full" ? "bg-white text-[#6C5DD3] shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
                        >
                            Pay in Full
                        </button>
                        <button
                            onClick={() => setPaymentType("partial")}
                            className={`py-3 px-4 font-bold text-[14px] rounded-lg transition-all ${paymentType === "partial" ? "bg-white text-[#6C5DD3] shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
                        >
                            Installment
                        </button>
                    </div>

                    {/* Dynamic View based on toggle */}
                    <div className="min-h-[160px]">
                        {paymentType === "full" ? (
                            <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-2xl p-6 text-center h-full flex flex-col justify-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-green-500 shadow-sm">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                </div>
                                <h4 className="text-lg font-bold text-[#1A1D1F] mb-2">Unlock Full Course Instantly</h4>
                                <p className="text-gray-600 text-sm font-medium">You will get immediate access to all {totalModules} modules, live classes, support, and resources.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[15px] font-bold text-gray-800 block">How much can you pay today?</label>
                                        <span className="text-xs font-bold bg-[#FEE2E2] text-[#EF4444] px-2 py-1 rounded-md">Min: ৳{minAmount}</span>
                                    </div>

                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-black text-lg">৳</span>
                                        <input
                                            type="number"
                                            value={customAmount}
                                            onChange={handleCustomAmountChange}
                                            min={minAmount}
                                            max={discountedPrice}
                                            className="w-full pl-10 pr-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#6C5DD3] transition-colors font-black text-2xl text-[#1A1D1F] text-center"
                                        />
                                    </div>

                                    {/* Slider */}
                                    <input
                                        type="range"
                                        min={minAmount}
                                        max={discountedPrice}
                                        value={customAmount}
                                        onChange={handleCustomAmountChange}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6C5DD3]"
                                    />
                                    <div className="flex justify-between text-xs font-bold text-gray-400 px-1">
                                        <span>৳{minAmount}</span>
                                        <span>৳{discountedPrice}</span>
                                    </div>
                                </div>

                                {/* Dynamic Preview Box */}
                                <div className="bg-[#F8FAFC] border border-gray-200 rounded-2xl p-5">
                                    <h5 className="text-[13px] font-black text-gray-500 uppercase tracking-widest mb-4">What you unlock today:</h5>

                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0 flex-col">
                                            <span className="text-xl font-black text-[#6C5DD3] leading-none">{unlockedModulesCount}</span>
                                            <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase">Modules</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#1A1D1F] text-[15px] mb-1">
                                                You get access to {unlockedModulesCount} out of {totalModules} modules.
                                            </p>
                                            <p className="text-[12px] text-gray-500 font-medium">
                                                You can pay the remaining due (৳{discountedPrice - customAmount}) anytime from your dashboard to unlock the rest.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-5 space-y-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-[#6C5DD3] to-[#8F85EA] h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${(unlockedModulesCount / totalModules) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-[11px] font-bold text-gray-400">
                                            <span>Start</span>
                                            <span>{unlockedModulesCount}/{totalModules} Unlocked</span>
                                            <span>Finish</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer fixed */}
                <div className="p-6 border-t border-gray-100 bg-white shrink-0">
                    <button
                        onClick={handleEnrollment}
                        className="w-full py-4 bg-[#FBBF24] hover:bg-[#F2B01E] text-slate-900 font-black text-lg rounded-xl transition-all shadow-lg shadow-yellow-200 flex items-center justify-center gap-2"
                    >
                        Proceed to Checkout
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                    <p className="text-center text-[11px] font-bold text-gray-400 mt-3 flex items-center justify-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        Secure Encrypted Checkout
                    </p>
                </div>
            </div>
        </div>
    );
}
