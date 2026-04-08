'use client';

import React from 'react';

interface HeroSlideProps {
    slide: {
        tag: string;
        title: string;
        highlight: string;
        description: string;
        primaryBtn: string;
        secondaryBtn: string;
        image: string;
        color: string;
    };
    isActive: boolean;
    onOpenModal?: () => void;
}

export default function HeroSlidePreview({ slide, isActive, onOpenModal }: HeroSlideProps) {
    return (
        <div
            className={`absolute inset-0 transition-all duration-1000 ease-in-out flex flex-col lg:flex-row items-stretch overflow-hidden ${isActive ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-full z-0'}`}
        >
            {/* Left Content */}
            <div
                className="flex-1 p-6 md:p-8 lg:p-14 lg:pr-0 z-10 w-full lg:w-[45%] flex flex-col justify-center my-auto transition-all duration-700 delay-300"
                style={{
                    transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isActive ? 1 : 0
                }}
            >
                <div className="flex items-center gap-2 mb-4 md:mb-6 animate-fade-in relative z-20">
                    <span className="w-2 h-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ backgroundColor: slide.color }}></span>
                    <span className="text-[10px] md:text-[11px] font-extrabold tracking-[0.2em] uppercase text-white">{slide.tag}</span>
                </div>
                <h1 className="text-[32px] md:text-[40px] lg:text-[52px] xl:text-[60px] font-black leading-[1.05] text-white tracking-tighter mb-4 md:mb-6 italic relative z-20">
                    {slide.title}
                </h1>
                <p className="text-[15px] md:text-[17px] text-white font-medium max-w-[460px] leading-[1.6] mb-6 md:mb-10 relative z-20">
                    {slide.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 md:mb-8 relative z-20">
                    <button
                        className="px-6 py-3 md:px-8 md:py-4 text-white font-bold rounded-xl transition-all text-[14px] md:text-[15px] flex items-center gap-2 hover:scale-105 active:scale-95 duration-300 shadow-[0_0_20px_rgba(0,0,0,0.3)] relative group/btn overflow-hidden"
                        style={{ backgroundColor: slide.color }}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative z-10">{slide.primaryBtn}</span>
                        <svg className="relative z-10" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                    <button
                        onClick={onOpenModal}
                        className="px-8 py-4 bg-white/5 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/10 transition-all text-[15px] border border-white/10 shadow-sm hover:border-white/20"
                    >
                        {slide.secondaryBtn}
                    </button>
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-4 py-4 px-6 bg-white/[0.03] border border-white/[0.05] rounded-2xl w-fit backdrop-blur-sm">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-9 h-9 rounded-full border-2 border-[#0F1117] bg-gray-800 overflow-hidden ring-1 ring-white/10">
                                <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="user" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[13px] font-black text-white leading-none">12.5k+ Learners</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Smart Skill Community</span>
                    </div>
                </div>
            </div>

            {/* Right Image Container */}
            <div className="absolute inset-0 md:relative md:inset-auto w-full lg:w-[55%] h-full lg:h-auto overflow-hidden opacity-30 md:opacity-100 z-0 md:z-10 blur-sm md:blur-none">
                {/* Decorative elements */}
                <div className="absolute top-10 right-10 w-24 h-24 border border-white/10 rounded-full animate-pulse"></div>
                <div className="absolute bottom-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>

                <div
                    className="absolute inset-0 transition-transform duration-[3000ms] ease-out"
                    style={{
                        clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)',
                        transform: isActive ? 'scale(1.05)' : 'scale(1.2)'
                    }}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover object-center scale-110"
                    />
                    {/* Glass overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F1117] via-[#0F1117]/40 to-transparent"></div>

                    {/* Scanning line effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan"></div>
                </div>

                {/* AI Badge */}
                <div className={`absolute top-10 right-8 bg-black/40 backdrop-blur-xl p-3 px-5 rounded-full border border-white/10 transition-all duration-1000 delay-700 ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
                        <span className="text-[11px] font-black text-white tracking-[0.2em]">CORE AI SYSTEMS ACTIVE</span>
                    </div>
                </div>

                {/* Floating elements */}
                <div className={`hidden md:block absolute bottom-12 right-12 bg-white/[0.05] backdrop-blur-2xl p-6 rounded-[2rem] shadow-2xl border border-white/10 transition-all duration-1000 delay-500 max-w-[280px] ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-extrabold text-blue-400">Security Grade</p>
                                <p className="text-base font-black text-white leading-tight">ISO Certified Learning</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Our curriculum is vetted by industry leaders and powered by adaptive AI technologies.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
