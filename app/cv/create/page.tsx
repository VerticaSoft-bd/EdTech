// app/cv/create/page.tsx
'use client';
import CvBuilder from '@/app/components/cv/CvBuilder';
import { Suspense } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function CreateCvPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1A1D1F] flex flex-col">
            <Header />
            <main className="flex-1">
                <Suspense fallback={<div className="flex items-center justify-center" style={{ height: 'calc(100vh - 150px)' }}>Loading Builder...</div>}>
                    <CvBuilder />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}