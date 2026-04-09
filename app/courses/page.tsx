"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from 'next/link';
import { useSearchParams } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

function CoursesContent() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search") || "";

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch("/api/courses");
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data.data);
                }
            } catch (err) {
                console.error("Error fetching courses", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = !searchQuery || 
            course.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1A1D1F] flex flex-col">
            <Header />

            <main className="flex-1 w-full max-w-[1300px] mx-auto px-4 sm:px-6 py-12 md:py-16">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                            {searchQuery ? `"${searchQuery}" এর ফলাফল` : "আমাদের সকল কোর্সসমূহ"}
                        </h1>
                        <p className="text-gray-500 font-medium">
                            {searchQuery 
                                ? `${filteredCourses.length}টি কোর্স পাওয়া গেছে` 
                                : "আপনার পছন্দের কোর্সটি বেছে নিন এবং আজই শুরু করুন"}
                        </p>
                    </div>
                    
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {loading ? (
                        [...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-[24px] overflow-hidden flex flex-col h-[380px]">
                                <div className="bg-gray-200 h-[200px] w-full"></div>
                                <div className="p-6 flex-1 flex flex-col gap-4">
                                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="mt-auto h-12 bg-gray-200 rounded-xl w-full"></div>
                                </div>
                            </div>
                        ))
                    ) : filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <Link 
                                href={`/courses/${course.slug || course._id}`} 
                                key={course._id} 
                                className="bg-white border border-gray-100 rounded-[24px] overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="relative h-[200px] bg-gray-100 overflow-hidden">
                                    <img 
                                        src={course.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400&auto=format&fit=crop"} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        alt={course.title} 
                                    />
                                    {course.courseMode === 'Online Class' && (
                                        <div className="absolute top-4 right-4 bg-[#EF4444] flex items-center gap-1.5 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-black uppercase tracking-wider shadow-lg">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                            Live
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-4 group-hover:text-[#6C5DD3] transition-colors line-clamp-2">
                                        {course.title}
                                    </h3>
                                    
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs overflow-hidden border border-gray-50">
                                            {course.assignedTeachers?.[0]?.profileImage ? (
                                                <img src={course.assignedTeachers[0].profileImage} alt="Teacher" className="w-full h-full object-cover" />
                                            ) : "🏫"}
                                        </div>
                                        <span className="text-sm text-gray-500 font-medium">
                                            {course.assignedTeachers?.[0]?.name || "V-Soft Ed"}
                                        </span>
                                    </div>

                                    <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Course Fee</span>
                                            <span className="text-xl font-black text-gray-900">
                                                {course.isFree ? "Free" : `৳${course.regularFee}`}
                                            </span>
                                        </div>
                                        <div className="w-11 h-11 bg-gray-50 text-[#6C5DD3] rounded-2xl flex items-center justify-center group-hover:bg-[#6C5DD3] group-hover:text-white transition-all duration-300 shadow-inner">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
                            <p className="text-gray-500 font-bold text-lg">
                                {searchQuery ? "আপনার অনুসন্ধান অনুযায়ী কোনো কোর্স পাওয়া যায়নি।" : "এই ক্যাটাগরিতে কোনো কোর্স পাওয়া যায়নি।"}
                            </p>
                            <button 
                                onClick={() => {
                                    if (searchQuery) {
                                        window.location.href = '/courses';
                                    }
                                }} 
                                className="mt-4 text-[#6C5DD3] font-black underline"
                            >
                                {searchQuery ? "সকল কোর্স দেখুন" : "সকল কোর্স দেখুন"}
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function CoursesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#6C5DD3] border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <CoursesContent />
        </Suspense>
    );
}
