"use client";

import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function PublicOtherPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPageContent = async () => {
            try {
                const res = await fetch(`/api/settings/pages/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setPageData(data.data);
                    } else {
                        setError("Page not found");
                    }
                } else {
                    setError("Failed to load page content");
                }
            } catch (err) {
                console.error("Error fetching page content", err);
                setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchPageContent();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6C5DD3]"></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !pageData) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-500">{error || "Page Not Found"}</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1A1D1F] flex flex-col">
            <Header />

            <main className="flex-1 w-full max-w-[1000px] mx-auto px-6 py-16 md:py-24">
                <div className="bg-white rounded-[32px] p-8 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 pb-8 border-b border-gray-100 leading-tight">
                        {pageData.title}
                    </h1>
                    
                    <div 
                        className="dynamic-content text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: pageData.content }}
                    />
                    <style jsx global>{`
                        .dynamic-content h1, .dynamic-content h2, .dynamic-content h3 {
                            color: #1A1D1F;
                            font-weight: 800;
                            margin-top: 2rem;
                            margin-bottom: 1rem;
                        }
                        .dynamic-content h1 { font-size: 2rem; }
                        .dynamic-content h2 { font-size: 1.5rem; }
                        .dynamic-content h3 { font-size: 1.25rem; }
                        .dynamic-content p { margin-bottom: 1.25rem; }
                        .dynamic-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
                        .dynamic-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.25rem; }
                        .dynamic-content li { margin-bottom: 0.5rem; }
                        .dynamic-content img { max-width: 100%; height: auto; border-radius: 1rem; margin: 2rem 0; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                        .dynamic-content table { width: 100%; border-collapse: collapse; margin-bottom: 1.25rem; }
                        .dynamic-content th, .dynamic-content td { border: 1px solid #E5E7EB; padding: 0.75rem; text-align: left; }
                        .dynamic-content th { background-color: #F9FAFB; font-weight: 700; color: #1A1D1F; }
                    `}</style>
                </div>
            </main>

            <Footer />
        </div>
    );
}
