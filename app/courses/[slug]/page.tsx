"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useParams } from "next/navigation";

interface IModule {
    _id: string;
    title: string;
    topics: { _id: string; title: string }[];
}

export default function CourseDetails() {
    const { slug } = useParams();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("curriculum");
    const [openModule, setOpenModule] = useState<number>(0);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`/api/courses/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setCourse(data.data);
                } else {
                    console.error("Failed to fetch course:", await res.text());
                }
            } catch (err) {
                console.error("Error fetching course:", err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchCourse();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#6C5DD3] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#1A1D1F] font-bold">Loading Course Details...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-[#1A1D1F] mb-4">Course Not Found</h2>
                    <p className="text-gray-500 mb-8">It looks like the course you are looking for does not exist or has been archived.</p>
                    <a href="/" className="px-6 py-3 bg-[#6C5DD3] text-white font-bold rounded-xl hover:bg-[#5A4CB5] transition">Back to Home</a>
                </div>
            </div>
        );
    }

    const discountedPrice = course.regularFee * (1 - course.discountPercentage / 100);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1A1D1F] flex flex-col">
            <Header />

            <main className="flex-1 w-full max-w-[1300px] mx-auto px-4 sm:px-6 py-12 md:py-16">
                {/* Hero Section Container */}
                <div className="flex flex-col lg:flex-row gap-12 items-start mb-16">
                    {/* Left: Course Information */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#FEE2E2] text-[#EF4444] text-[12px] font-bold rounded-full mb-4">
                                <span className="w-2 h-2 bg-[#EF4444] rounded-full animate-pulse"></span>
                                {course.courseMode || "লাইভ কোর্স"}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1D1F] mb-6 leading-[1.2]">
                                {course.title}
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed font-medium max-w-[700px]">
                                {course.subtitle}
                            </p>
                        </div>

                        {/* CTA and Price Section */}
                        <div className="flex flex-wrap items-center gap-6">
                            <button className="px-8 py-4 bg-[#FBBF24] hover:bg-[#F2B01E] text-slate-900 font-extrabold text-lg rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-yellow-200">
                                ব্যাচে ভর্তি হোন
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>

                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-extrabold text-[#1A1D1F]">
                                    ৳{discountedPrice.toLocaleString()}
                                </span>
                                {course.discountPercentage > 0 && (
                                    <span className="text-xl text-gray-400 font-bold line-through">
                                        ৳{course.regularFee.toLocaleString()}
                                    </span>
                                )}
                                <span className="flex items-center gap-1 text-[#10B981] text-sm font-bold">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    প্রোমো অ্যাপ্লাইড
                                </span>
                                <span className="px-3 py-1 bg-[#D1FAE5] text-[#10B981] text-[10px] font-extrabold uppercase rounded-md tracking-wider">
                                    EARLYBIRD
                                </span>
                            </div>
                        </div>

                        {/* Statistics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-[800px]">
                            {[
                                { icon: "🎥", label: `${course.totalLectures} টি লাইভ ক্লাস` },
                                { icon: "📂", label: `${course.totalProjects} টি প্রজেক্টসমূহ` },
                                { icon: "🗓️", label: "৫৯ দিন বাকি" },
                                { icon: "🎬", label: "২৭৮ টি প্রি রেকর্ডড ভিডিও" }
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm text-sm font-bold text-gray-700">
                                    <span>{stat.icon}</span>
                                    <span>{stat.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Benefits Cards */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 px-6 py-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl text-[#059669] text-sm font-bold">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                                জব প্লেসমেন্ট সাপোর্ট
                            </div>
                            <div className="flex items-center gap-2 px-6 py-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl text-[#059669] text-sm font-bold">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                ক্লাস রেকর্ডিং ও লাইফটাইম এক্সেস
                            </div>
                        </div>
                    </div>

                    {/* Right: Video Preview Card */}
                    <div className="w-full lg:w-[500px] shrink-0">
                        <div className="relative group cursor-pointer overflow-hidden rounded-[24px] shadow-2xl shadow-gray-300">
                            <img
                                src={course.thumbnail || "/images/course-placeholder.jpg"}
                                alt={course.title}
                                className="w-full h-[320px] object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>

                            {/* Video Badge Overlay */}
                            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
                                <div className="flex items-center gap-2 text-white font-bold">
                                    <div className="bg-[#EF4444] p-1.5 rounded-lg">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                    </div>
                                    ক্লিক করে দেখে নিন কোর্সের ডেমো ক্লাস
                                </div>
                            </div>

                            {/* Center Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white animate-pulse">
                                    <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center ml-1">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="#EF4444" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Label Overlay */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-sm">Your code editor,</span>
                                        <span className="text-white font-bold text-xl">Redefined with AI.</span>
                                    </div>
                                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                                        <span className="text-2xl">🐍</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Batch Information Bar */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <div className="p-8">
                            <span className="block text-gray-500 text-xs font-bold uppercase mb-2">ব্যাচ শুরু</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-md font-extrabold text-gray-800">
                                {course.batches?.[0]?.startDate || "বৃহস্পতিবার ৩০ এপ্রিল"}
                            </span>
                        </div>
                        <div className="p-8">
                            <span className="block text-gray-500 text-xs font-bold uppercase mb-2">
                                <span className="mr-2">📅</span>লাইভ ক্লাস
                            </span>
                            <span className="font-extrabold text-gray-800">
                                {course.batches?.[0]?.classTime || "রাত ৯:০০- ১০:৩০ (শনি,সোম)"}
                            </span>
                        </div>
                        <div className="p-8">
                            <span className="block text-gray-500 text-xs font-bold uppercase mb-2">
                                <span className="mr-2">🪑</span>সিট বাকি
                            </span>
                            <span className="font-extrabold text-gray-800 text-xl tracking-tight">৫৪ টি</span>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="block text-gray-500 text-xs font-bold uppercase mb-2 text-[#EF4444]">
                                        <span className="mr-2">🎓</span>ভর্তি চলছে
                                    </span>
                                    <span className="font-extrabold text-gray-800 text-xl">১১তম ব্যাচে</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Section */}
                <div className="relative overflow-hidden rounded-[40px] mb-16 bg-[#050D1F]">
                    {/* Glowing Background Orbs */}
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-0">
                        {/* Left: Text Content */}
                        <div className="flex-1 p-10 md:p-14 space-y-7">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-blue-300 text-[13px] font-black rounded-xl border border-white/10 uppercase tracking-wider">
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                                AI-Powered Learning
                            </span>

                            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                এই কোর্সে <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI ব্যবহার করে</span> শিখবেন কীভাবে কাজ করতে হয়
                            </h2>

                            <p className="text-gray-400 text-[16px] leading-relaxed font-medium max-w-[520px]">
                                শুধু কোড নয়, এই কোর্সে আপনি শিখবেন কীভাবে AI tools ব্যবহার করে real-world সমস্যা সমাধান করতে হয়, Error Handle করতে হয় এবং productivity বাড়াতে হয়।
                            </p>

                            {/* AI Feature Pills */}
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { icon: '🤖', label: 'ChatGPT Integration' },
                                    { icon: '⚡', label: 'GitHub Copilot' },
                                    { icon: '🧠', label: 'AI Error Handling' },
                                    { icon: '🔍', label: 'AI Code Review' },
                                    { icon: '📊', label: 'AI Data Analysis' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/10 hover:border-blue-500/30 transition-all cursor-default">
                                        <span>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-black text-[16px] rounded-2xl hover:from-blue-400 hover:to-purple-500 transition-all shadow-xl shadow-blue-900/40">
                                কোর্সে ভর্তি হোন
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        </div>

                        {/* Right: AI Banner Image */}
                        <div className="w-full lg:w-[520px] shrink-0 relative">
                            {/* Gradient overlay on left edge to blend with text side */}
                            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050D1F] to-transparent z-10 pointer-events-none"></div>
                            <img
                                src="/images/ai-banner.png"
                                alt="AI-Powered Learning"
                                className="w-full h-full object-cover opacity-90 rounded-r-[40px]"
                                style={{ minHeight: '380px', maxHeight: '480px' }}
                            />
                            {/* Floating badge */}
                            <div className="absolute top-6 right-6 z-20 flex flex-col gap-3">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white text-center shadow-xl">
                                    <div className="text-2xl font-black text-blue-300">AI</div>
                                    <div className="text-[11px] font-black text-gray-300 uppercase tracking-wider">Driven</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs and Secondary Content */}
                <div className="space-y-16">
                    {/* Tabs Navigation */}
                    <div className="sticky top-[80px] bg-[#F8FAFC] z-10 pt-4 border-b border-gray-200">
                        <div className="flex items-center justify-between overflow-x-auto no-scrollbar">
                            {[
                                { id: 'curriculum', label: 'কারিকুলাম' },
                                { id: 'benefits', label: 'কোর্স আপনি পাচ্ছেন' },
                                { id: 'projects', label: 'প্রজেক্টসমূহ' },
                                { id: 'audience', label: 'কোর্সটি যাদের জন্য' },
                                { id: 'placements', label: 'জব পেয়েছে যারা' },
                                { id: 'reviews', label: 'রিভিউ' },
                                { id: 'faq', label: 'FAQ' },
                                { id: 'payment', label: 'পেমেন্ট' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-6 font-bold text-[15px] whitespace-nowrap transition-all relative ${activeTab === tab.id ? 'text-[#1A1D1F]' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#6C5DD3] rounded-t-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Demo Class Section */}
                    <section className="text-center space-y-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1D1F]">
                            কোর্সে জয়েন করার আগে ডেমো ক্লাস দেখে নিন
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="relative group cursor-pointer rounded-3xl overflow-hidden shadow-md">
                                    <img
                                        src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop`}
                                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                                        alt="Demo Class"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 group-hover:bg-white/40 transition-all">
                                            <div className="w-10 h-10 bg-[#FBBF24] rounded-full flex items-center justify-center ml-0.5 shadow-lg shadow-yellow-500/20">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Live Demo Class Booking Card */}
                    <section className="bg-[#0B1221] rounded-[40px] p-6 md:p-12 overflow-hidden relative">
                        {/* Decorative glow */}
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                            {/* Left Side: Info */}
                            <div className="flex-1 space-y-8">
                                <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-[13px] font-bold rounded-lg border border-white/10 backdrop-blur-sm">
                                    ফ্রী লাইভ ডেমো ক্লাস
                                </span>
                                <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                                    {course.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5 text-sm font-extrabold text-[#1A1D1F]">
                                        <span className="text-[#EF4444]">📅</span> ৬ই মার্চ
                                    </div>
                                    <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5 text-sm font-extrabold text-[#1A1D1F]">
                                        <span className="text-[#EF4444]">🕒</span> রাত ১০:৩০টা
                                    </div>
                                    <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5 text-sm font-extrabold text-[#1A1D1F]">
                                        <span className="text-[#EF4444]">📍</span> zoom
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Form */}
                            <div className="w-full lg:w-[550px] bg-white rounded-[32px] p-8 md:p-10 shadow-2xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-800">Mobile Number</label>
                                        <input
                                            type="text"
                                            placeholder="ফোন নাম্বার দিন"
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all font-medium"
                                        />
                                        <p className="text-[10px] text-gray-400 font-bold">*ক্লাসের নোটিফিকেশন পেতে*</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-800">Email</label>
                                        <input
                                            type="email"
                                            placeholder="ইমেইল দিন"
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all font-medium"
                                        />
                                        <p className="text-[10px] text-gray-400 font-bold">*ক্লাস জয়েনিং লিঙ্ক পেতে*</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-800">Name</label>
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-800">Profession</label>
                                        <input
                                            type="text"
                                            placeholder="Your Profession"
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <button className="w-full py-5 bg-[#FBBF24] hover:bg-[#F2B01E] text-slate-900 font-black text-lg rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-yellow-200">
                                    লাইভ ডেমো ক্লাস বুক করুন
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Content Section (Tabs Content) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Content */}
                        <div className="lg:col-span-2 space-y-12">
                            {activeTab === 'curriculum' ? (
                                <div className="bg-white p-6 md:p-10 rounded-[32px] border border-gray-100 shadow-sm min-h-[400px] animate-fade-in font-sans">
                                    {/* Section Header */}
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-10 h-[3px] bg-[#6C5DD3] rounded-full"></div>
                                        <h2 className="text-xl md:text-2xl font-black text-[#1A1D1F]">Course Content</h2>
                                    </div>

                                    {/* Modules Accordion */}
                                    <div className="flex flex-col rounded-2xl overflow-hidden border border-gray-200 bg-white">
                                        {course.modules?.map((module: IModule, mIdx: number) => {
                                            const isOpen = openModule === mIdx;
                                            return (
                                                <div key={module._id} className="border-b border-gray-200 last:border-0 flex flex-col">
                                                    {/* Accordion Header */}
                                                    <div
                                                        onClick={() => setOpenModule(isOpen ? -1 : mIdx)}
                                                        className={`flex items-center justify-between p-5 md:px-8 cursor-pointer transition-all duration-300 select-none ${isOpen ? 'bg-[#F8FAFC]' : 'bg-white hover:bg-gray-50'}`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${isOpen ? 'border-[#6C5DD3] text-[#6C5DD3]' : 'border-gray-300 text-gray-400'}`}>
                                                                <span className="text-xl leading-none font-medium mb-0.5">
                                                                    {isOpen ? '−' : '+'}
                                                                </span>
                                                            </div>
                                                            <span className={`font-bold text-[16px] ${isOpen ? 'text-[#6C5DD3]' : 'text-gray-800'}`}>{module.title}</span>
                                                        </div>
                                                        <span className="text-sm text-gray-500 font-bold">{module.topics?.length || 0} Lessons</span>
                                                    </div>

                                                    {/* Accordion Content (Lessons) */}
                                                    {isOpen && (
                                                        <div className="bg-white flex flex-col py-2">
                                                            {module.topics.map((topic: any, tIdx: number) => (
                                                                <div key={topic._id} className="flex items-center justify-between py-4 px-5 md:pl-[4.5rem] md:pr-8 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group">
                                                                    <div className="flex items-center gap-4">
                                                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-[#6C5DD3] transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                        </svg>
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="text-gray-700 font-medium text-[15px] group-hover:text-[#6C5DD3] transition-colors line-clamp-1">{topic.title}</span>
                                                                            {tIdx === 0 && mIdx === 0 && (
                                                                                <span className="px-2.5 py-1 bg-[#EEF2FF] text-[#6C5DD3] text-[10px] font-extrabold rounded-full uppercase tracking-wider leading-none flex items-center justify-center shrink-0">Free</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        <span className="text-xs text-gray-500 font-medium shrink-0">10:00</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Tools & Technologies Section */}
                                    <div className="mt-16 text-center animate-fade-in">
                                        <h2 className="text-2xl md:text-3xl font-black text-[#1A1D1F] mb-10">যেসব টুলস ও টেকনোলজি শিখবেন</h2>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                                            {[
                                                { icon: <div className="text-[#E34F26] text-3xl font-black">HTML</div>, label: "HTML" },
                                                { icon: <div className="text-[#1572B6] text-3xl font-black">CSS</div>, label: "CSS" },
                                                { icon: <div className="w-10 h-10 bg-[#F7DF1E] text-black font-black text-xl flex items-center justify-center rounded">JS</div>, label: "Javascript" },
                                                { icon: <div className="text-[#181717] text-3xl font-black">Git</div>, label: "Git & Git Hub" },
                                                { icon: <div className="text-[#000000] text-3xl font-black">PC</div>, label: "PyCharm" },
                                                { icon: <div className="text-gray-800 text-3xl font-serif">Flask</div>, label: "Flask" },
                                                { icon: <div className="text-[#009688] text-3xl font-black">Fast</div>, label: "Fast" },
                                                { icon: <div className="text-[#1A1D1F] text-2xl font-black border border-gray-200 px-2 rounded">DRF</div>, label: "DRF" },
                                                { icon: <div className="text-[#3776AB] text-3xl font-black">PY</div>, label: "Python" },
                                                { icon: <div className="text-[#092E20] text-3xl font-black">DJ</div>, label: "Django" },
                                                { icon: <div className="text-[#61DAFB] text-3xl font-black">⚛️</div>, label: "React" },
                                                { icon: <div className="text-[#10A37F] text-3xl font-black">AI</div>, label: "ChatGPT" },
                                            ].map((tool, idx) => (
                                                <div key={idx} className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:shadow-md hover:border-gray-200 transition-all cursor-default">
                                                    <div className="h-12 flex items-center justify-center">
                                                        {tool.icon}
                                                    </div>
                                                    <span className="font-bold text-gray-800 text-sm">{tool.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            ) : (
                                <div className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm min-h-[400px] animate-fade-in">
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
                                        <div className="text-5xl text-gray-200">📋</div>
                                        <h3 className="text-xl font-bold text-gray-400">বিস্তারিত তথ্য শীঘ্রই আসছে...</h3>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Floating Summary Card (Sidebar) */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#181C25] rounded-[32px] p-8 text-white sticky top-[100px]">
                                <h3 className="text-xl font-bold mb-6">এই কোর্সে আপনি যা পাচ্ছেন:</h3>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        লাইফটাইম এক্সেস
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        সার্টিফিকেশন প্রজেক্টসমূহ
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        ২৪/৭ মেন্টর সাপোর্ট
                                    </li>
                                </ul>

                                <button className="w-full py-4 bg-[#6C5DD3] text-white font-extrabold text-lg rounded-2xl hover:bg-[#5A4CB5] transition-all shadow-lg shadow-[#6C5DD3]/20">
                                    Enroll Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructors Section */}
                <section className="mt-20 mb-16">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#F59E0B]">
                            ইন্সট্রাক্টর
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(course.assignedTeachers?.length > 0 ? course.assignedTeachers : [
                            { name: "Abdullah Zayed", profileImage: "" },
                            { name: "Yasir Mahabub", profileImage: "" },
                            { name: "Rashidul Islam Rahul", profileImage: "" }
                        ]).map((teacher: any, idx: number) => {
                            const bios = [
                                "Senior Software Engineer at TRAX Technologies Limited | Former Software Engineer at FinAccess Limited | Former Junior Software Engineer at Mediusware Ltd. | Former Back End Developer at Zakirsoft",
                                "Software Engineer at Pillar | Former Associate Software Engineer at Brain Station 23 Limited",
                                "Software Developer at Goama | Former Back End Developer at sundarbanX.com"
                            ];
                            const logos = [
                                <div key={1} className="flex items-center gap-3 opacity-70 grayscale"><span className="font-bold text-[10px]">TRAX</span> <span className="font-bold text-[10px]">FinAccess</span> <span className="font-bold text-[10px]">&lt;mediusware/&gt;</span></div>,
                                <div key={2} className="flex items-center gap-3 opacity-70 grayscale text-[#2563EB]"><span className="font-black tracking-widest text-[12px]">P I L L A R</span> <span className="font-black text-[10px]">BRAIN STATION 23</span></div>,
                                <div key={3} className="flex items-center gap-3 opacity-70 grayscale"><span className="font-black text-[12px] text-purple-700">Goama</span></div>
                            ];

                            return (
                                <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-dashed border-[#A855F7] text-[#A855F7] text-[10px] font-bold rounded uppercase tracking-wide">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                            LEAD INSTRUCTOR
                                        </div>
                                        <img
                                            src={teacher.profileImage || `https://ui-avatars.com/api/?name=${teacher.name}&background=random`}
                                            className="w-16 h-16 rounded-xl object-cover shadow-sm border border-gray-100"
                                            alt={teacher.name}
                                        />
                                    </div>
                                    <h3 className="text-xl font-black text-[#1A1D1F] mb-2">{teacher.name}</h3>
                                    <p className="text-[13px] text-gray-600 font-semibold leading-relaxed mb-6 flex-1">
                                        {bios[idx % bios.length]}
                                    </p>
                                    <div className="bg-[#F8FAFC] p-3 rounded-lg flex items-center justify-start mt-auto">
                                        {logos[idx % logos.length]}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Bottom AI Section */}
                <div className="relative overflow-hidden rounded-[40px] mt-16 bg-[#050D1F]">
                    {/* Glowing orbs */}
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row-reverse items-center gap-0">
                        {/* Right (visually left on lg): Text Content */}
                        <div className="flex-1 p-10 md:p-14 space-y-7">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-purple-300 text-[13px] font-black rounded-xl border border-white/10 uppercase tracking-wider">
                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                                ক্যারিয়ার রেডি
                            </span>

                            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                কোর্স শেষে আপনি <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">চাকরির জন্য প্রস্তুত</span> হয়ে যাবেন
                            </h2>

                            <p className="text-gray-400 text-[16px] leading-relaxed font-medium max-w-[520px]">
                                প্রতিটি মডিউলে real-world project, AI-assisted coding, এবং expert mentorship — সবকিছু মিলিয়ে আপনাকে industry-ready করে তুলবে।
                            </p>

                            {/* Stats Row */}
                            <div className="flex flex-wrap gap-5">
                                {[
                                    { value: course.modules?.length || '৩৩', label: 'মডিউল' },
                                    { value: course.totalLectures || '৭৩', label: 'লাইভ ক্লাস' },
                                    { value: course.totalProjects || '১৫+', label: 'প্রজেক্ট' },
                                ].map((stat, i) => (
                                    <div key={i} className="flex flex-col items-center px-6 py-4 bg-white/5 border border-white/10 rounded-2xl min-w-[90px]">
                                        <span className="text-2xl font-black text-white">{stat.value}</span>
                                        <span className="text-[12px] font-bold text-gray-400 mt-0.5">{stat.label}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-[16px] rounded-2xl hover:from-purple-400 hover:to-pink-400 transition-all shadow-xl shadow-purple-900/40">
                                এখনই ভর্তি হোন
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        </div>

                        {/* Left (visually right on lg): AI Banner Image */}
                        <div className="w-full lg:w-[520px] shrink-0 relative">
                            {/* Gradient overlay on right edge to blend */}
                            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050D1F] to-transparent z-10 pointer-events-none"></div>
                            <img
                                src="/images/ai-banner.png"
                                alt="Career Ready"
                                className="w-full h-full object-cover opacity-90 rounded-l-[40px]"
                                style={{ minHeight: '380px', maxHeight: '480px' }}
                            />
                            {/* Floating badge */}
                            <div className="absolute top-6 left-6 z-20">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white text-center shadow-xl">
                                    <div className="text-2xl font-black text-purple-300">🏆</div>
                                    <div className="text-[11px] font-black text-gray-300 uppercase tracking-wider">Job Ready</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
