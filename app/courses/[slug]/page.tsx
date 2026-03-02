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
    const [activeTab, setActiveTab] = useState("overview");

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
                                লাইভ কোর্স
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

                {/* Tabs and Secondary Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Tabs */}
                        <div className="flex items-center gap-2 border-b border-gray-200 pb-px sticky top-[80px] bg-[#F8FAFC] z-10 pt-4">
                            {['overview', 'curriculum', 'features', 'instructors'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-4 font-bold text-sm capitalize transition-all relative ${activeTab === tab ? 'text-[#6C5DD3]' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    {tab === 'overview' ? 'ওভারভিউ' : tab === 'curriculum' ? 'কারিকুলাম' : tab === 'features' ? 'ফিচার্স' : 'ইন্সট্রাক্টর'}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#6C5DD3] rounded-t-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Contents based on active tab */}
                        <div className="bg-white p-8 md:p-12 rounded-[32px] border border-gray-100 shadow-sm">
                            {activeTab === 'overview' && (
                                <div className="space-y-12 animate-fade-in">
                                    <section>
                                        <h2 className="text-2xl font-extrabold text-[#1A1D1F] mb-6">কোর্স সম্পর্কে বিস্তারিত</h2>
                                        <div className="prose prose-lg text-gray-600 max-w-none font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: course.fullDetails }} />
                                    </section>
                                </div>
                            )}

                            {activeTab === 'curriculum' && (
                                <div className="space-y-8 animate-fade-in">
                                    <h2 className="text-2xl font-extrabold text-[#1A1D1F]">কোর্স কারিকুলাম</h2>
                                    <div className="space-y-4">
                                        {course.modules?.map((module: IModule, idx: number) => (
                                            <details key={module._id} className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden" open={idx === 0}>
                                                <summary className="flex items-center justify-between p-6 cursor-pointer select-none bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-[#6C5DD3]/10 text-[#6C5DD3] flex items-center justify-center font-bold">
                                                            {idx + 1}
                                                        </div>
                                                        <h3 className="font-bold text-lg text-gray-800">{module.title}</h3>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-sm font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                                                            {module.topics.length} Lessons
                                                        </span>
                                                        <svg className="w-6 h-6 text-gray-400 group-open:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </summary>
                                                <div className="px-6 py-4 bg-white border-t border-gray-100">
                                                    <ul className="space-y-3">
                                                        {module.topics.map((topic, tIdx) => (
                                                            <li key={topic._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                                                </div>
                                                                <span className="font-semibold text-gray-700">{topic.title}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'features' && (
                                <div className="space-y-12 animate-fade-in">
                                    <h2 className="text-2xl font-extrabold text-[#1A1D1F] mb-6">কোর্সের বিশেষত্ব</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {course.uniqueFeatures?.map((feature: any, idx: number) => (
                                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-500 flex items-center justify-center shrink-0">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                                                    <p className="text-sm font-medium text-gray-500 leading-relaxed">{feature.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'instructors' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h2 className="text-2xl font-extrabold text-[#1A1D1F]">আপনার ইন্সট্রাক্টরগণ</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {course.assignedTeachers?.map((teacher: any) => (
                                            <div key={teacher._id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5">
                                                <img src={teacher.profileImage || `https://ui-avatars.com/api/?name=${teacher.name}&background=random`} alt={teacher.name} className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-white" />
                                                <div>
                                                    <h3 className="font-extrabold text-lg text-gray-900">{teacher.name}</h3>
                                                    <p className="text-sm font-bold text-[#6C5DD3] capitalize">{teacher.role}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Floating Summary Card (optional or simplified) */}
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
            </main>

            <Footer />
        </div>
    );
}
