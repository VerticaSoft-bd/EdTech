import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function RootPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-[#1A1D1F] flex flex-col">
            {/* Shared Header from Student Dashboard */}
            <Header />

            {/* Main Content Area (Ready for Landing Page Content) */}
            <main className="flex-1 flex flex-col items-center justify-center py-32 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#1A1D1F]">
                        Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C5DD3] to-[#FF9AD5]">Potential</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Join Streva today and embark on a smart learning journey designed to accelerate your career in digital creation and engineering.
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <a href="/login" className="px-8 py-4 bg-[#6C5DD3] text-white rounded-2xl font-bold shadow-lg shadow-[#6C5DD3]/30 hover:-translate-y-1 transition-transform">
                            Get Started
                        </a>
                        <a href="/login" className="px-8 py-4 bg-[#F0F2F4] text-[#1A1D1F] rounded-2xl font-bold hover:bg-gray-200 transition-colors">
                            Log In
                        </a>
                    </div>
                </div>
            </main>

            {/* New Modern Footer */}
            <Footer />
        </div>
    );
}
