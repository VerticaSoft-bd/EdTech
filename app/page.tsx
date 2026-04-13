"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import HeroCarousel from "@/app/components/HeroCarousel";
import SeminarModal from "@/app/components/SeminarModal";
import TeacherCarousel from "@/app/components/TeacherCarousel";
import BrandCarousel from "@/app/components/BrandCarousel";
import TestimonialVideoModal from "@/app/components/TestimonialVideoModal";
import { Play } from 'lucide-react';

// Static data removed, fetching from API now.

export default function RootPage() {
    const [isSeminarModalOpen, setIsSeminarModalOpen] = useState(false);
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [upcomingCourses, setUpcomingCourses] = useState<any[]>([]);
    const [specialPackageCourses, setSpecialPackageCourses] = useState<any[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [allFreeClasses, setAllFreeClasses] = useState<any[]>([]);
    const [freeClasses, setFreeClasses] = useState<any[]>([]);
    const [selectedMode, setSelectedMode] = useState("All");
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [siteSettings, setSiteSettings] = useState<any>(null);
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const [selectedSeminarTitle, setSelectedSeminarTitle] = useState("");
    
    // Video Modal State
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [activeVideo, setActiveVideo] = useState<{ url: string, name: string, course: string }>({ url: '', name: '', course: '' });

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
                        setSpecialPackageCourses(data.data.specialPackageCourses || []);
                    }
                }
            } catch (err) {
                console.error("Error fetching settings", err);
            }
        };

        fetchCourses();
        fetchSettings();
    }, []);

    useEffect(() => {
        let filtered = allCourses;
        
        // Filter by Mode
        if (selectedMode !== "All") {
            filtered = filtered.filter(c => c.courseMode === selectedMode);
        }

        setUpcomingCourses(filtered.slice(0, 4));
    }, [selectedMode, allCourses]);

    useEffect(() => {
        setFreeClasses(allFreeClasses);
    }, [allFreeClasses]);

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
                    <div className="bg-white rounded-2xl p-2 shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-wrap items-center justify-center gap-1 max-w-fit mx-auto backdrop-blur-sm">

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
                                className={`px-4 py-2.5 md:px-6 md:py-3 text-[11px] md:text-[13px] font-black rounded-lg transition-all relative group flex items-center gap-2 md:gap-3 overflow-hidden ${
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
                        <h2 className="text-[24px] md:text-[28px] text-center md:text-left font-bold flex flex-col md:flex-row items-center gap-3 text-gray-900">
                            <div className="flex items-center gap-3">
                                <span className="w-5 h-2 bg-[#EF4444] rounded-full inline-block"></span>
                                Upcoming Live Batches
                            </div>
                        </h2>

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
                                <Link href={`/courses/${course.slug || course._id}`} key={course._id || i} className="border border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
                                    <div className="relative h-[180px] bg-gray-100 overflow-hidden">
                                        <img src={course.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={course.title} />
                                        <div className="absolute top-3 left-3 bg-[#EF4444] flex items-center gap-1.5 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider shadow-sm">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                            Live
                                        </div>
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

                                            <button className="w-9 h-9 flex items-center justify-center bg-blue-50 text-[#1A62FF] rounded-lg hover:bg-blue-100 transition group-hover:translate-x-1 shrink-0">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-gray-500 font-medium bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                No upcoming live batches found at the moment.
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center mt-10">
                        <Link href="/courses">
                            <button className="px-7 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition text-[15px] flex items-center gap-2 bg-white">
                                Load More Courses
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="m6 9 6 6 6-6" /></svg>
                            </button>
                        </Link>
                    </div>
                </section>

                {/* Special Package Courses - NEW SECTION */}
                {specialPackageCourses.length > 0 && (
                    <section className="w-full relative py-12">
                        {/* Abstract Background Element */}
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[80%] bg-gradient-to-r from-[#6C5DD3]/5 via-white to-[#6C5DD3]/5 rounded-[3rem] -z-10"></div>
                        
                        <div className="flex flex-col md:flex-row justify-between items-end mb-10 px-2 gap-4">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest mb-3">
                                    🔥 Hot Deals
                                </div>
                                <h2 className="text-[28px] md:text-[36px] font-black text-gray-900 leading-tight">
                                    Special <span className="text-[#6C5DD3]">Package</span> Courses
                                </h2>
                                <p className="text-gray-500 font-medium mt-2">Curated expert-led bundles for accelerated learning</p>
                            </div>
                            <Link href="/courses" className="text-[#6C5DD3] font-black text-sm uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-2 pb-1 border-b-2 border-transparent hover:border-[#6C5DD3]/30">
                                View All Deals
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {specialPackageCourses.map((course, idx) => {
                                const activeBatch = Array.isArray(course.assignedBatches) 
                                    ? (course.assignedBatches.find((b: any) => b.status === 'Active') || course.assignedBatches[0])
                                    : null;
                                const seatsLeft = activeBatch 
                                    ? Math.max(0, (activeBatch.totalSeats || 0) - (activeBatch.enrolledStudents || 0))
                                    : Math.max(0, (course.totalSeats || 0) - (course.totalStudents || 0));

                                return (
                                    <Link 
                                        href={`/courses/${course.slug || course._id}`} 
                                        key={course._id || idx} 
                                        className="group relative bg-white rounded-xl border border-gray-100 hover:border-[#6C5DD3]/20 shadow-sm hover:shadow-2xl hover:shadow-[#6C5DD3]/10 transition-all duration-500 flex flex-col overflow-hidden"
                                    >
                                        {/* Premium Card Header/Image */}
                                        <div className="aspect-[16/10] relative overflow-hidden">
                                            <img 
                                                src={course.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400&auto=format&fit=crop"} 
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                                alt={course.title} 
                                            />
                                            
                                            {/* Floating Badge */}
                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-white/20 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                                                    <span className="text-[10px] font-black text-gray-900 tracking-wider">LIMITED TIME</span>
                                                </div>
                                            </div>

                                            {/* Save Badge */}
                                            <div className="absolute top-4 right-4 w-12 h-12 bg-[#6C5DD3] text-white rounded-full flex flex-col items-center justify-center shadow-xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                                <span className="text-[10px] font-bold leading-none">SAVE</span>
                                                <span className="text-[14px] font-black leading-none">20%</span>
                                            </div>

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-[#6C5DD3]/0 group-hover:bg-[#6C5DD3]/10 transition-colors duration-500"></div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">
                                                    {course.category?.name || 'Bundle'}
                                                </span>
                                                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none translate-y-[1px]">
                                                    {course.courseMode}
                                                </span>
                                            </div>
                                            
                                            <h3 className="text-[17px] font-black text-gray-900 mb-6 group-hover:text-[#6C5DD3] transition-colors line-clamp-2 leading-tight">
                                                {course.title}
                                            </h3>

                                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Seats Left</span>
                                                    </div>
                                                    <span className="text-[15px] font-black text-[#EF4444]">
                                                        {seatsLeft} Seats
                                                    </span>
                                                </div>

                                                <div className="flex flex-col items-end">
                                                    <div className="text-[10px] text-gray-400 line-through font-bold">৳{Math.round((course.price || 5000) * 1.25)}</div>
                                                    <div className="text-lg font-black text-[#6C5DD3]">৳{course.price || 5000}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Free Classes (Dark Theme) */}
                <section ref={freeClassesSectionRef} className="w-full bg-[#181C25] rounded-[1.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden mt-6">
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {freeClasses.length > 0 ? freeClasses.map((cls, i) => (
                                <div key={i} className="group border border-gray-700/50 rounded-xl overflow-hidden bg-[#1E232F] flex flex-col p-4 shadow-xl hover:-translate-y-1 transition-transform duration-300 relative">
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
                                        <h3 className="font-bold text-white leading-snug text-[15px] mb-5">Masterclass on {cls.title.split(' ')[0]} Technology & Career.</h3>
                                        <button 
                                            onClick={() => {
                                                setSelectedSeminarTitle(`Masterclass on ${cls.title.split(' ')[0]} Technology & Career`);
                                                setIsSeminarModalOpen(true);
                                            }}
                                            className="mt-auto w-full py-2.5 flex items-center justify-center gap-2 bg-white/5 text-white font-bold text-sm rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition group-hover:bg-[#4A72FF] group-hover:border-[#4A72FF] group-hover:shadow-lg group-hover:shadow-blue-500/25"
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
                                <button className="px-8 py-3.5 bg-white text-[#181C25] font-extrabold rounded-lg hover:bg-gray-100 transition text-[15px] shadow-xl shadow-white/10 flex items-center gap-2">
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
                        <div>
                            <h2 className="text-[28px] font-extrabold text-gray-900 border-l-4 border-[#6C5DD3] pl-4">See What Our Students Says</h2>
                            <p className="text-gray-500 font-medium ml-5 mt-1">Real experience from our graduates</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={prevTestimonial} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-600 hover:bg-[#6C5DD3] hover:text-white hover:border-[#6C5DD3] transition-all shadow-sm group md:hidden">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            </button>
                            <button onClick={nextTestimonial} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-600 hover:bg-[#6C5DD3] hover:text-white hover:border-[#6C5DD3] transition-all shadow-sm group md:hidden">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6 6-6" transform="rotate(180 12 12)" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="flex flex-nowrap md:grid md:grid-cols-4 transition-transform duration-500 ease-out gap-6" style={{ transform: typeof window !== 'undefined' && window.innerWidth < 768 ? `translateX(-${testimonialIndex * 100}%)` : 'none' }}>
                            {testimonials.length > 0 ? testimonials.slice(0, 4).map((t, i) => (
                                <div 
                                    key={i} 
                                    className="flex-shrink-0 w-full md:w-auto flex flex-col h-full group/card cursor-pointer"
                                    onClick={() => {
                                        if (t.videoUrl) {
                                            setActiveVideo({ url: t.videoUrl, name: t.studentName, course: t.courseName });
                                            setIsVideoModalOpen(true);
                                        }
                                    }}
                                >
                                    {/* Video Thumbnail Card - Vertical 9:16 */}
                                    <div className="relative rounded-2xl overflow-hidden aspect-[9/16] shadow-2xl mb-6 flex-shrink-0 border border-gray-100 group-hover/card:shadow-[#6C5DD3]/20 transition-all duration-500">
                                        <img src={t.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"} className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110" alt={t.studentName} />
                                        
                                        {/* Premium Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1117] via-transparent to-[#0F1117]/40 flex flex-col justify-between p-6">
                                            <div className="flex justify-between items-start">
                                                <div className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-[9px] text-white font-black uppercase tracking-widest opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                                                    Success Story
                                                </div>
                                            </div>

                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-[#6C5DD3] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(108,93,211,0.5)] transform scale-90 group-hover/card:scale-100 transition-transform duration-500">
                                                    <Play fill="white" className="text-white ml-1" size={28} />
                                                </div>
                                            </div>

                                            <div className="relative z-10 space-y-2 translate-y-2 group-hover/card:translate-y-0 transition-transform duration-500">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl border-2 border-white/30 overflow-hidden shadow-lg shrink-0">
                                                        <img src={t.avatar || `https://ui-avatars.com/api/?name=${t.studentName}&background=random`} className="w-full h-full object-cover" alt="avatar" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-white text-sm font-black leading-tight truncate">{t.studentName}</p>
                                                        <p className="text-white/70 text-[10px] font-bold truncate uppercase">{t.courseName}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text Review Card */}
                                    <div className={`flex-1 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-all duration-500 group-hover/card:-translate-y-2 ${i % 2 === 0 ? 'bg-[#1e2a27] border border-[#2a443b]' : 'bg-[#1c222c] border border-[#2d3846]'} text-white`}>
                                        <div className="relative">
                                            <svg className={`absolute -top-3 -left-2 w-10 h-10 opacity-20 ${i % 2 === 0 ? 'text-[#386252]' : 'text-[#3d4b60]'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.899 14.899 16 16 16L18 16L18 14L15 14C13.899 14 13 13.101 13 12L13 10C13 8.899 13.899 8 15 8L18 8C19.101 8 20 8.899 20 10L20 18C20 19.657 18.657 21 17 21L14.017 21ZM4 21L4 18C4 16.899 4.899 16 6 16L8 16L8 14L5 14C3.899 14 3 13.101 3 12L3 10C3 8.899 3.899 8 5 8L8 8C9.101 8 10 8.899 10 10L10 18C10 19.657 8.657 21 7 21L4 21Z" /></svg>
                                            <p className="text-sm text-gray-200 leading-[1.7] font-medium italic pl-4 relative z-10">
                                                {t.textFeedback || "The curriculum is exactly what the industry demands. This course was truly a game changer for my career path!"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest bg-white rounded-2xl border-2 border-dashed border-gray-100 w-full">
                                    No testimonials available.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Video Modal */}
                    <TestimonialVideoModal
                        isOpen={isVideoModalOpen}
                        onClose={() => setIsVideoModalOpen(false)}
                        videoUrl={activeVideo.url}
                        studentName={activeVideo.name}
                        courseName={activeVideo.course}
                    />
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
