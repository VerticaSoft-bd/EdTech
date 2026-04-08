"use client";

import React, { useState } from "react";

const BRANDS = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_with_text.svg" },
    { name: "Slack", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" },
    { name: "Zoom", logo: "https://upload.wikimedia.org/wikipedia/commons/9/94/Zoom_Video_Communications_logo.svg" }
];

export default function BrandCarousel() {
    const [isPaused, setIsPaused] = useState(false);

    // Triplicate for seamless looping
    const displayBrands = [...BRANDS, ...BRANDS, ...BRANDS];

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
                    className="flex items-center gap-16 w-max animate-ticker-brand"
                    style={{ 
                        animationPlayState: isPaused ? 'paused' : 'running',
                        animationDuration: '30s'
                    }}
                >
                    {displayBrands.map((brand, i) => (
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
                    ))}
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
