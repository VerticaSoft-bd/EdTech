// app/cv/list/page.tsx
'use client';
import YourCvs from '@/app/components/cv/YourCvs';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function CvListPage() {

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1A1D1F] flex flex-col">
            <Header />
            <main className="flex-1 p-4 sm:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* The YourCvs component is self-contained and will handle fetching and display */}
                    <YourCvs />
                </div>
            </main>
            <Footer />
        </div>
    );
}