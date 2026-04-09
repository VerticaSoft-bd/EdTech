"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import HeroCarousel from "@/app/components/HeroCarousel";
import SeminarModal from "@/app/components/SeminarModal";
import TeacherCarousel from "@/app/components/TeacherCarousel";
import BrandCarousel from "@/app/components/BrandCarousel";

// Static data removed, fetching from API now.

export default function RootPage() {
    const [isSeminarModalOpen, setIsSeminarModalOpen] = useState(false);
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [upcomingCourses, setUpcomingCourses] = useState<any[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [allFreeClasses, setAllFreeClasses] = useState<any[]>([]);
    const [freeClasses, setFreeClasses] = useState<any[]>([]);
    const [selectedBatchCategory, setSelectedBatchCategory] = useState("All");
    const [selectedFreeCategory, setSelectedFreeCategory] = useState("All Types");
    const [dynamicBatchCategories, setDynamicBatchCategories] = useState<string[]>(["All"]);
    const [dynamicFreeCategories, setDynamicFreeCategories] = useState<string[]>(["All Types"]);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [siteSettings, setSiteSettings] = useState<any>(null);
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const [selectedMode, setSelectedMode] = useState("All");
    const [selectedSeminarTitle, setSelectedSeminarTitle] = useState("");
    const freeCategoriesRef = React.useRef<HTMLDivElement>(null);
    const freeClassesSectionRef = React.useRef<HTMLElement>(null);

    const scrollFreeCategories = (direction: "left" | "right") => {
        if (freeCategoriesRef.current) {
            const scrollAmount = 300;
            freeCategoriesRef.current.scrollBy({ 
                left: direction === "left" ? -scrollAmount : scrollAmount, 
                behavior: 'smooth' 
            });
        }
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch("/api/courses");
                if (res.ok) {
                    const data = await res.json();
                    setAllCourses(data.data || []);
                    setUpcomingCourses((data.data || []).slice(0, 4)); // Get first 4 courses
                }
            } catch (err) {
                console.error("Error fetching courses", err);
            } finally {
                setLoadingCourses(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        const batchCats = ["All", ...data.data.map((c: any) => c.name)];
                        setDynamicBatchCategories(batchCats);
                        const freeCats = ["All Types", ...data.data.map((c: any) => c.name)];
                        setDynamicFreeCategories(freeCats);
                    }
                }
            } catch (err) {
                console.error("Error fetching categories", err);
            }
        };

        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        setSiteSettings(data.data);
                        setAllFreeClasses(data.data.freeClasses || []);
                        setFreeClasses(data.data.freeClasses || []);
                        setTestimonials(data.data.testimonials || []);
                    }
                }
            } catch (err) {
                console.error("Error fetching settings", err);
            }
        };

        fetchCourses();
        fetchCategories();
        fetchSettings();
    }, []);

    useEffect(() => {
        let filtered = allCourses;
        
        // Filter by Mode
        if (selectedMode !== "All") {
            filtered = filtered.filter(c => c.courseMode === selectedMode);
        }

        // Filter by Category
        if (selectedBatchCategory !== "All") {
            filtered = filtered.filter(c => c.category === selectedBatchCategory);
        }

        setUpcomingCourses(filtered.slice(0, 4));
    }, [selectedBatchCategory, selectedMode, allCourses]);

    useEffect(() => {
        if (selectedFreeCategory === "All Types") {
            setFreeClasses(allFreeClasses);
        } else {
            setFreeClasses(allFreeClasses.filter(c => c.category === selectedFreeCategory));
        }
    }, [selectedFreeCategory, allFreeClasses]);

    const nextTestimonial = () => {
        if (testimonials.length === 0) return;
        const perPage = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 4;
        setTestimonialIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / perPage));
    };

    const prevTestimonial = () => {
        if (testimonials.length === 0) return;
        const perPage = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 4;
        const totalPages = Math.ceil(testimonials.length / perPage);
        setTestimonialIndex((prev) => (prev - 1 + totalPages) % totalPages);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1A1D1F] flex flex-col">
            <Header />

            <main className="flex-1 flex flex-col items-center w-full max-w-[1300px] mx-auto px-4 sm:px-6 py-8 md:py-12 gap-16">

                {/* Hero Section */}
                <HeroCarousel onOpenModal={() => { setSelectedSeminarTitle("Website Hero Seminar"); setIsSeminarModalOpen(true); }} />

                {/* Registration Modals */}
                <SeminarModal
                    isOpen={isSeminarModalOpen}
                    onClose={() => setIsSeminarModalOpen(false)}
                    courseTitle={selectedSeminarTitle}
                />

                {/* Category Flow Tabs - Centered Below Hero */}
                <div className="flex justify-center w-full relative z-20 mt-8 lg:mt-12 px-4 pb-8">
                    <div className="bg-white rounded-[24px] p-2 shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-wrap items-center justify-center gap-1 max-w-fit mx-auto backdrop-blur-sm">

                        {[
                            { label: "Online Course", mode: "Online Class", icon: (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                            )},
                            { label: "Offline Course", mode: "Offline Class", icon: (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                            )},
                            { label: "Free Seminar", mode: "Seminar", icon: (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                            )}
                        ].map((item, idx) => (
                            <button
                                key={item.label}
                                onClick={() => {
                                    if (item.mode === "Seminar") {
                                        setSelectedSeminarTitle("General Live Seminar");
                                        freeClassesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                                    } else {
                                        // Toggle: if clicking active mode, return to "All"
                                        setSelectedMode(prev => prev === item.mode ? "All" : item.mode);
                                    }
                                }}
                                className={`px-4 py-2.5 md:px-6 md:py-3 text-[11px] md:text-[13px] font-black rounded-xl transition-all relative group flex items-center gap-2 md:gap-3 overflow-hidden ${
                                    (selectedMode === item.mode || (item.mode === "Seminar" && false)) // Seminar is a scroll action, doesn't stay "selected" in mode filter
                                    ? "text-[#6C5DD3]"
                                    : "text-gray-500 hover:text-[#1A1D1F]"
                                    }`}
                            >
                                {/* Magnetic Glow Background */}
                                <div className="absolute inset-0 bg-[#6C5DD3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[#6C5DD3]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>

                                {/* Icon */}
                                <div className="relative z-10 transition-transform group-hover:scale-110 duration-300">
                                    {item.icon}
                                </div>

                                <span className="relative z-10 uppercase tracking-widest">{item.label}</span>

                                {/* AI Indicator */}
                                {selectedMode === item.mode ? (
                                    <div className="relative z-10 flex gap-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#6C5DD3] animate-pulse"></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#6C5DD3]/40"></span>
                                    </div>
                                ) : (
                                    <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#6C5DD3]/30 transition-colors"></div>
                                )}

                                {/* Bottom Energy Bar */}
                                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-[#6C5DD3] rounded-full transition-all duration-300 ${selectedMode === item.mode ? 'w-6' : 'w-0 group-hover:w-4 opacity-50'}`}></span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Upcoming Live Batches */}
                <section className="w-full pt-4">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h2 className="text-[24px] md:text-[28px] text-center md:text-left font-bold flex flex-col md:flex-row items-center gap-3 text-gray-900">
                            <div className="flex items-center gap-3">
                                <span className="w-5 h-2 bg-[#EF4444] rounded-full inline-block"></span>
                                Upcoming Live Batches
                            </div>
                        </h2>
                        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
                            {dynamicBatchCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedBatchCategory(cat)}
                                    className={`px-5 py-2 text-[13px] md:text-sm font-semibold rounded-full transition-all duration-300 ${selectedBatchCategory === cat
                                        ? "bg-[#4A72FF] text-white shadow-sm"
                                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loadingCourses ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-[20px] overflow-hidden flex flex-col h-[340px]">
                                    <div className="bg-gray-200 h-[180px] w-full"></div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-auto"></div>
                                        <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
                                            <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                                            <div className="flex-1">
                                                <div className="h-2 bg-gray-200 rounded w-1/3 mb-1"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : upcomingCourses.length > 0 ? (
                            upcomingCourses.map((course, i) => (
                                <Link href={`/courses/${course.slug || course._id}`} key={course._id || i} className="border border-gray-200 rounded-[20px] overflow-hidden bg-white flex flex-col group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
                                    <div className="relative h-[180px] bg-gray-100 overflow-hidden">
                                        <img src={course.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={course.title} />
                                        <div className="absolute top-3 left-3 bg-[#EF4444] flex items-center gap-1.5 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider shadow-sm">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                            Live
                                        </div>
                                        <span className="absolute top-3 right-3 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-md backdrop-blur-md font-medium">
                                            {course.category}
                                        </span>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-bold text-gray-900 text-[17px] leading-[1.3] mb-5 group-hover:text-[#1A62FF] transition-colors line-clamp-2">{course.title}</h3>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                            {course.assignedTeachers && course.assignedTeachers.length > 0 ? (
                                                <div className="flex items-center gap-2.5">
                                                    <img src={course.assignedTeachers[0].profileImage || `https://ui-avatars.com/api/?name=${course.assignedTeachers[0].name}&background=random`} className="w-9 h-9 rounded-full bg-gray-200 object-cover border border-gray-200" alt={course.assignedTeachers[0].name} />
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] text-gray-500 font-medium tracking-wide uppercase">Instructor</span>
                                                        <span className="text-[13px] font-bold text-gray-900 truncate max-w-[100px]">{course.assignedTeachers[0].name}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">🏫</div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] text-gray-500 font-medium tracking-wide uppercase">Team</span>
                                                        <span className="text-[13px] font-bold text-gray-900 truncate">V-Soft Ed</span>
                                                    </div>
                                                </div>
                                            )}

                                            <button className="w-9 h-9 flex items-center justify-center bg-blue-50 text-[#1A62FF] rounded-xl hover:bg-blue-100 transition group-hover:translate-x-1 shrink-0">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-gray-500 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                No upcoming live batches found at the moment.
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center mt-10">
                        <Link href="/courses">
                            <button className="px-7 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition text-[15px] flex items-center gap-2 bg-white">
                                Load More Courses
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="m6 9 6 6 6-6" /></svg>
                            </button>
                        </Link>
                    </div>
                </section>

                {/* Free Classes (Dark Theme) */}
                <section ref={freeClassesSectionRef} className="w-full bg-[#181C25] rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden mt-6">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[80px] -z-0 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex justify-center mb-10">
                            <h2 className="text-3xl font-extrabold flex items-center gap-3 text-white tracking-tight">
                                <span className="bg-[#EF4444] text-white text-[11px] px-2.5 py-1 rounded font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-lg shadow-red-500/20">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                    Live
                                </span>
                                Free Classes
                            </h2>
                        </div>

                        <div className="relative mb-14 w-full max-w-5xl mx-auto flex items-center group/slider">
                            {/* Left Button */}
                            <button
                                onClick={() => scrollFreeCategories("left")}
                                className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center text-[#181C25] shadow-[0_20px_50px_-8px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_-5px_rgba(255,255,255,0.4)] hover:scale-110 active:scale-95 transition-all shrink-0 z-30 cursor-pointer border border-white/20"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            </button>

                            <div
                                ref={freeCategoriesRef}
                                className="flex items-center gap-3 md:gap-5 overflow-x-auto no-scrollbar scroll-smooth w-full px-4 md:px-6 py-2"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {dynamicFreeCategories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedFreeCategory(cat)}
                                        className={`px-5 py-2.5 md:px-8 md:py-3.5 rounded-full text-[12px] md:text-[14px] transition-all duration-300 whitespace-nowrap cursor-pointer ${selectedFreeCategory === cat
                                            ? "bg-white text-[#181C25] font-black shadow-[0_15px_30px_-5px_rgba(255,255,255,0.3)] scale-105"
                                            : "bg-white/5 text-gray-400 border border-white/10 font-bold hover:text-white hover:bg-white/10 hover:border-white/20"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Right Button */}
                            <button
                                onClick={() => scrollFreeCategories("right")}
                                className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center text-[#181C25] shadow-[0_20px_50px_-8px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_-5px_rgba(255,255,255,0.4)] hover:scale-110 active:scale-95 transition-all shrink-0 z-30 cursor-pointer border border-white/20"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" transform="rotate(180 12 12)" /></svg>
                            </button>
                        </div>

                        <style jsx>{`
                            .no-scrollbar::-webkit-scrollbar {
                                display: none !important;
                            }
                        `}</style>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {freeClasses.length > 0 ? freeClasses.map((cls, i) => (
                                <div key={i} className="group border border-gray-700/50 rounded-[20px] overflow-hidden bg-[#1E232F] flex flex-col p-4 shadow-xl hover:-translate-y-1 transition-transform duration-300 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                    <div className="relative h-[130px] rounded-2xl overflow-hidden mb-5 bg-[#141820] border border-gray-700/30 flex items-center justify-center group-hover:border-gray-600/50 transition-colors">
                                        <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${cls.color || 'from-blue-500 to-indigo-500'} blur-[30px]`}></div>
                                        <div className="text-center relative z-10 px-4">
                                            <h4 className={`text-xl font-black text-transparent bg-clip-text bg-gradient-to-r ${cls.color || 'from-blue-500 to-indigo-500'} leading-tight drop-shadow-md`}>{cls.title}</h4>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-2 font-bold">{cls.subtitle}</p>
                                        </div>
                                        <span className="absolute top-2.5 left-2.5 bg-[#EF4444] text-white text-[9px] px-2 py-0.5 rounded uppercase font-black tracking-wider shadow-sm flex items-center gap-1">
                                            <span className="w-1 h-1 bg-white rounded-full"></span> LIVE
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col relative z-10">
                                        <p className="text-[11px] text-gray-400 mb-2 font-medium flex items-center gap-1.5">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                            {cls.time || "Today • 9:00 PM"}
                                        </p>
                                        <h3 className="font-bold text-white leading-snug text-[15px] mb-5">Masterclass on {cls.category || cls.title.split(' ')[0]} Technology & Career.</h3>
                                        <button 
                                            onClick={() => {
                                                setSelectedSeminarTitle(`Masterclass on ${cls.category || cls.title.split(' ')[0]} Technology & Career`);
                                                setIsSeminarModalOpen(true);
                                            }}
                                            className="mt-auto w-full py-2.5 flex items-center justify-center gap-2 bg-white/5 text-white font-bold text-sm rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition group-hover:bg-[#4A72FF] group-hover:border-[#4A72FF] group-hover:shadow-lg group-hover:shadow-blue-500/25"
                                        >
                                            Enroll Now
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6" /></svg>
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-12 text-center text-gray-500 bg-gray-900/50 rounded-2xl border border-dashed border-gray-700">
                                    No free classes available at the moment.
                                </div>
                            )}
                        </div>

                        {freeClasses.length > 4 && (
                            <div className="flex justify-center mt-12">
                                <button className="px-8 py-3.5 bg-white text-[#181C25] font-extrabold rounded-xl hover:bg-gray-100 transition text-[15px] shadow-xl shadow-white/10 flex items-center gap-2">
                                    Explore All Free Classes
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* What You Will Get */}
                <section className="w-full py-24 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#6C5DD3]/5 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="text-center mb-20 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C5DD3]/10 text-[#6C5DD3] text-[11px] font-black uppercase tracking-widest mb-4">
                            Premium Benefits
                        </div>
                        <h2 className="text-[32px] md:text-[40px] font-black text-gray-900 leading-tight">What You Will <span className="text-[#6C5DD3]">Get</span></h2>
                    </div>

                    <div className="relative max-w-6xl mx-auto px-4">
                        {/* Timeline Connector Line */}
                        <div className="absolute top-[48px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-transparent via-gray-200 to-transparent hidden md:block">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#6C5DD3]/0 via-[#6C5DD3]/40 to-[#6C5DD3]/0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 relative z-10">
                            {[
                                {
                                    title: "১০০% জব প্লেসমেন্ট গাইডেন্স",
                                    step: "01",
                                    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
                                    color: "text-amber-600",
                                    bg: "bg-amber-50",
                                    glow: "group-hover:shadow-amber-500/20"
                                },
                                {
                                    title: "ইন্টারেক্টিভ লাইভ সেশন",
                                    step: "02",
                                    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
                                    color: "text-blue-600",
                                    bg: "bg-blue-50",
                                    glow: "group-hover:shadow-blue-500/20"
                                },
                                {
                                    title: "ইন্ডাস্ট্রি এক্সপার্টদের মেন্টরশিপ",
                                    step: "03",
                                    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>,
                                    color: "text-emerald-600",
                                    bg: "bg-emerald-50",
                                    glow: "group-hover:shadow-emerald-500/20"
                                },
                                {
                                    title: "কোর্স সমাপ্তিতে সার্টিফিকেট",
                                    step: "04",
                                    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>,
                                    color: "text-purple-600",
                                    bg: "bg-purple-50",
                                    glow: "group-hover:shadow-purple-500/20"
                                }
                            ].map((f, i) => (
                                <div key={i} className="flex flex-col items-center text-center group relative">
                                    {/* Timeline Node Ring */}
                                    <div className="absolute top-[48px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-gray-100 hidden md:block group-hover:border-[#6C5DD3] group-hover:scale-150 transition-all duration-500 z-20">
                                        <div className="absolute inset-1 rounded-full bg-gray-50 group-hover:bg-[#6C5DD3] transition-colors"></div>
                                    </div>

                                    {/* Icon Container */}
                                    <div className={`w-24 h-24 rounded-[32px] ${f.bg} backdrop-blur-sm flex items-center justify-center border border-white shadow-[0_15px_35px_-10px_rgba(0,0,0,0.05)] transform group-hover:-translate-y-8 transition-all duration-700 relative z-10 ${f.glow} group-hover:shadow-2xl group-hover:bg-white`}>
                                        <div className="absolute -top-3 -right-3 w-9 h-9 rounded-2xl bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] flex items-center justify-center text-[11px] font-black text-gray-400 group-hover:text-[#6C5DD3] transition-all duration-500 group-hover:rotate-12">
                                            {f.step}
                                        </div>
                                        <span className={`${f.color} transform group-hover:scale-110 transition-transform duration-500`}>{f.icon}</span>
                                    </div>

                                    {/* Text Content */}
                                    <div className="mt-10 md:mt-16 px-4">
                                        <p className="font-black text-[#1A1D1F] text-[16px] md:text-[18px] leading-snug transition-all duration-500 group-hover:text-[#6C5DD3] group-hover:translate-y-[-4px]">
                                            {f.title}
                                        </p>
                                        <div className="w-10 h-1 bg-gradient-to-r from-[#6C5DD3]/0 via-[#6C5DD3]/20 to-[#6C5DD3]/0 rounded-full mx-auto mt-5 group-hover:w-20 group-hover:via-[#6C5DD3] transition-all duration-700"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="w-full pb-20 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                        <h2 className="text-[28px] font-extrabold text-gray-900 border-l-4 border-[#6C5DD3] pl-4">See What Our Students Says</h2>
                        <div className="flex gap-3">
                            <button onClick={prevTestimonial} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-600 hover:bg-[#6C5DD3] hover:text-white hover:border-[#6C5DD3] transition-all shadow-sm group">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            </button>
                            <button onClick={nextTestimonial} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-600 hover:bg-[#6C5DD3] hover:text-white hover:border-[#6C5DD3] transition-all shadow-sm group">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6 6-6" transform="rotate(180 12 12)" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="flex transition-transform duration-500 ease-out gap-6" style={{ transform: `translateX(-${testimonialIndex * 100}%)` }}>
                            {testimonials.length > 0 ? testimonials.map((t, i) => (
                                <div key={i} className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex flex-col h-full group/card cursor-pointer">
                                    {/* Video Thumbnail Card */}
                                    <div className="relative rounded-[24px] overflow-hidden aspect-[4/5] shadow-md mb-4 flex-shrink-0">
                                        <img src={t.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" alt={t.studentName} />
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-5">
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <a href={t.videoUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center pointer-events-auto border border-white/40 shadow-xl group-hover/card:bg-white text-white group-hover/card:text-black transition-colors duration-300">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </a>
                                            </div>

                                            <div className="flex items-center gap-3 mt-auto relative z-10 translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
                                                <div className="w-10 h-10 rounded-[12px] border-2 border-white/80 overflow-hidden shadow-md">
                                                    <img src={t.avatar || `https://ui-avatars.com/api/?name=${t.studentName}&background=random`} className="w-full h-full object-cover" alt="avatar" />
                                                </div>
                                                <div>
                                                    <p className="text-white text-[13px] font-extrabold leading-tight">{t.studentName}</p>
                                                    <p className="text-white/80 text-[11px] font-bold">{t.courseName}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text Review Card */}
                                    <div className={`flex-1 rounded-[20px] p-5 flex flex-col justify-between ${i % 2 === 0 ? 'bg-[#1e2a27] border border-[#2a443b]' : 'bg-[#1c222c] border border-[#2d3846]'} text-white shadow-lg transition-transform duration-300 group-hover/card:-translate-y-1`}>
                                        <p className="text-[12px] text-gray-300 leading-[1.6] mb-5 font-medium relative z-10 italic">
                                            <span className={`text-[40px] ${i % 2 === 0 ? 'text-[#386252]' : 'text-[#3d4b60]'} absolute -top-5 -left-1 -z-10`}>"</span>
                                            {t.textFeedback || "The curriculum is exactly what the industry demands. This course was truly a game changer for my career path!"}
                                        </p>
                                        <div className="flex items-center gap-2.5 mt-auto pt-4 border-t border-white/10">
                                            <div className="flex flex-col">
                                                <p className="text-[12px] font-bold text-white leading-none">{t.studentName}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 w-full">
                                    No testimonials available.
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Teacher Profile Section */}
                <TeacherCarousel />

                {/* Brand Carousel Section */}
                <BrandCarousel />
            </main>

            <Footer />
        </div>
    );
}
