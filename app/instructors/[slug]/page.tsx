import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import WhatsappButton from "@/app/components/WhatsappButton";

interface Instructor {
    _id: string;
    name: string;
    designation?: string;
    bio?: string;
    image?: string;
    expertise?: string[];
    slug: string;
    courses: any[];
}

async function getInstructor(slug: string): Promise<Instructor | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/instructors/${slug}`, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const data = await res.json();
        return data.success ? data.data : null;
    } catch (err) {
        console.error("Error fetching instructor:", err);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const instructor = await getInstructor(slug);
    
    if (!instructor) return { title: "Instructor Not Found" };

    return {
        title: `${instructor.name} | Expert Instructor`,
        description: instructor.bio?.substring(0, 160) || `Learn from ${instructor.name}, an expert instructor at our platform.`,
        openGraph: {
            title: instructor.name,
            description: instructor.designation,
            images: instructor.image ? [instructor.image] : [],
        }
    };
}

export default async function InstructorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const instructor = await getInstructor(slug);

    if (!instructor) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                    <div className="text-center">
                        <h1 className="text-4xl font-black text-gray-900 mb-4">Instructor Not Found</h1>
                        <p className="text-gray-500 mb-8">We couldn't find the profile you're looking for.</p>
                        <Link href="/" className="px-8 py-3 bg-[#6C5DD3] text-white rounded-xl font-bold shadow-lg shadow-[#6C5DD3]/20 transition-all hover:scale-105 active:scale-95">
                            Return Home
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />
            
            <main className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6C5DD3]/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF4C4C]/5 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
                        <div className="lg:col-span-5 relative group">
                            <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden bg-[#F8FAFC] border-8 border-white shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                                <img 
                                    src={instructor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&background=6C5DD3&color=fff&size=512`} 
                                    alt={instructor.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            
                            {/* Experience Badge */}
                            <div className="absolute -bottom-6 -right-6 md:right-0 bg-white p-6 rounded-[32px] shadow-xl border border-gray-100 animate-in slide-in-from-bottom-4 duration-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-2xl flex items-center justify-center font-black">
                                        {instructor.courses.length}+
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#6C5DD3]">Courses</p>
                                        <p className="text-sm font-bold text-gray-900">Expert Instructor</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7 space-y-8">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C5DD3]/10 text-[#6C5DD3] text-[11px] font-black uppercase tracking-widest mb-6 border border-[#6C5DD3]/10">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#6C5DD3] animate-pulse"></span>
                                    Verified Instructor
                                </div>
                                <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-4">
                                    {instructor.name}
                                </h1>
                                <p className="text-xl md:text-2xl font-bold text-[#6C5DD3] flex items-center gap-2">
                                    {instructor.designation || "Lead Instructor"}
                                </p>
                            </div>

                            {instructor.expertise && instructor.expertise.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {instructor.expertise.map((skill, i) => (
                                        <span key={i} className="px-4 py-2 bg-[#F8FAFC] border border-gray-100 text-gray-600 rounded-xl text-sm font-bold transition-all hover:bg-[#6C5DD3]/5 hover:border-[#6C5DD3]/20 hover:text-[#6C5DD3]">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="p-8 rounded-[32px] bg-[#F8FAFC]/50 backdrop-blur-sm border border-white shadow-sm">
                                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-3">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C5DD3" strokeWidth="2.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                                    Professional About
                                </h3>
                                <div className="text-gray-600 leading-relaxed text-lg font-medium whitespace-pre-line">
                                    {instructor.bio || "This instructor hasn't provided a bio yet, but they are an expert in their field with years of industry experience."}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Courses Section */}
                    {instructor.courses && instructor.courses.length > 0 && (
                        <div className="pt-12">
                            <div className="flex items-end justify-between mb-10 px-2">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 mb-2">My Courses</h2>
                                    <p className="text-gray-500 font-bold">Comprehensive learning paths designed by {instructor.name.split(' ')[0]}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {instructor.courses.map((course) => (
                                    <Link 
                                        key={course._id} 
                                        href={`/courses/${course.slug}`}
                                        className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:border-[#6C5DD3]/20 shadow-sm hover:shadow-2xl hover:shadow-[#6C5DD3]/10 transition-all duration-500 flex flex-col h-full hover:-translate-y-2"
                                    >
                                        <div className="relative aspect-video overflow-hidden">
                                            <img 
                                                src={course.thumbnail || "/course-placeholder.jpg"} 
                                                alt={course.title} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white shadow-sm transition-transform duration-500 group-hover:scale-110">
                                                <p className="text-[10px] font-black text-[#6C5DD3] uppercase tracking-wider">{course.courseMode}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="p-6 flex flex-col flex-1">
                                            <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-[#6C5DD3] transition-colors line-clamp-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm font-medium mb-6 line-clamp-2">
                                                {course.subtitle}
                                            </p>
                                            
                                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Regular Fee</span>
                                                    <span className="text-lg font-black text-gray-900">৳ {course.regularFee.toLocaleString()}</span>
                                                </div>
                                                <div className="w-10 h-10 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-full flex items-center justify-center transition-all duration-500 group-hover:bg-[#6C5DD3] group-hover:text-white group-hover:rotate-45">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
            <WhatsappButton />
        </div>
    );
}
