// app/cv/list/page.tsx
'use client';
import React, { Suspense } from 'react';
import YourCvs from '@/app/components/cv/YourCvs';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function CvListPage() {

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1A1D1F] flex flex-col">
            <Header />
            <main className="flex-1 p-4 sm:p-8">
                <div className="max-w-4xl mx-auto">
                    <Suspense fallback={
                        <div className="flex items-center justify-center p-12">
                            <div className="w-10 h-10 border-4 border-[#6C5DD3] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    }>
                        <YourCvs />
                    </Suspense>
                </div>
            </main>
            <Footer />
        </div>
    );
}