'use client';

import React, { useEffect, useState } from 'react';

interface ComingSoonModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
    const [isRendered, setIsRendered] = useState(false);
    const [isOpening, setIsOpening] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            setTimeout(() => setIsOpening(true), 10);
            document.body.style.overflow = 'hidden';
        } else {
            setIsOpening(false);
            const timer = setTimeout(() => {
                setIsRendered(false);
            }, 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpening ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div
                className={`relative bg-white/95 backdrop-blur-xl w-full max-w-lg rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(108,93,211,0.25)] overflow-hidden transition-all duration-500 transform ${isOpening ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}
            >
                {/* Visual Elements */}
                <div className="absolute top-0 right-0 p-8 pointer-events-none">
                    <div className="w-64 h-64 bg-[#6C5DD3]/10 rounded-full blur-[80px] -mr-32 -mt-32 animate-pulse"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-8 pointer-events-none">
                    <div className="w-64 h-64 bg-[#8E8AFF]/10 rounded-full blur-[80px] -ml-32 -mb-32 animate-pulse"></div>
                </div>

                <div className="relative p-10 flex flex-col items-center text-center">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100/50 hover:bg-gray-100 hover:scale-110 flex items-center justify-center transition-all text-gray-500 hover:text-gray-900 shadow-sm"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>

                    {/* AI Icon / Visual */}
                    <div className="mb-8 relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#8E8AFF] to-[#6C5DD3] rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="relative w-24 h-24 bg-gradient-to-br from-[#8E8AFF] to-[#6C5DD3] rounded-3xl shadow-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500 ease-out">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white drop-shadow-lg">
                                <path d="M12 2L13.8 6.2L18 8L13.8 9.8L12 14L10.2 9.8L6 8L10.2 6.2L12 2Z" fill="white" />
                                <path d="M19 13L20 15.5L22.5 16.5L20 17.5L19 20L18 17.5L15.5 16.5L18 15.5L19 13Z" fill="white" />
                                <circle cx="8" cy="18" r="3" stroke="white" strokeWidth="1.5" strokeDasharray="2 4" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-black text-[#1A1D1F] mb-4 tracking-tight">
                        AI Learning Assistant
                    </h2>

                    {/* Animated Coming Soon Text */}
                    <div className="relative mb-6">
                        <span className="text-4xl font-black bg-gradient-to-r from-[#6C5DD3] via-[#8E8AFF] via-50% to-[#6C5DD3] bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer-fast uppercase tracking-widest drop-shadow-sm">
                            Coming Soon
                        </span>
                        <div className="mt-2 flex justify-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6C5DD3] animate-bounce" style={{ animationDelay: '0s' }}></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6C5DD3] animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6C5DD3] animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-8">
                        Our intelligent AI assistant is currently being trained to help you with your course queries and personalized learning path.
                    </p>

                    {/* Action Button (Notified) */}
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-[#6C5DD3] hover:bg-[#5a4cb5] text-white font-bold rounded-2xl transition-all shadow-lg shadow-[#6C5DD3]/30 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        Got it, Notify Me!
                    </button>
                    
                    <p className="text-[11px] text-gray-400 mt-4 italic">
                        Premium feature for all enrolled students
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer-fast {
                    0% { background-position: 200% center; }
                    100% { background-position: -200% center; }
                }
                .animate-shimmer-fast {
                    animation: shimmer-fast 3s linear infinite;
                }
            `}</style>
        </div>
    );
}
