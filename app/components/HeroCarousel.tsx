'use client';

import React, { useState, useEffect, useCallback } from 'react';
import HeroSlidePreview from './HeroSlidePreview';

const FALLBACK_SLIDES = [
    {
        tag: "NEXT-GEN LEARNING",
        title: "AI শিখুন, এগিয়ে থাকুন",
        highlight: "AI শিখুন",
        description: "ক্যারিয়ারে এগিয়ে থাকতে এবং অর্থ উপার্জনে — AI-এর কোনো বিকল্প নেই",
        primaryBtn: "Browse Courses",
        secondaryBtn: "Free AI Workshop",
        image: "https://fcom-micro-saas.s3.eu-north-1.amazonaws.com/ed-tech/1775772148294-Firefly_Gemini_Flash.png",
        color: "#2465ff"
    },
    {
        tag: "NEXT-GEN LEARNING",
        title: "SSC-এর পর অবসরে কী করবেন ভাবছেন?",
        highlight: "SSC-এর পর",
        description: "SSC-এর পর অবসর বসে না থেকে নিজেই গডুন নিজের ভবিষ্যৎ — অর্জন করুন Computer Skill, AI Skill এবং Digital Skill",
        primaryBtn: "Browse Courses",
        secondaryBtn: "Free Seminar",
        image: "https://fcom-micro-saas.s3.eu-north-1.amazonaws.com/ed-tech/1775772612680-Firefly_Gemini_Flash_A_powerful_visual_of_Bangladeshi_youth__students__standing_in_a_V-formation_like_a_su_626350.png",
        color: "#6C5DD3"
    },
    {
        tag: "NEXT-GEN LEARNING",
        title: "Skill নেই তাই দুশ্চিন্তাগ্রস্ত? ",
        highlight: "Skill নেই",
        description: "কোনো সমস্যা নেই, আমরা আপনাকে হাতে-কলমে শেখাবো — Real Project, Real Earning এবং Real Transformation",
        primaryBtn: "Browse Courses",
        secondaryBtn: "Success Stories",
        image: "https://fcom-micro-saas.s3.eu-north-1.amazonaws.com/ed-tech/1775772822781-Firefly_A_dramatic_before-and-after_transformation_split_image_of_a_young_Bangladeshi_male_st_68116.png",
        color: "#0e69fb"
    }
];

export default function HeroCarousel({ onOpenModal }: { onOpenModal: () => void }) {
    const [slides, setSlides] = useState<any[]>(FALLBACK_SLIDES);
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const res = await fetch('/api/hero');
                const data = await res.json();
                if (data.success && data.data && data.data.length > 0) {
                    setSlides(data.data);
                }
            } catch (error) {
                console.error("Error fetching hero slides:", error);
            }
        };
        fetchSlides();
    }, []);

    const nextSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        setTimeout(() => setIsAnimating(false), 800);
    }, [isAnimating, slides.length]);

    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <section className="w-full relative overflow-hidden rounded-2xl md:rounded-3xl bg-[#0F1117] h-[650px] md:min-h-[500px] lg:h-[600px] group shadow-2xl border border-white/55">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-0"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-0"></div>

            {slides.map((slide, index) => (
                <HeroSlidePreview
                    key={slide._id || index}
                    slide={slide}
                    isActive={index === current}
                    onOpenModal={onOpenModal}
                />
            ))}

            {/* Pagination Indicators - Vertical for Desktop, Bottom for Mobile */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-8 z-20 flex flex-row md:flex-col gap-3">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`transition-all duration-500 rounded-full border ${idx === current 
                            ? 'w-10 h-2.5 md:h-10 md:w-2.5 bg-white border-white' 
                            : 'h-2.5 w-2.5 bg-transparent border-white/20 hover:border-white/50'
                            }`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <div className="hidden md:flex absolute right-12 bottom-12 z-20 gap-4">
                <button
                    onClick={() => setCurrent(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
                    className="w-12 h-12 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-110 shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-110 shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6 6-6" className="rotate-180 origin-center" /></svg>
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
