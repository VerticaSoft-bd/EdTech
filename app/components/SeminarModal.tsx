'use client';

import React, { useEffect, useState } from 'react';

interface SeminarModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SeminarModal({ isOpen, onClose }: SeminarModalProps) {
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
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div
                className={`relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-300 transform ${isOpening ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
            >
                {/* Header Image/Pattern */}
                <div className="h-32 bg-gradient-to-br from-[#3972CA] to-[#6C5DD3] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <circle cx="2" cy="2" r="1" fill="white" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#dots)" />
                        </svg>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors text-white"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                    <div className="absolute bottom-6 left-8">
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded mb-2 inline-block animate-pulse uppercase tracking-wider">Free Workshop</span>
                        <h2 className="text-2xl font-bold text-white">Join our Live Seminar</h2>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                    <p className="text-gray-600 mb-6 font-medium">Fill in your details to secure your spot for the upcoming free career guidance masterclass.</p>

                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Success! You are registered.'); onClose(); }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800 tracking-tight">Mobile Number</label>
                                <input
                                    type="tel"
                                    placeholder="ফোন নাম্বার দিন"
                                    className="w-full px-4 py-3.5 rounded-2xl border border-blue-50 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all font-medium text-sm"
                                    required
                                />
                                <p className="text-[10px] text-gray-400 font-bold">*ক্লাসের নোটিফিকেশন পেতে*</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800 tracking-tight">Email</label>
                                <input
                                    type="email"
                                    placeholder="ইমেইল দিন"
                                    className="w-full px-4 py-3.5 rounded-2xl border border-blue-50 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all font-medium text-sm"
                                    required
                                />
                                <p className="text-[10px] text-gray-400 font-bold">*ক্লাস জয়েনিং লিঙ্ক পেতে*</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800 tracking-tight">Name</label>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full px-4 py-3.5 rounded-2xl border border-blue-50 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all font-medium text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800 tracking-tight">Profession</label>
                                <input
                                    type="text"
                                    placeholder="Your Profession"
                                    className="w-full px-4 py-3.5 rounded-2xl border border-blue-50 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all font-medium text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full bg-[#FBBC05] hover:bg-[#eaa900] text-gray-900 font-black py-4 rounded-2xl transition-all shadow-lg shadow-yellow-500/20 active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
                            >
                                লাইভ ডেমো ক্লাস বুক করুন
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            </button>
                            <p className="text-center text-[11px] text-gray-400 mt-4 px-4 leading-relaxed italic">
                                * Limited seats available. You will receive a confirmation call and an SMS with joining instructions.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
