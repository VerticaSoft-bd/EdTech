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
import ContactSection from "@/app/components/ContactSection";

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

const Skeleton = ({ className }: { className?: string }) => (
    <div className={`relative overflow-hidden bg-gray-200 rounded-xl ${className}`}>
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
);


const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        if (!targetDate) return;

        const calculateTimeLeft = () => {
            try {
                // Handle common formats: YYYY-MM-DD, DD-MM-YYYY, or MM/DD/YYYY
                let dateStr = targetDate;
                if (targetDate.includes('-')) {
                    const parts = targetDate.split('-');
                    if (parts[0].length === 2) { // DD-MM-YYYY or MM-DD-YYYY
                        // Standardizing to YYYY-MM-DD for consistency
                        dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    }
                }
                
                const target = new Date(dateStr);
                if (isNaN(target.getTime())) return null;

                const now = new Date();
                const difference = target.getTime() - now.getTime();

                if (difference > 0) {
                    return {
                        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                        minutes: Math.floor((difference / 1000 / 60) % 60),
                        seconds: Math.floor((difference / 1000) % 60),
                    };
                }
            } catch (e) {
                return null;
            }
            return null;
        };

        const timer = setInterval(() => {
            const left = calculateTimeLeft();
            setTimeLeft(left);
            if (!left) clearInterval(timer);
        }, 1000);

        setTimeLeft(calculateTimeLeft());

        return () => clearInterval(timer);
    }, [targetDate]);

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    if (timeLeft === null) {
        return (
            <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-[#EEF2FF] text-[#6C5DD3] text-xs font-black rounded-lg border border-[#6C5DD3]/10">
                    BATCH STARTED
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 md:gap-2">
            {[
                { label: 'Day', value: timeLeft.days, color: 'text-[#6C5DD3]' },
                { label: 'Hr', value: timeLeft.hours, color: 'text-[#6C5DD3]' },
                { label: 'Min', value: timeLeft.minutes, color: 'text-[#6C5DD3]' },
                { label: 'Sec', value: timeLeft.seconds, color: 'text-[#EF4444]', animate: true },
            ].map((unit, idx) => (
                <React.Fragment key={unit.label}>
                    <div className="flex flex-col items-center">
                        <div className="relative group/box">
                            <div className={`absolute -inset-0.5 bg-gradient-to-br ${unit.animate ? 'from-[#EF4444]/20 to-transparent' : 'from-[#6C5DD3]/10 to-transparent'} rounded-lg blur opacity-0 group-hover/box:opacity-100 transition duration-500`}></div>
                            <div className="relative bg-white border border-gray-100 rounded-lg px-2 py-1.5 min-w-[36px] md:min-w-[42px] flex items-center justify-center shadow-sm">
                                <span className={`text-[15px] md:text-base font-black ${unit.color} tabular-nums ${unit.animate ? 'animate-[pulse_1s_infinite]' : ''}`}>
                                    {formatNumber(unit.value)}
                                </span>
                            </div>
                        </div>
                        <span className="text-[8px] md:text-[9px] uppercase font-bold text-gray-400 mt-1.5 tracking-tighter">{unit.label}</span>
                    </div>
                    {idx < 3 && <span className="text-gray-300 font-bold -mt-5 opacity-50">:</span>}
                </React.Fragment>
            ))}
        </div>
    );
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
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
                <Header />
                <main className="flex-1 w-full max-w-[1300px] mx-auto px-4 sm:px-6 py-12 md:py-16">
                    {/* Hero Section Skeleton */}
                    <div className="flex flex-col lg:flex-row gap-12 items-start mb-16">
                        <div className="flex-1 space-y-8 w-full">
                            <div className="space-y-6">
                                <Skeleton className="w-40 h-8 rounded-full" />
                                <div className="space-y-4">
                                    <Skeleton className="w-full h-16" />
                                    <Skeleton className="w-2/3 h-16" />
                                </div>
                                <div className="space-y-3">
                                    <Skeleton className="w-full h-5" />
                                    <Skeleton className="w-5/6 h-5" />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6">
                                <Skeleton className="w-48 h-16 rounded-2xl" />
                                <div className="flex items-center gap-4">
                                    <Skeleton className="w-32 h-10" />
                                    <Skeleton className="w-24 h-10 opacity-60" />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Skeleton className="w-44 h-12 rounded-2xl" />
                                <Skeleton className="w-44 h-12 rounded-2xl" />
                                <Skeleton className="w-44 h-12 rounded-2xl" />
                            </div>
                        </div>

                        <div className="w-full lg:w-[500px] shrink-0">
                            <div className="aspect-video relative rounded-[24px] overflow-hidden p-1 shadow-2xl bg-white">
                                <Skeleton className="w-full h-full rounded-[20px]" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <Play className="w-8 h-8 text-white/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Batch Information Skeleton */}
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden mb-16">
                        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="p-8 space-y-3">
                                    <Skeleton className="w-20 h-4" />
                                    <Skeleton className="w-32 h-8" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Section Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-12">
                            {/* Tabs Skeleton */}
                            <div className="flex items-center gap-8 border-b border-gray-200 pb-4 overflow-hidden">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton key={i} className="w-24 h-6 shrink-0" />
                                ))}
                            </div>

                            {/* Main Content Card Skeleton */}
                            <div className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm space-y-10">
                                <div className="flex flex-col gap-6">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className="p-6 border border-gray-100 rounded-[20px] flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Skeleton className="w-6 h-6 rounded-full" />
                                                <Skeleton className="w-56 h-6" />
                                            </div>
                                            <Skeleton className="w-16 h-4" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Skeleton */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#181C25] rounded-[32px] p-8 sticky top-[100px] space-y-8">
                                <Skeleton className="w-2/3 h-6 bg-gray-700" />
                                <div className="space-y-4">
                                    <Skeleton className="w-full h-5 bg-gray-700" />
                                    <Skeleton className="w-full h-5 bg-gray-700" />
                                    <Skeleton className="w-full h-5 bg-gray-700" />
                                </div>
                                <Skeleton className="w-full h-14 rounded-2xl bg-[#6C5DD3]/30" />
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
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
        <div className="min-h-screen bg-[#F8FAFC] text-[#1A1D1F] flex flex-col">
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
                        <div className="flex flex-wrap gap-3 max-w-[800px]">
                            {course.totalLectures && (
                                <div className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-700 text-sm font-bold">
                                    <Video className="w-[18px] h-[18px] text-[#6C5DD3]" strokeWidth={2.5} />
                                    {course.totalLectures} টি লাইভ ক্লাস
                                </div>
                            )}
                            {course.totalProjects && (
                                <div className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-700 text-sm font-bold">
                                    <FolderOpen className="w-[18px] h-[18px] text-[#F59E0B]" strokeWidth={2.5} />
                                    {course.totalProjects} টি প্রজেক্টসমূহ
                                </div>
                            )}
                            {course.duration && (
                                <div className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-700 text-sm font-bold">
                                    <CalendarDays className="w-[18px] h-[18px] text-[#10B981]" strokeWidth={2.5} />
                                    {course.duration} বাকি
                                </div>
                            )}
                            {course.lifetimeAccess && (
                                <div className="flex items-center gap-2 px-6 py-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl text-[#059669] text-sm font-bold">
                                    <FolderArchive className="w-[18px] h-[18px]" strokeWidth={2.5} />
                                    ক্লাস রেকর্ডিং ও লাইফটাইম এক্সেস
                                </div>
                            )}
                        </div>

                        {/* Top Banner AI Feature Pills */}
                        {course.aiFeatures && course.aiFeatures.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                <span className="text-xs font-bold text-gray-400 self-center uppercase tracking-wider mr-2">Learn with:</span>
                                {course.aiFeatures.map((item: string, i: number) => (
                                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/80 border border-blue-100 rounded-lg text-[13px] font-bold text-blue-800 cursor-default">
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Benefits Cards */}
                        <div className="flex flex-wrap gap-4">
                            {course.jobSupport && (
                                <div className="flex items-center gap-2 px-6 py-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl text-[#059669] text-sm font-bold">
                                    <Briefcase className="w-[18px] h-[18px]" strokeWidth={2.5} />
                                    জব প্লেসমেন্ট সাপোর্ট
                                </div>
                            )}
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
                                {course.videoBadgeTitle && (
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold text-sm">{course.videoBadgeSubtitle}</span>
                                                <span className="text-white font-bold text-xl">{course.videoBadgeTitle}</span>
                                            </div>
                                            {course.videoBadgeIcon && (
                                                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                                                    <span className="text-2xl">{course.videoBadgeIcon}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Batch Information Bar */}
                {course.batches && course.batches.length > 0 && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-16">
                        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                            <div className="p-8">
                                <span className="block text-gray-500 text-xs font-bold uppercase mb-2">ব্যাচ শুরু</span>
                                <span className="px-3 py-1 bg-gray-100 rounded-md font-extrabold text-gray-800">
                                    {course.batches[0]?.startDate}
                                </span>
                            </div>
                            <div className="p-8">
                                <span className="block text-gray-500 text-xs font-bold uppercase mb-2">
                                    <span className="mr-2">📅</span>লাইভ ক্লাস
                                </span>
                                <span className="font-extrabold text-gray-800">
                                    {course.batches[0]?.classTime}
                                </span>
                            </div>
                            <div className="p-8">
                                <span className="block text-gray-500 text-xs font-bold uppercase mb-3">
                                    <span className="mr-2">⏰</span>ক্লাস শুরু হতে বাকি
                                </span>
                                <CountdownTimer targetDate={course.batches[0]?.startDate} />
                            </div>
                            <div className="p-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="block text-gray-500 text-xs font-bold uppercase mb-2 text-[#EF4444]">
                                            <span className="mr-2">🎓</span>ভর্তি চলছে
                                        </span>
                                        <span className="font-extrabold text-gray-800 text-xl">{course.batchNumber || '১ম ব্যাচে'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* AI Section */}
                {course.showAiLearningBanner === true && (
                    <div id="ai-features" className="relative overflow-hidden rounded-[40px] mb-16 bg-[#050D1F]">
                        {/* Glowing Background Orbs */}
                        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
                        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-0">
                            {/* Left: Text Content */}
                            <div className="flex-1 p-10 md:p-14 space-y-7">
                                {course.aiLearningBadge && (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-blue-300 text-[13px] font-black rounded-xl border border-white/10 uppercase tracking-wider">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                                        {course.aiLearningBadge}
                                    </span>
                                )}

                                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                    {course.aiLearningTitle1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{course.aiLearningHighlight}</span> {course.aiLearningTitle2}
                                </h2>

                                <p className="text-gray-400 text-[16px] leading-relaxed font-medium max-w-[520px]">
                                    {course.aiLearningDetails}
                                </p>

                                {/* AI Feature Pills */}
                                <div className="flex flex-wrap gap-3">
                                    {course.aiFeatures?.map((item: string, i: number) => (
                                        item ? (
                                            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/10 hover:border-blue-500/30 transition-all cursor-default">
                                                <span>{item}</span>
                                            </div>
                                        ) : null
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
                                {(course.aiLearningImageBadge1 || course.aiLearningImageBadge2) && (
                                    <div className="absolute top-6 right-6 z-20 flex flex-col gap-3">
                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white text-center shadow-xl">
                                            <div className="text-2xl font-black text-blue-300">{course.aiLearningImageBadge1}</div>
                                            <div className="text-[11px] font-black text-gray-300 uppercase tracking-wider">{course.aiLearningImageBadge2}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Detailed Description Section */}
                {course.fullDetails && (
                    <section className="mb-16">
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden relative group hover:shadow-md transition-all duration-300">
                            {/* Suburban glass effect background element */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#6C5DD3]/5 rounded-full blur-[80px] pointer-events-none"></div>
                            
                            <div className="p-7 md:p-10 relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6C5DD3] to-[#8E82EF] flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform duration-300">
                                        <Info className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl md:text-[28px] font-black text-[#1A1D1F] tracking-tight">কোর্স বিস্তারিত</h2>
                                        <div className="h-1 w-10 bg-[#6C5DD3]/20 rounded-full mt-1"></div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-3.5">
                                    {course.fullDetails.split('\n').filter((p: string) => p.trim() !== '').map((paragraph: string, idx: number) => {
                                        // Detect if it's a list item (starts with an emoji or bullet)
                                        const isList = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2022}\u{25CF}]/u.test(paragraph.trim());
                                        
                                        return (
                                            <p 
                                                key={idx} 
                                                className={`text-[#374151] text-[16px] md:text-[17px] leading-[1.6] font-medium ${isList ? 'md:pl-1' : 'mb-1 last:mb-0'}`}
                                            >
                                                {paragraph}
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Tabs Navigation */}
                <div className="sticky top-[80px] bg-[#F8FAFC] z-20 pt-4 border-b border-gray-200 mb-16">
                    <div className="flex items-center justify-between overflow-x-auto no-scrollbar">
                        {[
                            { id: 'curriculum', label: 'কারিকুলাম', show: !!course.modules?.length },
                            { id: 'ai-features', label: 'AI ফিচার', show: !!(course.aiFeatures?.length || course.showAiLearningBanner) },
                            { id: 'benefits', label: 'কোর্স আপনি পাচ্ছেন', show: !!course.benefits?.length },
                            { id: 'projects', label: 'প্রজেক্টসমূহ', show: !!course.totalProjects },
                            { id: 'audience', label: 'কোর্সটি যাদের জন্য', show: !!course.targetAudience?.length },
                            { id: 'placements', label: 'জব পেয়েছে যারা', show: !!course.successStories?.length },
                            { id: 'reviews', label: 'রিভিউ', show: !!course.testimonials?.length },
                            { id: 'faq', label: 'FAQ', show: !!course.faqs?.length },
                            { id: 'payment', label: 'পেমেন্ট', show: true },
                        ].filter(tab => tab.show).map(tab => (
                            <button
                                key={tab.id}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTab(tab.id);
                                    const element = document.getElementById(tab.id);
                                    if (element) {
                                        const y = element.getBoundingClientRect().top + window.scrollY - 150;
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

                {/* Main Content Sections */}
                <div className="space-y-16">

                    {/* Demo Class Section */}
                    {course?.demoClass?.videoUrls && course.demoClass.videoUrls.length > 0 && (
                        <section className="text-center space-y-10">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1D1F]">
                                কোর্সে জয়েন করার আগে ডেমো ক্লাস দেখে নিন
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {course.demoClass.videoUrls.map((url: string, i: number) => (
                                    <div key={i} className="relative group rounded-[24px] overflow-hidden shadow-md bg-black w-full" style={{ paddingBottom: '56.25%' }}>
                                        <iframe
                                            src={getYoutubeEmbedUrl(url)}
                                            title="Demo Video"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="absolute top-0 left-0 w-full h-full border-0"
                                        ></iframe>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Live Demo Class Booking Card */}
                    {course.demoClass?.showBookingCard && (
                        <section id="payment" className="bg-[#0B1221] rounded-[40px] p-6 md:p-12 overflow-hidden relative">
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
                                        {course.demoClass.date && (
                                            <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5 text-sm font-extrabold text-[#1A1D1F]">
                                                <CalendarDays className="w-4 h-4 text-[#EF4444]" /> {course.demoClass.date}
                                            </div>
                                        )}
                                        {course.demoClass.time && (
                                            <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5 text-sm font-extrabold text-[#1A1D1F]">
                                                <Clock className="w-4 h-4 text-[#EF4444]" /> {course.demoClass.time}
                                            </div>
                                        )}
                                        {course.demoClass.platform && (
                                            <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5 text-sm font-extrabold text-[#1A1D1F]">
                                                <MapPin className="w-4 h-4 text-[#EF4444]" /> {course.demoClass.platform}
                                            </div>
                                        )}
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
                    )}

                    {/* Content Section (Tabs Content) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Content */}
                        <div id="curriculum" className="lg:col-span-2 space-y-12">
                            {activeTab === 'curriculum' ? (
                                <div className="bg-white p-6 md:p-10 rounded-[32px] border border-gray-100 shadow-sm min-h-[400px] animate-fade-in">
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
                                    {course.tools && course.tools.length > 0 && (
                                        <div id="projects" className="mt-16 text-center animate-fade-in">
                                            <h2 className="text-2xl md:text-3xl font-black text-[#1A1D1F] mb-10">যেসব টুলস ও টেকনোলজি শিখবেন</h2>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                                                {course.tools.map((tool: any, idx: number) => (
                                                    <div key={idx} className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:shadow-md hover:border-gray-200 transition-all cursor-default">
                                                        <div className="h-12 flex items-center justify-center">
                                                            {tool.image ? (
                                                                <img src={tool.image} alt={tool.name} className="w-10 h-10 object-contain" />
                                                            ) : (
                                                                <div className="text-[#1A1D1F] text-2xl font-black">
                                                                    {typeof tool === 'string' ? tool.substring(0, 3) : (tool.name?.substring(0, 3) || "Tool")}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="font-bold text-gray-800 text-sm">{typeof tool === 'string' ? tool : tool.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

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
                {course.assignedTeachers && course.assignedTeachers.length > 0 && (
                    <section className="mt-20 mb-16">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#F59E0B]">
                                ইন্সট্রাক্টর
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {course.assignedTeachers.map((teacher: any, idx: number) => (
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
                                        {teacher.bio || "Experience Instructor"}
                                    </p>
                                    {teacher.organizationLogos && (
                                        <div className="bg-[#F8FAFC] p-3 rounded-lg flex items-center justify-start mt-auto">
                                            {/* Render logos if they exist */}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Bottom AI Section */}
                {course.showAiJobReadyBanner === true && (
                    <div className="relative overflow-hidden rounded-[40px] mt-16 bg-[#050D1F]">
                        {/* Glowing orbs */}
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>
                        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row-reverse items-center gap-0">
                            {/* Right (visually left on lg): Text Content */}
                            <div className="flex-1 p-10 md:p-14 space-y-7">
                                {course.aiJobReadyBadge && (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-purple-300 text-[13px] font-black rounded-xl border border-white/10 uppercase tracking-wider">
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                                        {course.aiJobReadyBadge}
                                    </span>
                                )}

                                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                    {course.aiJobReadyTitle1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{course.aiJobReadyHighlight}</span> {course.aiJobReadyTitle2}
                                </h2>

                                <p className="text-gray-400 text-[16px] leading-relaxed font-medium max-w-[520px]">
                                    {course.aiJobReadyDetails}
                                </p>

                                {/* Stats Row */}
                                <div className="flex flex-wrap gap-5">
                                    {[
                                        { value: course.modules?.length, label: 'মডিউল', show: !!course.modules?.length },
                                        { value: course.totalLectures, label: 'লাইভ ক্লাস', show: !!course.totalLectures },
                                        { value: course.totalProjects, label: 'প্রজেক্ট', show: !!course.totalProjects },
                                    ].map((stat, i) => stat.show ? (
                                        <div key={i} className="flex flex-col items-center px-6 py-4 bg-white/5 border border-white/10 rounded-2xl min-w-[90px]">
                                            <span className="text-2xl font-black text-white">{stat.value}</span>
                                            <span className="text-[12px] font-bold text-gray-400 mt-0.5">{stat.label}</span>
                                        </div>
                                    ) : null)}
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
                                {course.aiJobReadyImageBadge && (
                                    <div className="absolute top-6 left-6 z-20">
                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white text-center shadow-xl">
                                            <div className="text-2xl font-black text-purple-300">🏆</div>
                                            <div className="text-[11px] font-black text-gray-300 uppercase tracking-wider">{course.aiJobReadyImageBadge}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Certificate Section */}
                {course.showCertificate !== false && (
                    <section className="mt-20 mb-20 bg-gray-50 py-16">
                        <div className="container mx-auto px-4 max-w-6xl">
                            <div className="flex flex-col items-center justify-center mb-12 text-center">
                                <h2 className="text-4xl md:text-5xl font-extrabold text-[#F59E0B] mb-4">
                                    সার্টিফিকেট
                                </h2>
                                <p className="text-xl md:text-2xl text-[#475569] font-semibold">
                                    কোর্স শেষে পেয়ে যান শেয়ারেবল কোর্স কমপ্লিশন এবং এসেসমেন্ট সার্টিফিকেট
                                </p>
                            </div>

                            <div className="flex flex-col items-center justify-center">
                                <div className="relative w-full max-w-[900px] bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
                                    <img
                                        src={course.certificateUrl || "/images/certificate.jpeg"}
                                        alt="Course Certificate"
                                        className="w-full h-auto object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Career Opportunities Section */}
                {course.careerOpportunities && course.careerOpportunities.length > 0 && (
                    <section className="mt-16 mb-16">
                        <div className="flex flex-col items-center justify-center mb-12 text-center">
                            <div className="relative inline-block">
                                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1D1F]">
                                    ক্যারিয়ার <span className="text-[#FBBF24]">সুযোগ</span>
                                </h2>
                                <svg className="absolute -bottom-3 right-0 w-36 text-[#FBBF24]" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 15Q50 5 95 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {course.careerOpportunities.map((opp: any, idx: number) => (
                                <div key={idx} className="bg-[#EEF2F6] rounded-2xl p-8 flex flex-col items-start gap-4 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <Briefcase className="w-6 h-6 text-[#6C5DD3]" />
                                    </div>
                                    <h3 className="text-[#1A1D1F] font-bold text-xl leading-tight">
                                        {opp.title}
                                    </h3>
                                    <p className="text-gray-600 text-[15px] font-medium leading-relaxed">
                                        {opp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Requirements Section */}
                {course.requirements && course.requirements.length > 0 && (
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
                            {course.requirements.map((req: any, i: number) => (
                                <div key={i} className="bg-[#EEF2F6] rounded-2xl p-8 flex flex-col items-start gap-6">
                                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        {req.icon ? (
                                            <img src={req.icon} alt="icon" className="w-8 h-8" />
                                        ) : (
                                            <MonitorSmartphone className="w-8 h-8 text-[#6C5DD3]" />
                                        )}
                                    </div>
                                    <h3 className="text-[#1A1D1F] font-bold text-lg leading-relaxed">
                                        {req.text || req}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Course Benefits Detailed Grid */}
                {course.benefits && course.benefits.length > 0 && (
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
                                {course.benefits.map((item: any, i: number) => (
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
                )}

                {/* What you will learn Section */}
                {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
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
                            {course.whatYouWillLearn.map((item: any, i: number) => (
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
                )}

                {/* Target Audience Section */}
                {course.targetAudience && course.targetAudience.length > 0 && (
                    <section id="audience" className="mt-20 mb-16">
                        <div className="flex flex-col items-center justify-center mb-12">
                            <div className="relative inline-block">
                                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1D1F]">
                                    কোর্সটি আপনারই জন্য
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {course.targetAudience.map((item: any, i: number) => (
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
                )}

                {/* Success Stories Section */}
                {course.successStories && course.successStories.length > 0 && (
                    <section id="placements" className="mt-20 mb-16">
                        <div className="flex flex-col items-center justify-center mb-12">
                            <div className="relative inline-block">
                                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1D1F]">
                                    সাকসেসফুল হয়েছেন যারা
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {course.successStories.map((student: any, i: number) => (
                                <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 flex items-start gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow group">
                                    <div className="relative shrink-0">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm font-bold text-gray-500 text-sm">
                                            <img
                                                src={student.image || `https://ui-avatars.com/api/?name=${student.name}&background=random&color=fff&size=48`}
                                                alt={student.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                        {student.role && (
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 p-0.5">
                                                <img src={`https://ui-avatars.com/api/?name=${student.role.split(' ').pop()}&background=fff&color=6C5DD3&size=20&rounded=true`} alt="company" className="w-full h-full rounded-full" />
                                            </div>
                                        )}
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
                )}

                {/* Testimonials / Feedback Section */}
                {course.testimonials && course.testimonials.length > 0 && (
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
                            {course.testimonials.map((review: any, i: number) => (
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
                                        <div className="text-[#FBBF24] opacity-50 text-2xl leading-none h-4">
                                            &rdquo;
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* FAQ Section */}
                {course.faqs && course.faqs.length > 0 && (
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
                                {course.faqs.map((faq: any, index: number) => (
                                    <details key={index} className="group border border-gray-100 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] [&_summary::-webkit-details-marker]:hidden">
                                        <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-xl p-5 md:p-6 text-[#1A1D1F] font-bold md:text-[17px] focus:outline-none">
                                            {faq.question}
                                            <ChevronDown className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180 text-gray-500" strokeWidth={2.5} />
                                        </summary>

                                        <div className="px-5 pb-5 md:px-6 md:pb-6 text-[#475569] font-medium leading-relaxed">
                                            <p>{faq.answer}</p>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

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
