"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Teacher {
    _id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
    designation?: string;
    bio?: string;
}

export default function TeacherCarousel() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await fetch("/api/users?role=teacher");
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setTeachers(data.data || []);
                    }
                }
            } catch (err) {
                console.error("Error fetching teachers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    if (!loading && teachers.length === 0) return null;

    // Create a duplicated list for seamless looping
    // We triplicate the list to ensure there's always content visible during the animation reset
    const displayTeachers = [...teachers, ...teachers, ...teachers];

    return (
        <section 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="w-full py-20 relative overflow-hidden bg-white/50 backdrop-blur-sm rounded-[3rem] border border-white/50 shadow-sm"
        >
            {/* Background Glows */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#6C5DD3]/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FF4C4C]/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-[1300px] mx-auto px-4 sm:px-6 relative z-10 mb-12">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C5DD3]/10 text-[#6C5DD3] text-[11px] font-black uppercase tracking-widest mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6C5DD3] animate-pulse"></span>
                        Expert Instructors
                    </div>
                    <h2 className="text-[32px] md:text-[40px] font-black text-gray-900 leading-tight">
                        আমাদের দক্ষ <span className="text-[#6C5DD3]">ম্যাকাল ট্রেইনারগণ</span>
                    </h2>
                    <p className="text-gray-500 font-medium mt-2 max-w-xl mx-auto">
                        দেশসেরা ইন্ডাস্ট্রি এক্সপার্টদের কাছ থেকে শিখুন এবং নিজের ক্যারিয়ারকে এক ধাপ এগিয়ে নিয়ে যান।
                    </p>
                </div>
            </div>

            {/* Ticker Container */}
            <div className="relative group/ticker">
                <div 
                    className="flex gap-6 w-max animate-ticker"
                    style={{ 
                        animationPlayState: isPaused ? 'paused' : 'running',
                        animationDuration: `${teachers.length * 8}s` // Dynamic duration based on count
                    }}
                >
                    {loading ? (
                        <div className="flex gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-[300px] h-[400px] rounded-[32px] bg-white border border-gray-100 p-6 animate-pulse">
                                    <div className="w-full aspect-square rounded-[24px] bg-gray-100 mb-6"></div>
                                    <div className="h-6 bg-gray-100 rounded-lg w-3/4 mb-4"></div>
                                    <div className="h-4 bg-gray-100 rounded-lg w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        displayTeachers.map((teacher, i) => (
                            <div 
                                key={`${teacher._id}-${i}`}
                                className="w-[300px] group transition-all duration-500"
                            >
                                <div className="relative bg-white rounded-[32px] p-4 border border-gray-100 hover:border-[#6C5DD3]/30 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-20px_rgba(108,93,211,0.2)] transition-all duration-500 flex flex-col h-full group-hover:-translate-y-2">
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden mb-6 bg-gray-50 border border-gray-50">
                                        <img 
                                            src={teacher.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=6C5DD3&color=fff&size=512`} 
                                            alt={teacher.name}
                                            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                        />
                                        
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D1F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                            <button className="w-full py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-white hover:text-[#6C5DD3]">
                                                View Profile
                                            </button>
                                        </div>

                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white shadow-sm">
                                            <p className="text-[10px] font-black text-[#6C5DD3] uppercase tracking-wider">Expert</p>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="px-2 pb-2">
                                        <h3 className="text-xl font-black text-gray-900 group-hover:text-[#6C5DD3] transition-colors duration-300">
                                            {teacher.name}
                                        </h3>
                                        <p className="text-gray-500 font-bold text-[13px] mt-1 uppercase tracking-wide opacity-80">
                                            {teacher.designation || "Lead Instructor"}
                                        </p>

                                        <div className="mt-4 flex items-center gap-2 overflow-hidden">
                                            <div className="px-2 py-1 rounded-md bg-[#F8FAFC] border border-gray-100 text-[10px] font-bold text-gray-500">Mentorship</div>
                                            <div className="px-2 py-1 rounded-md bg-[#F8FAFC] border border-gray-100 text-[10px] font-bold text-gray-500">Live Class</div>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-[#6C5DD3]/5 rounded-tl-[32px] rounded-br-[32px] -z-10 group-hover:bg-[#6C5DD3]/10 transition-colors"></div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes ticker {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-33.3333%);
                    }
                }
                .animate-ticker {
                    animation: ticker linear infinite;
                }
            `}</style>
        </section>
    );
}
