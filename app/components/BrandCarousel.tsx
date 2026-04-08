"use client";

import React, { useState, useEffect } from "react";

export default function BrandCarousel() {
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await fetch("/api/settings");
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data.brands) {
                        setBrands(data.data.brands);
                    }
                }
            } catch (err) {
                console.error("Error fetching brands:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    if (!loading && brands.length === 0) return null;

    // Triplicate for seamless looping
    const displayBrands = [...brands, ...brands, ...brands];

    return (
        <section 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="w-full py-16 relative overflow-hidden bg-white/30 backdrop-blur-md rounded-[3rem] border border-white/50 shadow-sm my-16"
        >
            {/* Background Glows */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#4A72FF]/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#6C5DD3]/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-[1300px] mx-auto px-4 sm:px-6 relative z-10 mb-10">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        Trusted By Industry Leaders
                    </div>
                    <h2 className="text-[24px] md:text-[32px] font-black text-gray-900 leading-tight">
                        100+ Companies Are <span className="text-[#4A72FF]">Connected to Us</span>
                    </h2>
                </div>
            </div>

            {/* Ticker Container */}
            <div className="relative group/ticker">
                <div 
                    className={`flex items-center gap-16 w-max ${brands.length > 0 ? 'animate-ticker-brand' : ''}`}
                    style={{ 
                        animationPlayState: isPaused ? 'paused' : 'running',
                        animationDuration: `${Math.max(brands.length * 4, 20)}s`
                    }}
                >
                    {loading ? (
                        <div className="flex gap-16 px-10">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-[150px] md:w-[200px] h-12 bg-gray-100 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        displayBrands.map((brand, i) => (
                            <div 
                                key={`${brand.name}-${i}`}
                                className="w-[150px] md:w-[200px] transition-all duration-500 flex items-center justify-center"
                            >
                                <img 
                                    src={brand.logo} 
                                    alt={brand.name}
                                    className="h-8 md:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes ticker-brand {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-33.3333%);
                    }
                }
                .animate-ticker-brand {
                    animation: ticker-brand linear infinite;
                }
            `}</style>
        </section>
    );
}
