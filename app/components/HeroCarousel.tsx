'use client';

import React, { useState, useEffect, useCallback } from 'react';

const SLIDES = [
    {
        tag: "LIVE LEARNING PLATFORM",
        title: "Skill up with Live Courses",
        highlight: "Live Courses",
        description: "Join thousands of learners mastering new skills with industry experts in real-time.",
        primaryBtn: "Browse Courses",
        secondaryBtn: "Free Seminar",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
        color: "#3972CA"
    },
    {
        tag: "CAREER TRACK PROGRAM",
        title: "Master UI/UX Design Trends",
        highlight: "Design Trends",
        description: "Build a professional portfolio and get hired by top tech companies worldwide.",
        primaryBtn: "View Syllabus",
        secondaryBtn: "Success Stories",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=1200&auto=format&fit=crop",
        color: "#EF4444"
    },
    {
        tag: "AI & DATA SCIENCE",
        title: "Future-proof your Career",
        highlight: "your Career",
        description: "Learn Python, ML, and AI Automation to stay ahead in the rapidly evolving job market.",
        primaryBtn: "Start Learning",
        secondaryBtn: "AI Workshop",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
        color: "#10B981"
    }
];

export default function HeroCarousel({ onOpenModal }: { onOpenModal: () => void }) {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const nextSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
        setTimeout(() => setIsAnimating(false), 800);
    }, [isAnimating]);

    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <section className="w-full relative overflow-hidden rounded-[2.5rem] bg-[#EEF2F6] min-h-[500px] lg:h-[600px] group">
            {SLIDES.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out flex flex-col lg:flex-row items-stretch overflow-hidden ${index === current ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-full z-0'
                        }`}
                >
                    {/* Left Content */}
                    <div className="flex-1 p-8 md:p-14 lg:pr-0 z-10 w-full lg:w-[45%] flex flex-col justify-center my-auto transition-all duration-700 delay-300"
                        style={{ transform: index === current ? 'translateY(0)' : 'translateY(20px)', opacity: index === current ? 1 : 0 }}
                    >
                        <div className="flex items-center gap-2 mb-6 animate-fade-in">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: slide.color }}></span>
                            <span className="text-[11px] font-extrabold tracking-[0.1em] uppercase" style={{ color: slide.color }}>{slide.tag}</span>
                        </div>
                        <h1 className="text-[40px] md:text-[52px] lg:text-[56px] font-extrabold leading-[1.1] text-[#1A1D2D] tracking-tight mb-6">
                            {slide.title.split(slide.highlight)[0]}
                            <span style={{ color: slide.color }}>{slide.highlight}</span>
                            {slide.title.split(slide.highlight)[1]}
                        </h1>
                        <p className="text-[17px] text-[#5A6B80] font-medium max-w-[420px] leading-[1.6] mb-10">
                            {slide.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <button className="px-7 py-3.5 text-white font-bold rounded-xl transition text-[15px] flex items-center gap-2 hover:scale-105 active:scale-95 duration-300 shadow-lg shadow-blue-500/20"
                                style={{ backgroundColor: slide.color }}>
                                {slide.primaryBtn}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                            <button
                                onClick={onOpenModal}
                                className="px-8 py-3.5 bg-white text-gray-800 font-bold rounded-xl hover:bg-gray-50 transition text-[15px] border border-gray-100 shadow-sm hover:shadow-md">
                                {slide.secondaryBtn}
                            </button>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center gap-4 opacity-60">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs font-bold text-[#1A1D2D]">Join 10k+ learners</span>
                        </div>
                    </div>

                    {/* Right Image Container */}
                    <div className="w-full lg:w-[55%] relative h-[300px] lg:h-auto overflow-hidden">
                        <div
                            className="absolute inset-0 transition-transform duration-[2000ms] ease-out"
                            style={{
                                clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)',
                                transform: index === current ? 'scale(1)' : 'scale(1.1)'
                            }}
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-black/5"></div>
                        </div>

                        {/* Floating elements */}
                        <div className={`absolute bottom-10 right-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20 transition-all duration-1000 delay-500 ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Verified</p>
                                    <p className="text-sm font-bold text-gray-900">Industry Expert Mentor</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Pagination Indicators */}
            <div className="absolute bottom-8 left-14 z-20 flex gap-2">
                {SLIDES.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`h-1.5 transition-all duration-500 rounded-full ${idx === current ? 'w-8 bg-[#3972CA]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                            }`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <div className="absolute right-8 bottom-8 z-20 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => setCurrent(prev => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center text-gray-800 hover:bg-white transition-colors shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center text-gray-800 hover:bg-white transition-colors shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6 6-6" className="rotate-180 origin-center" /></svg>
                </button>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }
            `}</style>
        </section>
    );
}
