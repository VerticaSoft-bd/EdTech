'use client';

import React, { useState, useEffect, useCallback } from 'react';
import HeroSlidePreview from './HeroSlidePreview';

const FALLBACK_SLIDES = [
    {
        tag: "NEXT-GEN LEARNING",
        title: "Master AI-Driven Development",
        highlight: "AI-Driven",
        description: "Harness the power of Artificial Intelligence to build faster, smarter, and more efficient applications.",
        primaryBtn: "Start AI Journey",
        secondaryBtn: "Free AI Workshop",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
        color: "#6C5DD3"
    },
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
        title: "Expert-Led Tech Career Track",
        highlight: "Career Track",
        description: "Build a professional portfolio and get hired by top tech companies worldwide with our AI-integrated curriculum.",
        primaryBtn: "View Syllabus",
        secondaryBtn: "Success Stories",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=1200&auto=format&fit=crop",
        color: "#EF4444"
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
        <section className="w-full relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-[#0F1117] h-[650px] md:min-h-[500px] lg:h-[600px] group shadow-2xl border border-white/5">
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

            {/* Pagination Indicators - Vertical & Smart */}
            <div className="absolute top-1/2 -translate-y-1/2 left-8 z-20 flex flex-col gap-3">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`transition-all duration-500 rounded-full border ${idx === current ? 'h-10 w-2.5 bg-white border-white' : 'h-2.5 w-2.5 bg-transparent border-white/20 hover:border-white/50'
                            }`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <div className="hidden md:flex absolute right-12 bottom-12 z-20 gap-4">
                <button
                    onClick={() => setCurrent(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
                    className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-110 shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-110 shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6 6-6" className="rotate-180 origin-center" /></svg>
                </button>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scan {
                    0% { top: -10%; }
                    100% { top: 110%; }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }
                .animate-scan {
                    animation: scan 4s linear infinite;
                }
            `}</style>
        </section>
    );
}
