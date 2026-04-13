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
    slug?: string;
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
                        আমাদের দক্ষ <span className="text-[#6C5DD3]">ট্রেইনারগণ</span>
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
                                <div key={i} className="w-[300px] rounded-[48px] bg-white border border-gray-100 p-8 shadow-sm animate-pulse">
                                    <div className="w-32 h-32 mx-auto rounded-[32px] bg-gray-100 mb-8"></div>
                                    <div className="h-6 bg-gray-100 rounded-lg w-3/4 mx-auto mb-4"></div>
                                    <div className="h-4 bg-gray-100 rounded-lg w-1/2 mx-auto mb-6"></div>
                                    <div className="flex justify-center gap-2">
                                        <div className="h-6 w-20 bg-gray-100 rounded-md"></div>
                                        <div className="h-6 w-20 bg-gray-100 rounded-md"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        displayTeachers.map((teacher, i) => (
                            <div 
                                key={`${teacher._id}-${i}`}
                                className="w-[300px] group py-8"
                            >
                                <div className="relative bg-white rounded-[40px] p-8 border border-gray-100 hover:border-[#6C5DD3]/20 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-20px_rgba(108,93,211,0.15)] transition-all duration-500 flex flex-col items-center h-full group-hover:-translate-y-3">
                                    
                                    {/* Image Container */}
                                    <div className="relative mb-8 group/img">
                                        <div className="w-32 h-32 rounded-[32px] overflow-hidden bg-gray-50 border-4 border-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] group-hover:shadow-[#6C5DD3]/30 transition-all duration-500 relative z-10">
                                            <img 
                                                src={teacher.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=6C5DD3&color=fff&font-size=0.35`} 
                                                alt={teacher.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#6C5DD3]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                                <Link 
                                                    href={`/instructors/${teacher.slug || teacher._id}`}
                                                    className="px-4 py-2 bg-white/90 backdrop-blur-md text-[#6C5DD3] rounded-xl font-black text-[10px] uppercase tracking-wider transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 shadow-xl"
                                                >
                                                    Profile
                                                </Link>
                                            </div>
                                        </div>
                                        
                                        {/* Expert Badge */}
                                        <div className="absolute -top-2 -right-2 bg-[#6C5DD3] text-white px-3 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#6C5DD3]/30 z-20 border-2 border-white">
                                            Expert
                                        </div>

                                        {/* Decorative Rings */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border border-[#6C5DD3]/10 rounded-full scale-90 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-700 -z-0"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-[#6C5DD3]/5 rounded-full scale-75 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-0"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="text-center w-full">
                                        <h3 className="text-xl font-black text-gray-900 group-hover:text-[#6C5DD3] transition-colors duration-300 leading-tight">
                                            <Link href={`/instructors/${teacher.slug || teacher._id}`}>
                                                {teacher.name}
                                            </Link>
                                        </h3>
                                        <p className="text-[#6C5DD3]/60 font-black text-[11px] mt-2 uppercase tracking-[0.15em]">
                                            {teacher.designation || "Lead Instructor"}
                                        </p>

                                        <div className="mt-6 flex items-center justify-center gap-2">
                                            <div className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-500">Mentorship</div>
                                            <div className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-500">Live Class</div>
                                        </div>
                                    </div>
                                    
                                    {/* Subtle Bottom Accent */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-100 rounded-full group-hover:bg-[#6C5DD3]/20 group-hover:w-20 transition-all duration-500"></div>
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
