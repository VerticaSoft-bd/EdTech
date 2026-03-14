"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import EnrollmentModal from "../components/EnrollmentModal";
import {
    ChevronRight, ChevronDown, Check, Play, Video, FolderOpen, CalendarDays,
    Clapperboard, Briefcase, FolderArchive, Loader2, BookOpen, FileText,
    Minus, Plus, CircleCheckBig, ArrowRight, Clock, MapPin, Phone, Mail,
    User, GraduationCap, Star, Trophy, Sparkles, Zap, Brain, Search,
    BarChart3, Bot, BadgeCheck, MonitorSmartphone, Cpu, Wifi, CheckCircle2,
    MessageSquareQuote, Info
} from "lucide-react";

interface IModule {
    _id: string;
    title: string;
    topics: { _id: string; title: string }[];
}

const getYoutubeEmbedUrl = (url: string) => {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com')) {
            return `https://www.youtube.com/embed/${urlObj.searchParams.get('v')}`;
        } else if (urlObj.hostname.includes('youtu.be')) {
            return `https://www.youtube.com/embed${urlObj.pathname}`;
        }
    } catch (e) {
        return url;
    }
    return url;
};

export default function CourseDetails() {
    const { slug } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("curriculum");
    const [openModule, setOpenModule] = useState<number>(0);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEnrollment = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isEnrolled) return;
        setIsModalOpen(true);
    };

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

    useEffect(() => {
        const checkEnrollment = async () => {
            if (course) {
                const userStr = localStorage.getItem("user");
                if (userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        const res = await fetch('/api/check-enrollment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: user.email, courseName: course.title })
                        });
                        const data = await res.json();
                        if (data.isEnrolled) {
                            setIsEnrolled(true);
                        }
                    } catch (err) {
                        console.error("Error checking enrollment:", err);
                    }
                }
            }
        };
        checkEnrollment();
    }, [course]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-[#6C5DD3] animate-spin" />
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
                            <button
                                onClick={handleEnrollment}
                                disabled={isEnrolled}
                                className={`px-8 py-4 font-extrabold text-lg rounded-xl transition-all flex items-center gap-2 shadow-lg ${isEnrolled ? "bg-gray-300 text-gray-600 cursor-not-allowed shadow-none" : "bg-[#FBBF24] hover:bg-[#F2B01E] text-slate-900 shadow-yellow-200 cursor-pointer"
                                    }`}
                            >
                                {isEnrolled ? "ভর্তি সম্পন্ন" : "ব্যাচে ভর্তি হোন"}
                                {!isEnrolled && <ChevronRight className="w-5 h-5" strokeWidth={3} />}
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
                                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
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
                                { icon: "🗓️", label: course.enrollmentDeadline ? `${Math.ceil((new Date(course.enrollmentDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} দিন বাকি` : "৫৯ দিন বাকি" },
                                { icon: "🎬", label: `${course.totalPreRecordedVideos || '২৭৮'} টি প্রি রেকর্ডড ভিডিও` }
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
                                <Briefcase className="w-[18px] h-[18px]" strokeWidth={2.5} />
                                জব প্লেসমেন্ট সাপোর্ট
                            </div>
                            <div className="flex items-center gap-2 px-6 py-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl text-[#059669] text-sm font-bold">
                                <FolderArchive className="w-[18px] h-[18px]" strokeWidth={2.5} />
                                ক্লাস রেকর্ডিং ও লাইফটাইম এক্সেস
                            </div>
                        </div>
                    </div>

                    {/* Right: Video Preview Card */}
                    <div className="w-full lg:w-[500px] shrink-0">
                        {course.introVideo ? (
                            <div className="relative rounded-[24px] overflow-hidden shadow-2xl shadow-gray-300 bg-black w-full" style={{ paddingBottom: '64%' }}>
                                <iframe
                                    src={getYoutubeEmbedUrl(course.introVideo)}
                                    title="Course Intro Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute top-0 left-0 w-full h-full border-0"
                                ></iframe>
                            </div>
                        ) : (
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
                                            <Play className="w-5 h-5 text-white fill-white" />
                                        </div>
                                        ক্লিক করে দেখে নিন কোর্সের ডেমো ক্লাস
                                    </div>
                                </div>

                                {/* Center Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white animate-pulse">
                                        <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center pl-1">
                                            <Play className="w-8 h-8 text-[#EF4444] fill-[#EF4444]" />
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
                        )}
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
                            <span className="font-extrabold text-gray-800 text-xl tracking-tight">{course.totalSeats || '৫৪'} টি</span>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="block text-gray-500 text-xs font-bold uppercase mb-2 text-[#EF4444]">
                                        <span className="mr-2">🎓</span>ভর্তি চলছে
                                    </span>
                                    <span className="font-extrabold text-gray-800 text-xl">{course.batchNumber || '১১তম ব্যাচে'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Section */}
                {course.showAiLearningBanner !== false && (
                    <div className="relative overflow-hidden rounded-[40px] mb-16 bg-[#050D1F]">
                        {/* Glowing Background Orbs */}
                        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
                        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-0">
                            {/* Left: Text Content */}
                            <div className="flex-1 p-10 md:p-14 space-y-7">
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-blue-300 text-[13px] font-black rounded-xl border border-white/10 uppercase tracking-wider">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                                    {course.aiLearningBadge || 'AI-Powered Learning'}
                                </span>

                                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                    {course.aiLearningTitle1 || 'এই কোর্সে '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{course.aiLearningHighlight || 'AI ব্যবহার করে'}</span>{course.aiLearningTitle2 || ' শিখবেন কীভাবে কাজ করতে হয়'}
                                </h2>

                                <p className="text-gray-400 text-[16px] leading-relaxed font-medium max-w-[520px]">
                                    {course.aiLearningDetails || 'শুধু কোড নয়, এই কোর্সে আপনি শিখবেন কীভাবে AI tools ব্যবহার করে real-world সমস্যা সমাধান করতে হয়, Error Handle করতে হয় এবং productivity বাড়াতে হয়।'}
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

                                <button
                                    onClick={handleEnrollment}
                                    disabled={isEnrolled}
                                    className={`inline-flex items-center gap-3 px-8 py-4 text-white font-black text-[16px] rounded-2xl transition-all shadow-xl ${isEnrolled ? "bg-gray-500 cursor-not-allowed shadow-none" : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 shadow-blue-900/40"
                                        }`}
                                >
                                    {isEnrolled ? "ভর্তি সম্পন্ন" : "কোর্সে ভর্তি হোন"}
                                    {!isEnrolled && <ChevronRight className="w-5 h-5" strokeWidth={3} />}
                                </button>
                            </div>

                            {/* Right: AI Banner Image */}
                            <div className="w-full lg:w-[520px] shrink-0 relative">
                                {/* Gradient overlay on left edge to blend with text side */}
                                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050D1F] to-transparent z-10 pointer-events-none"></div>
                                <img
                                    src={course.aiLearningBannerUrl || "/images/ai-banner.png"}
                                    alt="AI-Powered Learning"
                                    className="w-full h-full object-cover opacity-90 rounded-r-[40px]"
                                    style={{ minHeight: '380px', maxHeight: '480px' }}
                                />
                                {/* Floating badge */}
                                <div className="absolute top-6 right-6 z-20 flex flex-col gap-3">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white text-center shadow-xl">
                                        <div className="text-2xl font-black text-blue-300">{course.aiLearningImageBadge1 || 'AI'}</div>
                                        <div className="text-[11px] font-black text-gray-300 uppercase tracking-wider">{course.aiLearningImageBadge2 || 'Driven'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detailed Description Section */}
                {course.fullDetails && (
                    <section className="mb-16">
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-8 md:p-12">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-[#6C5DD3]/10 flex items-center justify-center">
                                        <Info className="w-5 h-5 text-[#6C5DD3]" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1D1F]">কোর্স বিস্তারিত</h2>
                                </div>
                                <div className="prose prose-lg max-w-none">
                                    {course.fullDetails.split('\n').map((paragraph: string, idx: number) => (
                                        paragraph.trim() ? (
                                            <p key={idx} className="text-gray-600 text-[16px] leading-[1.9] font-medium mb-4 last:mb-0">
                                                {paragraph}
                                            </p>
                                        ) : <br key={idx} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

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
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab(tab.id);
                                        const element = document.getElementById(tab.id);
                                        if (element) {
                                            const y = element.getBoundingClientRect().top + window.scrollY - 100;
                                            window.scrollTo({ top: y, behavior: 'smooth' });
                                        }
                                    }}
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
                            {course?.demoClass?.videoUrls?.length > 0 ? (
                                course.demoClass.videoUrls.map((url: string, i: number) => (
                                    <div key={i} className="relative group rounded-[24px] overflow-hidden shadow-md bg-black w-full" style={{ paddingBottom: '56.25%' }}>
                                        <iframe
                                            src={getYoutubeEmbedUrl(url)}
                                            title="Demo Video"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="absolute top-0 left-0 w-full h-full border-0"
                                        ></iframe>
                                    </div>
                                ))
                            ) : (
                                [1, 2, 3, 4].map((i) => (
                                    <div key={i} className="relative group cursor-pointer rounded-3xl overflow-hidden shadow-md">
                                        <img
                                            src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop`}
                                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                                            alt="Demo Class"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 group-hover:bg-white/40 transition-all">
                                                <div className="w-10 h-10 bg-[#FBBF24] rounded-full flex items-center justify-center pl-0.5 shadow-lg shadow-yellow-500/20">
                                                    <Play className="w-5 h-5 text-white fill-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
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
                                        <CalendarDays className="w-4 h-4 text-[#EF4444]" /> {course.demoClass?.date || '৬ই মার্চ'}
                                    </div>
                                    <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5 text-sm font-extrabold text-[#1A1D1F]">
                                        <Clock className="w-4 h-4 text-[#EF4444]" /> {course.demoClass?.time || 'রাত ১০:৩০টা'}
                                    </div>
                                    <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5 text-sm font-extrabold text-[#1A1D1F]">
                                        <MapPin className="w-4 h-4 text-[#EF4444]" /> {course.demoClass?.platform || 'zoom'}
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
                                    <Check className="w-6 h-6" strokeWidth={4} />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Content Section (Tabs Content) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Content */}
                        <div id="curriculum" className="lg:col-span-2 space-y-12">
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
                                                                {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
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
                                                                        <FileText className="w-5 h-5 text-gray-400 group-hover:text-[#6C5DD3] transition-colors shrink-0" />
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="text-gray-700 font-medium text-[15px] group-hover:text-[#6C5DD3] transition-colors line-clamp-1">{topic.title}</span>
                                                                            {tIdx === 0 && mIdx === 0 && (
                                                                                <span className="px-2.5 py-1 bg-[#EEF2FF] text-[#6C5DD3] text-[10px] font-extrabold rounded-full uppercase tracking-wider leading-none flex items-center justify-center shrink-0">Free</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Video className="w-4 h-4 text-gray-400" />
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
                                            {(Array.isArray(course.tools) && course.tools.length > 0 && typeof course.tools[0] === 'object' ? course.tools : [
                                                { name: "HTML", image: "" },
                                                { name: "CSS", image: "" },
                                                { name: "Javascript", image: "" },
                                                { name: "Git & Git Hub", image: "" },
                                                { name: "PyCharm", image: "" },
                                                { name: "Flask", image: "" },
                                                { name: "Fast", image: "" },
                                                { name: "DRF", image: "" },
                                                { name: "Python", image: "" },
                                                { name: "Django", image: "" },
                                                { name: "React", image: "" },
                                                { name: "ChatGPT", image: "" },
                                            ]).map((tool: any, idx: number) => (
                                                <div key={idx} className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:shadow-md hover:border-gray-200 transition-all cursor-default">
                                                    <div className="h-12 flex items-center justify-center">
                                                        {tool.image ? (
                                                            <img src={tool.image} alt={tool.name} className="w-10 h-10 object-contain" />
                                                        ) : (
                                                            <div className="text-[#1A1D1F] text-2xl font-black">{tool.name?.substring(0, 3)}</div>
                                                        )}
                                                    </div>
                                                    <span className="font-bold text-gray-800 text-sm">{tool.name}</span>
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
                                            <Check className="w-3 h-3" strokeWidth={3} />
                                        </div>
                                        লাইফটাইম এক্সেস
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3" strokeWidth={3} />
                                        </div>
                                        সার্টিফিকেশন প্রজেক্টসমূহ
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3" strokeWidth={3} />
                                        </div>
                                        ২৪/৭ মেন্টর সাপোর্ট
                                    </li>
                                </ul>

                                <button
                                    onClick={handleEnrollment}
                                    disabled={isEnrolled}
                                    className={`w-full py-4 text-white font-extrabold text-lg rounded-2xl transition-all shadow-lg ${isEnrolled ? "bg-gray-500 cursor-not-allowed shadow-none" : "bg-[#6C5DD3] hover:bg-[#5A4CB5] shadow-[#6C5DD3]/20"
                                        }`}
                                >
                                    {isEnrolled ? "Already Enrolled" : "Enroll Now"}
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
                                            <CheckCircle2 className="w-3 h-3 text-[#10B981]" strokeWidth={3} />
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
                {
                    course.showAiJobReadyBanner !== false && (
                        <div className="relative overflow-hidden rounded-[40px] mt-16 bg-[#050D1F]">
                            {/* Glowing orbs */}
                            <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>
                            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col lg:flex-row-reverse items-center gap-0">
                                {/* Right (visually left on lg): Text Content */}
                                <div className="flex-1 p-10 md:p-14 space-y-7">
                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-purple-300 text-[13px] font-black rounded-xl border border-white/10 uppercase tracking-wider">
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                                        {course.aiJobReadyBadge || 'ক্যারিয়ার রেডি'}
                                    </span>

                                    <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                        {course.aiJobReadyTitle1 || 'কোর্স শেষে আপনি'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{course.aiJobReadyHighlight || 'চাকরির জন্য প্রস্তুত'}</span> {course.aiJobReadyTitle2 || 'হয়ে যাবেন'}
                                    </h2>

                                    <p className="text-gray-400 text-[16px] leading-relaxed font-medium max-w-[520px]">
                                        {course.aiJobReadyDetails || 'প্রতিটি মডিউলে real-world project, AI-assisted coding, এবং expert mentorship — সবকিছু মিলিয়ে আপনাকে industry-ready করে তুলবে।'}
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

                                    <button
                                        onClick={handleEnrollment}
                                        disabled={isEnrolled}
                                        className={`inline-flex items-center gap-3 px-8 py-4 text-white font-black text-[16px] rounded-2xl transition-all shadow-xl ${isEnrolled ? "bg-gray-500 cursor-not-allowed shadow-none" : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-purple-900/40"
                                            }`}
                                    >
                                        {isEnrolled ? "ভর্তি সম্পন্ন" : "এখনই ভর্তি হোন"}
                                        {!isEnrolled && <ChevronRight className="w-5 h-5" strokeWidth={3} />}
                                    </button>
                                </div>

                                {/* Left (visually right on lg): AI Banner Image */}
                                <div className="w-full lg:w-[520px] shrink-0 relative">
                                    {/* Gradient overlay on right edge to blend */}
                                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050D1F] to-transparent z-10 pointer-events-none"></div>
                                    <img
                                        src={course.aiBannerUrl || "/images/ai-banner.png"}
                                        alt="Career Ready"
                                        className="w-full h-full object-cover opacity-90 rounded-l-[40px]"
                                        style={{ minHeight: '380px', maxHeight: '480px' }}
                                    />
                                    {/* Floating badge */}
                                    <div className="absolute top-6 left-6 z-20">
                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white text-center shadow-xl">
                                            <div className="text-2xl font-black text-purple-300">🏆</div>
                                            <div className="text-[11px] font-black text-gray-300 uppercase tracking-wider">{course.aiJobReadyImageBadge || 'Job Ready'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    course.instructorBannerUrl && (
                        <section className="mt-20 mb-8 max-w-5xl mx-auto px-4">
                            <div className="w-full rounded-[32px] overflow-hidden shadow-xl border border-gray-100 relative group">
                                <img
                                    src={course.instructorBannerUrl}
                                    alt="Course Instructor Banner"
                                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
                                />
                            </div>
                        </section>
                    )
                }

                {/* Requirements Section */}
                <section className="mt-16 mb-16">
                    <div className="flex flex-col items-center justify-center mb-12">
                        <div className="relative inline-block">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1D1F]">
                                কী কী <span className="text-[#FBBF24]">থাকতে</span> হবে
                            </h2>
                            <svg className="absolute -bottom-3 right-0 w-36 text-[#FBBF24]" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 15Q50 5 95 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="bg-[#EEF2F6] rounded-2xl p-8 flex flex-col items-start gap-6">
                            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <MonitorSmartphone className="w-8 h-8 text-[#6C5DD3]" />
                            </div>
                            <h3 className="text-[#1A1D1F] font-bold text-lg leading-relaxed">
                                ন্যূনতম ৪ জিবি র‍্যাম
                            </h3>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#EEF2F6] rounded-2xl p-8 flex flex-col items-start gap-6">
                            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <Cpu className="w-8 h-8 text-[#6C5DD3]" />
                            </div>
                            <h3 className="text-[#1A1D1F] font-bold text-lg leading-relaxed">
                                ৬৪ বিটের প্রসেসর আছে এমন ডেস্কটপ বা ল্যাপটপ ও ভালো ইন্টারনেট কানেকশন
                            </h3>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-[#EEF2F6] rounded-2xl p-8 flex flex-col items-start gap-6">
                            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <Brain className="w-8 h-8 text-[#6C5DD3]" />
                            </div>
                            <h3 className="text-[#1A1D1F] font-bold text-lg leading-relaxed">
                                লেগে থাকার মানসিকতা
                            </h3>
                        </div>
                    </div>
                </section>

                {/* Course Benefits Detailed Grid */}
                <section id="benefits" className="mt-20 mb-16">
                    <div className="flex flex-col items-center justify-center mb-12">
                        <div className="relative inline-block px-4">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1D1F]">
                                কোর্সে আপনি পাচ্ছেন
                            </h2>
                            <svg className="absolute -bottom-4 left-0 w-full text-[#FBBF24]" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 8 Q 100 2 195 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="rounded-[24px] overflow-hidden border border-gray-100 bg-gray-100 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px]">
                            {(Array.isArray(course.benefits) && course.benefits.length > 0 ? course.benefits : [
                                { icon: "🗓️", title: "৮ মাসের গাইডেড জার্নি", subtitle: "একদম বিগিনার ফ্রেন্ডলি ওয়েতে আপডেটেড কারিকুলাম" },
                                { icon: "LIVE", title: "৭৩টি লাইভ ক্লাস এবং ৩০৭টি প্রি রেকর্ডড ভিডিও", subtitle: "ইন্ডাস্ট্রি এক্সপার্টদের কাছে শিখুন লাইভে" },
                                { icon: "PROJECT", title: "২ টি ইন্ডাস্ট্রি স্ট্যান্ডার্ড প্রজেক্ট ও ১২টি কম্প্রিহেন্সিভ প্রজেক্ট", subtitle: "ইন্ডাস্ট্রি স্ট্যান্ডার্ড প্রজেক্ট এড করুন সিভিতে, থাকুন সবার চেয়ে এগিয়ে" },
                                { icon: "📈", title: "প্রোগ্রেস ট্র্যাকিং", subtitle: "লিডার বোর্ডে দেখুন নিজের পজিশন উইথ প্রগ্রেস" },
                                { icon: "🎧", title: "সপ্তাহে ৬ দিন সাপোর্ট ক্লাস", subtitle: "প্র্যাক্টিস করতে গিয়ে প্রব্লেমে পড়লে লাইভ সাপোর্ট নিন সকাল ১১ টায় এবং রাত ৮ টায়" },
                                { icon: "🤝", title: "কমিউনিটি সাপোর্ট", subtitle: "থাকুন প্রোগ্রেসিভ কমিউনিটির সাথে অলওয়েজ" },
                                { icon: "⏳", title: "লাইফটাইম এক্সেস", subtitle: "প্রিরেকর্ডেড ভিডিও, রিসোর্স এবং ক্লাস রেকর্ডিং এ থাকবে লাইফ টাইম এক্সেস" },
                                { icon: "🎯", title: "জব মার্কেট গাইডলাইন", subtitle: "ইন্ডাস্ট্রি এক্সপার্টদের কাছে পান জব মার্কেটে প্রবেশ করার পূর্ণাঙ্গ নির্দেশনা" },
                                { icon: "💼", title: "মার্কেটপ্লেস গাইডলাইন", subtitle: "কোড ক্যানিয়নের মত মার্কেটপ্লেসে কিভাবে প্রজেক্ট সেল করবেন, পাবেন গাইডলাইন" },
                            ]).map((item: any, i: number) => (
                                <div key={i} className="bg-white p-8 md:p-10 flex flex-col items-center text-center justify-center hover:bg-gray-50 transition-colors">
                                    <div className="text-4xl mb-6 flex items-center justify-center min-h-[50px]">
                                        {item.icon === "LIVE" ? (
                                            <div className="flex flex-col items-center">
                                                <span className="px-2.5 py-0.5 bg-red-100 text-[#EF4444] text-[11px] font-black rounded uppercase tracking-widest border border-red-200">Live</span>
                                            </div>
                                        ) : item.icon === "PROJECT" ? (
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Project</span>
                                                <span className="text-3xl">⚙️</span>
                                            </div>
                                        ) : item.icon?.startsWith('http') || item.icon?.startsWith('/') ? (
                                            <img src={item.icon} alt={item.title} className="w-12 h-12 object-contain" />
                                        ) : (
                                            item.icon
                                        )}
                                    </div>
                                    <h3 className="text-[#1A1D1F] font-extrabold text-[17px] md:text-lg mb-3 leading-snug">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm md:text-[15px] text-gray-500 font-medium leading-relaxed">
                                        {item.subtitle}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* What you will learn Section */}
                <section className="mt-20 mb-16">
                    <div className="flex flex-col items-center justify-center mb-12">
                        <div className="relative inline-block px-4">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1D1F]">
                                কোর্সে কি কি শেখানো হবে
                            </h2>
                            <svg className="absolute -bottom-4 left-0 w-full text-[#FBBF24]" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 8 Q 100 2 195 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(Array.isArray(course.whatYouWillLearn) && course.whatYouWillLearn.length > 0 && typeof course.whatYouWillLearn[0] === 'object' ? course.whatYouWillLearn : [
                            { text: "প্রোগ্রামিং ল্যাংগুয়েজ হিসেবে শেখানো হবে পাইথন", icon: "" },
                            { text: "ব্যাকএন্ডের জন্য আমরা শিখবো Django, Django Rest Framework, Flask", icon: "" },
                            { text: "ফ্রন্টেন্ডের জন্য শেখানো হবে React", icon: "" },
                            { text: "পাইথন এর এডভান্স কনসেপ্ট", icon: "" },
                            { text: "Django রেস্ট ফ্রেমওয়ার্ক এর এডভান্স কনসেপ্ট", icon: "" },
                            { text: "Authentication, Permissions, Throttling, Filtering", icon: "" },
                            { text: "Pagination, Automated API testing, Searching and Ordering", icon: "" }
                        ]).map((item: any, i: number) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-[20px] p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all hover:border-gray-200">
                                <div className="mt-1 flex-shrink-0">
                                    {item.icon ? (
                                        <img src={item.icon} alt="icon" className="w-7 h-7 object-contain" />
                                    ) : (
                                        <CheckCircle2 className="w-7 h-7 text-[#22C55E]" strokeWidth={2} />
                                    )}
                                </div>
                                <p className="text-[#1A1D1F] font-bold text-[15px] leading-relaxed">
                                    {item.text || item}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Target Audience Section */}
                <section id="audience" className="mt-20 mb-16">
                    <div className="flex flex-col items-center justify-center mb-12">
                        <div className="relative inline-block">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1D1F]">
                                কোর্সটি আপনারই জন্য
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(Array.isArray(course.targetAudience) && course.targetAudience.length > 0 ? course.targetAudience : [
                            "যারা একদম শূন্য থেকে ওয়েব ডেভেলপমেন্ট শিখে ক্যারিয়ার স্টার্ট করতে চান",
                            "ইউনিভার্সিটি কিংবা কলেজের শিক্ষার্থী যিনি ডেভেলপার হতে চান",
                            "যিনি ওয়েব ডেভেলপমেন্ট শেখার বিগিনার স্টেজে আছেন",
                            "যারা প্রজেক্ট করে ওয়েব ডেভেলপমেন্ট শিখতে চাচ্ছেন"
                        ]).map((item: any, i: number) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 flex items-start gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
                                <div className="mt-0.5 flex-shrink-0">
                                    <CheckCircle2 className="w-6 h-6 text-[#22C55E]" strokeWidth={2} />
                                </div>
                                <p className="text-[#1A1D1F] font-extrabold text-[15px] leading-relaxed flex-1">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Success Stories Section */}
                <section id="placements" className="mt-20 mb-16">
                    <div className="flex flex-col items-center justify-center mb-12">
                        <div className="relative inline-block">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1D1F]">
                                সাকসেসফুল হয়েছেন যারা
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {(Array.isArray(course.successStories) && course.successStories.length > 0 ? course.successStories.map((s: any) => ({ ...s, initial: s.name.split(" ").map((n: any) => n[0]).join("").substring(0, 2) })) : [
                            { name: "Shahriya Naeem (Batch 1)", role: "Jr. Django Developer, Softvence Agency", initial: "SN" },
                            { name: "Md. Main (Batch 1)", role: "Jr. Python Developer, Softvence Agency", initial: "MM" },
                            { name: "Nasir Uddin (Batch 2)", role: "Python Django developer, Softvence Agency", initial: "NU" },
                            { name: "Rezanul Haque Raz (Batch 2)", role: "Python developer, Softvence Agency", initial: "RH" },
                            { name: "MD IMDADUL HOSSAIN (Batch 3)", role: "Python Django developer, Softvence Agency", initial: "MI" },
                            { name: "Md. Sifat Hossen (Batch 3)", role: "Python Django developer, Softvence Agency", initial: "MS" },
                            { name: "Joy Barmon", role: "Python Developer at Universe IT Institute", initial: "JB" },
                            { name: "MD AFZALUL HAQUE", role: "Software Developer at echologyx", initial: "MA" },
                            { name: "Nadim Mahmud", role: "Junior Python Developer at Join Venture AI", initial: "NM" },
                            { name: "Asif Faisal", role: "Full Stack Developer at Zerone BD", initial: "AF" },
                            { name: "Nahid Hasan Ukil", role: "Software Developer at Opzo Technologies", initial: "NH" },
                            { name: "Shiam Sharif", role: "Junior Software Developer at Exoveon Limited", initial: "SS" },
                            { name: "Abir Hasan", role: "Junior Full Stack Developer at Exoveon Limited", initial: "AH" },
                            { name: "MD. HASHANUL BANNA", role: "Backend Developer(Django) - Intern atRaktch Technology & Software", initial: "MH" },
                            { name: "Rajon Ahmed", role: "Backend Developer at Bdcalling", initial: "RA" },
                            { name: "Md. Munna", role: "Software Developer (python) at Intelligent Systems and Solutions Limited (ISSL)", initial: "MM" },
                            { name: "MOHIAN UL ISLAM", role: "Intern at Star Computer System Limited", initial: "MU" },
                            { name: "Md. Mominul Islam", role: "Jr. django developer at Softvence", initial: "MM" },
                        ]).map((student: any, i: number) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 flex items-start gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow group">
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm font-bold text-gray-500 text-sm">
                                        {/* Fallback avatar using initials since we don't have all photos */}
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${student.name}&background=random&color=fff&size=48`}
                                            alt={student.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    {/* Small company icon badge */}
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 p-0.5">
                                        <img src={`https://ui-avatars.com/api/?name=${student.role.split(' ').pop()}&background=fff&color=6C5DD3&size=20&rounded=true`} alt="company" className="w-full h-full rounded-full" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[#1A1D1F] font-bold text-[14px] leading-snug mb-1 truncate whitespace-normal line-clamp-2">
                                        {student.name}
                                    </h3>
                                    <p className="text-gray-500 text-[12px] font-medium leading-relaxed truncate whitespace-normal line-clamp-2">
                                        {student.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Testimonials / Feedback Section */}
                <section id="reviews" className="mt-20 mb-20">
                    <div className="flex flex-col items-center justify-center mb-12">
                        <span className="px-4 py-1.5 bg-[#D1FAE5] text-[#059669] text-sm font-bold rounded-full mb-4">
                            ফিডব্যাক
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1D1F]">
                            আমাদের <span className="text-[#FBBF24]">লার্নারদের</span> কাছে শুনুন
                        </h2>
                    </div>

                    {/* True Masonry-style Grid for Testimonials */}
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {(Array.isArray(course.testimonials) && course.testimonials.length > 0 ? course.testimonials : [
                            {
                                text: "কোর্স করে অনেক ভালোকিছু আমি শিখতে পেরেছি। ইন্সট্রাক্টর ভাই খুব সুন্দর করে কোর্স করিয়েছেন। এবং আমার যে কোন প্রবলেমে আমি সাপোর্ট ক্লাসে জয়েন করে সাপোর্ট নিতে পেরেছি। ধন্যবাদ ওস্তাদ টিমকে। আমি খুবই খুশি কোর্স করে। আমি কোর্স রেটিং ১০ এ ৮ দিবো।",
                                name: "Ashutosh Roy"
                            },
                            {
                                text: "কোর্সের কারিকুলাম নিয়ে আমি সন্তুষ্ট। বিশেষ করে মেন্টর উনি অনেক অভিজ্ঞ এবং উনার ক্লাসে অনেক কিছু আমি শিখতে পেরেছি। বিশেষ করে আমাদের যেকোনো প্রবলেমের জন্য ওস্তাদ টিম খুব এফেক্টিভ ভাবে আমাদেরকে হেল্প করে। ধন্যবাদ ওস্তাদ টিমকে এরকম সুন্দর একটা প্ল্যাটফর্ম দেওয়ার জন্য।",
                                name: "Shah Sayem Ahmad"
                            },
                            {
                                text: "আলহামদুলিল্লাহ, আমার কাছে কোর্স খুব ভালো লাগতেছে। এবং আমি অনেক কিছু শিখতে পারতেছি কোর্সে করে। আমাদের মেন্টর যিনি আছেন উনি খুব সুন্দর ভাবে আমাদেরকে গাইডলাইন দিচ্ছেন। এবং আমার প্রবলেম হলে আমি সাপোর্টে জয়েন করে আমার প্রবলেম দেখাতে পারি। আমি কোর্স রেটিং এ দশে নয় দিব।",
                                name: "Radoanul Arifen"
                            },
                            {
                                text: "আমার নাম মুনতাসির বিন হাসিব। আমি ওস্তাদের Python Django কোর্সের ব্যাচ ২ এ আছি। আলহামদুলিল্লাহ কোর্স আমার কোনো সমস্যা হচ্ছে না। ভাইয়াদের ক্লাস অনেক ভালো লেগেছে। ক্লাসে খুব ভালো পড়ানো হয় তাই সাপোর্ট ক্লাস করার প্রয়োজন হয়নি। সব কিছু মিলিয়ে আমার কাছে ওস্তাদ প্ল্যাটফর্মটি খুব ভালো লেগেছে।",
                                name: "Muntasir Bin Hasib"
                            },
                            {
                                text: "কোর্সে এখনো লার্নিং অবস্থায় আছি। তবে যতটুকু কোর্স করেছি খুব ভালোই শিখেছি। তবে আরেকটু দ্রুত কোর্স আগালে আমার জন্য ভালো হতো। কোর্সের টিচার এবং ওস্তাদ টিম সাপোর্ট টিচার মিলিয়ে আমার কাছে খুব ভালো লাগতেছে। আশা করি সামনে আরো ভালো কিছু আমরা প্রজেক্ট অনুযায়ী করতে পারব।",
                                name: "Santosh Barai"
                            },
                            {
                                text: "এখন পর্যন্ত আমি যত ক্লাস করেছি আমার সেরকম কোন প্রবলেম আমি ফেস করিনি। এবং মোটামুটি ক্লাস আমার কাছে ভালই লাগছে এবং আমার আগে থেকে অনেক কিছু জানা আছে। এই কারণে কোন প্রবলেম হচ্ছে না। তো আশা করি সামনে আরো ভালো কিছু পাব। বিশেষ করে নাসিম ভাইয়া যদি আরো ডিটেলস ক্লাস নেন...",
                                name: "Nadim Bhuiyan"
                            },
                            {
                                text: "কোর্স এখনো শেষ হয় নাই তবে যতটুকু করেছি আমার কাছে খুব ভালোই লেগেছে। বিশেষ করে মেন্টরের ক্লাস গুলা আমার কাছে অসাধারণ লাগছে। এবং আমি এই কোর্স করে আমার স্কিল অনেক ডেভেলপ হয়েছে। সামনে আশা করি আরো ভালো কিছু শিখতে পারবো।",
                                name: "Alinoor Sarker"
                            },
                            {
                                text: "কোর্স যতটুকু করেছি আমার কাছে বেশ ভালই লেগেছে। আশা করি সামনে আরো ভালো কিছু আমরা শিখতে পারবো। আমি বলতে চাই আমাদের মেন্টর খুবই ভালো উনি যথেষ্ট হেল্পফুল। ক্লাসে সবকিছু উনি আমাদেরকে ইন ডিটেলস বুঝাচ্ছেন। আমাদের যে কোন প্রবলেমে সাপোর্ট ক্লাসে জয়েন করে আমরা প্রবলেম দেখাইতে পারি।",
                                name: "Md. Sabbir Ahmed"
                            },
                            {
                                text: "ওস্তাদের এই কোর্সটি শুরু থেকে এখন পর্যন্ত অনেক কিছু শিখতে পেরেছি। লাইভ ক্লাসের পাশাপাশি সাপোর্ট ক্লাসগুলো কোর্সের জিনিসগুলো বুঝতে আরো বেশি সহায়তা করেছে। আশা করছি কোর্সটি পুরোপুরি শেষ করে আরো অনেক কিছু শিখতে পারবো এবং কাজে লাগাতে পারব। ওস্তাদ টিমকে অসংখ্য ধন্যবাদ।",
                                name: "Monir Hossain"
                            },
                            {
                                text: "আসসালামু আলাইকুম। প্রথম থেকে এখন পর্যন্ত আলহামদুলিল্লাহ কোর্সটি অনেক ভালো যাচ্ছে। কোর্সের মেন্টর, লাইভ ক্লাস, সাপোর্ট ক্লাস সবকিছুই অনেক ভালো। ওস্তাদ টিমকে অনেক ধন্যবাদ কোর্সটি অফার করার জন্য এবং আমাদের এত ভাল করে শেখানোর জন্য। আশা রাখছি সামনেও ভালো কিছু শিখতে পারবো।",
                                name: "MEHEDI HASSAN"
                            },
                            {
                                text: "আমি মোহাম্মদ আনিস। ওস্তাদের Python Django কোর্সের ব্যাচ ২ এ আছি। কোর্সটি করে আমি খুব স্যাটিসফাইড। ক্লাসগুলোতে খুব ভালো পড়ানোর ফলে অনেক ইজিলি সব বিষয় সম্পর্কে বুঝতে পারি এবং প্রজেক্ট ক্লাসগুলাও বেশ হেল্পফুল। আমি আগেও ওস্তাদের অন্য কোর্স করেছি খুবই ভাল সার্ভিস উনাদের।",
                                name: "Mohammad Anis"
                            }
                        ]).map((review: any, i: number) => (
                            <div key={i} className="break-inside-avoid bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col mb-6 hover:shadow-md transition-shadow">
                                <p className="text-[#334155] text-[14px] leading-relaxed font-medium mb-6">
                                    {review.text}
                                </p>
                                <div className="border-t border-gray-100 pt-4 flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#1A1D1F] text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                                            {review.name.split(' ').map((n: any) => n[0]).join('').substring(0, 2)}
                                        </div>
                                        <h4 className="font-extrabold text-[#1A1D1F] text-[15px]">
                                            {review.name}
                                        </h4>
                                    </div>
                                    <div className="text-[#FBBF24] opacity-50 text-2xl font-serif leading-none h-4">
                                        &rdquo;
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Certificate Section */}
                <section className="mt-20 mb-20 bg-gray-50 py-16">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="flex flex-col items-center justify-center mb-12 text-center">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-[#F59E0B] mb-4 font-bengali">
                                সার্টিফিকেট
                            </h2>
                            <p className="text-xl md:text-2xl text-[#475569] font-semibold font-bengali">
                                কোর্স শেষে পেয়ে যান শেয়ারেবল কোর্স কমপ্লিশন এবং এসেসমেন্ট সার্টিফিকেট
                            </p>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                            {/* Certificate 1: Completion */}
                            <div className="relative w-full max-w-[600px] bg-white shadow-xl overflow-hidden border border-gray-200 p-2">
                                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                {/* Top Left Corner Accent */}
                                <div className="absolute top-0 left-0 w-32 h-32 bg-[#F59E0B] opacity-20 rounded-br-full -translate-x-1/2 -translate-y-1/2"></div>
                                {/* Bottom Left Decorative Shapes */}
                                <div className="absolute bottom-0 left-0 w-48 h-full bg-[#1A1D1F] transform -skew-x-[25deg] -translate-x-24 origin-bottom-left"></div>
                                <div className="absolute bottom-0 left-12 w-16 h-48 bg-[#F59E0B] transform -skew-x-[25deg] origin-bottom-left z-10"></div>
                                {/* Right Side Decorative Shapes */}
                                <div className="absolute top-0 right-0 w-32 h-full bg-[#1A1D1F] transform skew-x-[20deg] translate-x-16 origin-top-right"></div>
                                <div className="absolute top-1/2 right-12 w-12 h-32 bg-[#F59E0B] transform skew-x-[20deg] -translate-y-1/2 z-10"></div>

                                <div className="relative z-20 h-full p-8 md:p-12 flex flex-col items-center text-center">
                                    <div className="w-full text-left mb-6">
                                        <p className="text-[10px] md:text-xs text-slate-500">Certificate ID: C6796</p>
                                    </div>

                                    <h3 className="text-3xl md:text-5xl font-black text-[#1A1D1F] tracking-tight leading-none mb-1">
                                        CERTIFICATE
                                    </h3>
                                    <p className="text-xl md:text-2xl text-slate-600 tracking-widest font-light mb-10">
                                        OF COMPLETION
                                    </p>

                                    <p className="text-slate-500 mb-8 font-medium">This is to certify that</p>

                                    <div className="w-full h-px bg-slate-200 mb-8 relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent opacity-30"></div>
                                    </div>

                                    <p className="text-slate-600 font-medium mb-4">has successfully completed the course of</p>

                                    <h4 className="text-xl md:text-2xl font-bold text-[#1A1D1F] mb-16">
                                        Full Stack Web Development with Python,<br />Django & React
                                    </h4>

                                    <div className="w-full flex justify-between items-end mt-auto pt-8 border-t border-slate-100">
                                        <div className="text-center">
                                            <div className="w-24 border-b border-black mb-2 mx-auto"></div>
                                            <p className="text-xs text-slate-600 font-medium">Ostad The Coach</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#F59E0B] rounded-full flex items-center justify-center text-white font-bold text-xl">O</div>
                                            <span className="font-bold text-xl md:text-2xl tracking-tight text-[#1A1D1F]">Ostad</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-32 border-b border-black mb-2 mx-auto"></div>
                                            <p className="text-xs text-slate-800 font-bold mb-0.5">Abdullah Al Musabbir</p>
                                            <p className="text-[10px] text-slate-500">CEO, Ostad</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Certificate 2: Assessment */}
                            <div className="relative w-full max-w-[400px] bg-white shadow-xl border-[12px] border-[#1A1D1F] p-1 flex flex-col h-full">
                                <div className="border border-[#F59E0B] p-6 lg:p-8 h-full relative">
                                    {/* Gold inner border */}
                                    <div className="absolute inset-1 border border-black/10"></div>

                                    {/* Top section */}
                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-5 h-5 bg-[#F59E0B] rounded-full flex items-center justify-center text-white font-bold text-xs">O</div>
                                            <span className="font-bold text-sm tracking-tight text-[#1A1D1F]">Ostad</span>
                                        </div>
                                        <div className="w-16 h-16 rounded-full bg-[#F59E0B] flex items-center justify-center -mt-2 -mr-2 shadow-lg z-20 relative">
                                            <div className="w-14 h-14 rounded-full border border-dashed border-white/50 flex flex-col items-center justify-center text-center">
                                                <span className="text-[8px] text-white font-bold leading-none uppercase">VETTED</span>
                                            </div>
                                            {/* Ribbon tails */}
                                            <div className="absolute -bottom-2 left-2 w-4 h-6 bg-[#D97706] -z-10 clip-path-[polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)]"></div>
                                            <div className="absolute -bottom-2 right-2 w-4 h-6 bg-[#D97706] -z-10 clip-path-[polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)]"></div>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-[#1A1D1F] tracking-tight leading-none mb-1">
                                        CERTIFICATE
                                    </h3>
                                    <p className="text-[10px] tracking-[0.2em] text-slate-500 font-medium mb-6 uppercase">
                                        Of Assessment
                                    </p>

                                    <h4 className="text-3xl font-[cursive] text-slate-800 mb-4 px-2 italic">
                                        Md. Najmus Sakib
                                    </h4>

                                    <p className="text-[10px] text-slate-600 mb-2">has successfully completed the online live course on</p>

                                    <h5 className="font-bold text-sm text-[#1A1D1F] mb-6 leading-tight">
                                        Full Stack Web Development with Python,<br />Django & React
                                    </h5>

                                    <div className="bg-slate-50 p-3 rounded text-[9px] text-slate-600 mb-8 border border-slate-100">
                                        <strong className="text-slate-800">Congratulations!</strong> You have successfully completed<br />
                                        Full Stack Web Development with Python, Django & React<br />
                                        and achieved the following result.
                                    </div>

                                    <div className="mb-10 text-[10px]">
                                        <div className="flex justify-between font-bold text-slate-800 pb-2 border-b border-slate-200 mb-2">
                                            <span>Exam Type</span>
                                            <span>Result (%)</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 text-slate-600 border-b border-slate-50">
                                            <span>Assignment</span>
                                            <span className="font-semibold text-slate-800">100%</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 text-slate-600 border-b border-slate-50">
                                            <span>Quiz</span>
                                            <span className="font-semibold text-slate-800">99.4%</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 text-slate-600">
                                            <span>Live Test</span>
                                            <span className="font-semibold text-slate-800">100%</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end mt-auto pt-6 border-t border-slate-100 relative">
                                        <div className="absolute top-0 right-0 w-24 h-1 bg-[#F59E0B] opacity-50"></div>
                                        <div className="absolute top-0 right-24 w-12 h-1 bg-[#1A1D1F] opacity-20"></div>

                                        <div className="text-center w-1/3">
                                            <div className="w-16 border-b border-slate-400 mb-1 mx-auto"></div>
                                            <p className="text-[8px] text-slate-500">Ostad The Coach</p>
                                        </div>
                                        <div className="text-center w-1/3">
                                            <div className="w-20 border-b border-slate-400 mb-1 mx-auto"></div>
                                            <p className="text-[9px] text-slate-800 font-bold mb-0.5 whitespace-nowrap">Abdullah Al Musabbir</p>
                                            <p className="text-[7px] text-slate-500">CEO, Ostad</p>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-2 left-6">
                                        <p className="text-[6px] text-slate-400">ID: A6796</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="mt-20 mb-20">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="flex flex-col items-center justify-center mb-12 text-center">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1D1F]">
                                প্রায়ই জিজ্ঞেস করা <span className="text-[#FBBF24] relative inline-block">
                                    প্রশ্ন
                                    <div className="absolute left-0 w-full h-[6px] bg-[#FBBF24] rounded-full" style={{ bottom: '-2px' }}></div>
                                </span>
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {(Array.isArray(course.faqs) && course.faqs.length > 0 ? course.faqs.map((f: any) => ({ q: f.question, a: f.answer })) : [
                                { q: "1. আমি কি ভিডিওগুলো ডাউনলোড করতে পারবো?", a: "না, ভিডিওগুলো ডাউনলোড করার কোনো অপশন নেই। তবে আপনি আমাদের প্ল্যাটফর্ম থেকে যেকোনো সময় ভিডিওগুলো দেখতে পারবেন।" },
                                { q: "2. আমি কি মোবাইল দিয়ে জয়েন করতে পারবো?", a: "হ্যাঁ, আপনি মোবাইল, ল্যাপটপ বা ডেস্কটপ যেকোনো ডিভাইস থেকে কোর্সে জয়েন করতে পারবেন।" },
                                { q: "3. আমার কি ভিডিওগুলোর লাইফটাইম এক্সেস থাকবে?", a: "হ্যাঁ, কোর্স সম্পন্ন করার পর আপনি কোর্সের সমস্ত ভিডিওর লাইফটাইম এক্সেস পাবেন।" },
                                { q: "4. লাইভ ক্লাস কোথায় হবে ?", a: "লাইভ ক্লাসগুলো গুগল মিট বা জুমের মাধ্যমে হবে এবং ক্লাসের লিংক আমাদের প্ল্যাটফর্মে দেওয়া থাকবে।" },
                                { q: "5. এসেসমেন্ট কিভাবে হবে?", a: "প্রতিটি মডিউলের পর কুইজ এবং অ্যাসাইনমেন্ট থাকবে। কোর্স শেষে একটি ফাইনাল লাইভ টেস্ট বা প্রজেক্ট জমা দিতে হবে।" },
                                { q: "6. ওস্তাদ প্রো ব্যাচে কাদেরকে নেয়া হবে?", a: "কোর্সের পারফরমেন্স, অ্যাসাইনমেন্ট এবং ফাইনাল টেস্টের ওপর ভিত্তি করে সেরা লার্নারদের ওস্তাদ প্রো ব্যাচে সুযোগ দেওয়া হবে।" },
                                { q: "7. দেশের বাইরে থেকে কিভাবে পেমেন্ট করবো?", a: "দেশের বাইরে থেকে পেমেন্ট করার জন্য আপনি ডেবিট/ক্রেডিট কার্ড অথবা পেপ্যাল ব্যবহার করতে পারেন।" },
                                { q: "8. লাইভ ক্লাসের রেকর্ডিং থাকবে?", a: "হ্যাঁ, প্রতিটি লাইভ ক্লাসের রেকর্ডিং ক্লাসের পর প্ল্যাটফর্মে আপলোড করা হবে।" },
                                { q: "9. প্র্যাকটিস করতে গিয়ে সমস্যায় পড়লে সাপোর্ট পাবো কোথায়?", a: "আমাদের ডেডিকেটেড সাপোর্ট গ্রুপ এবং লাইভ সাপোর্ট ক্লাস রয়েছে যেখানে আপনি আপনার যেকোনো সমস্যার সমাধান পাবেন।" }
                            ]).map((faq: any, index: number) => (
                                <details key={index} className="group border border-gray-100 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] [&_summary::-webkit-details-marker]:hidden">
                                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-xl p-5 md:p-6 text-[#1A1D1F] font-bold md:text-[17px] focus:outline-none">
                                        {faq.q}
                                        <ChevronDown className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180 text-gray-500" strokeWidth={2.5} />
                                    </summary>

                                    <div className="px-5 pb-5 md:px-6 md:pb-6 text-[#475569] font-medium leading-relaxed">
                                        <p>{faq.a}</p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

            </main >

            <Footer />
            <EnrollmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                course={course}
                discountedPrice={discountedPrice}
            />
        </div >
    );
}
