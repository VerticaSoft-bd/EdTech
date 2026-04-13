"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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
            className="w-full py-20 relative overflow-hidden bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.03)] my-20 group/section"
        >
            {/* Premium Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-[#4A72FF]/20 to-transparent rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-tl from-[#6C5DD3]/20 to-transparent rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-[1300px] mx-auto px-4 sm:px-6 relative z-10 mb-12">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-gray-100 text-[#6C5DD3] text-[11px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6C5DD3] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6C5DD3]"></span>
                        </span>
                        Trusted By Industry Leaders
                    </div>
                    <h2 className="text-[28px] md:text-[42px] font-black text-gray-900 leading-tight tracking-tight">
                        Partnerships That <span className="bg-gradient-to-r from-[#4A72FF] to-[#6C5DD3] bg-clip-text text-transparent">Empower Future</span>
                    </h2>
                    <p className="mt-4 text-gray-500 font-medium max-w-2xl mx-auto text-sm md:text-base">
                        Collaboration with 100+ global brands to provide world-class education and job opportunities.
                    </p>
                </div>
            </div>

            {/* Ticker Container */}
            <div className="relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 md:before:w-40 before:bg-gradient-to-r before:from-white/40 before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 md:after:w-40 after:bg-gradient-to-l after:after:from-white/40 after:after:to-transparent">
                <div 
                    className={`flex items-center gap-16 md:gap-24 w-max ${brands.length > 0 ? 'animate-ticker-brand' : ''}`}
                    style={{ 
                        animationPlayState: isPaused ? 'paused' : 'running',
                        animationDuration: `${Math.max(brands.length * 5, 25)}s`
                    }}
                >
                    {loading ? (
                        <div className="flex gap-16 px-10">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-[150px] md:w-[200px] h-12 bg-gray-200/50 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        displayBrands.map((brand, i) => (
                            <div 
                                key={`${brand.name}-${i}`}
                                className="w-[120px] md:w-[180px] transition-all duration-700 flex items-center justify-center transform group-hover/section:scale-[0.98] hover:!scale-110"
                            >
                                {brand.link ? (
                                    <Link href={brand.link} target="_blank" className="block relative group/brand">
                                        <img 
                                            src={brand.logo} 
                                            alt={brand.name}
                                            className="h-7 md:h-10 w-auto object-contain transition-all duration-500 grayscale group-hover/brand:grayscale-0 opacity-60 group-hover/brand:opacity-100"
                                        />
                                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-900 text-white text-[8px] font-bold rounded opacity-0 group-hover/brand:opacity-100 transition-opacity whitespace-nowrap">
                                            Visit Website
                                        </div>
                                    </Link>
                                ) : (
                                    <img 
                                        src={brand.logo} 
                                        alt={brand.name}
                                        className="h-7 md:h-10 w-auto object-contain transition-all duration-500 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 cursor-default"
                                    />
                                )}
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
