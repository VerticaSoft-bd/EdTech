"use client";

import React, { Suspense } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";

function PaymentErrorContent() {
    const searchParams = useSearchParams();
    const message = searchParams.get("message") || "Your payment could not be processed.";
    const invoice = searchParams.get("invoice_number");

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            <Header />

            <main className="flex-1 w-full max-w-[800px] mx-auto px-4 py-16 flex items-center justify-center">
                <div className="bg-white p-8 md:p-12 rounded-[24px] shadow-sm border border-gray-100 w-full text-center">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-12 h-12 text-red-500" />
                    </div>

                    <h1 className="text-3xl font-extrabold text-[#1A1D1F] mb-4">Payment Failed</h1>

                    <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left max-w-sm mx-auto">
                        <p className="text-gray-600 mb-2"><strong>Reason:</strong> <span className="text-red-600">{message}</span></p>
                        {invoice && <p className="text-gray-600 text-sm"><strong>Invoice:</strong> {invoice}</p>}
                    </div>

                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Don't worry, no charges were made. You can try your payment again or contact support if you need assistance.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/student-dashboard"
                            className="w-full sm:w-auto px-8 py-4 bg-gray-100 hover:bg-gray-200 text-[#1A1D1F] font-bold rounded-xl transition-colors"
                        >
                            Back to Dashboard
                        </Link>
                        <Link
                            href="/"
                            className="w-full sm:w-auto px-8 py-4 bg-[#6C5DD3] hover:bg-[#5A4CB5] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#6C5DD3]/20"
                        >
                            Browse Courses
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function PaymentErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="w-12 h-12 border-4 border-[#6C5DD3] border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <PaymentErrorContent />
        </Suspense>
    );
}
