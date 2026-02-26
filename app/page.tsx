"use client";

import React, { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import HeroCarousel from "@/app/components/HeroCarousel";
import SeminarModal from "@/app/components/SeminarModal";

// Mock Data
const UPCOMING_BATCHES = [
    { title: "Full Stack Web Development with MERN", instructor: "Jhankar Mahbub", tag: "Batch 10", img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400&auto=format&fit=crop" },
    { title: "UI/UX Design Career Track Program", instructor: "Hasin Hayder", tag: "Batch 8", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=400&auto=format&fit=crop" },
    { title: "Digital Marketing & SEO Masterclass", instructor: "Rabbil Hasan", tag: "Batch 12", img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=400&auto=format&fit=crop" },
    { title: "Data Analytics with Python & SQL", instructor: "Anisul Islam", tag: "Batch 5", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop" }
];

const FREE_CLASSES = [
    { title: "AI Automation with Python", subtitle: "Workshop", color: "from-blue-500 to-indigo-500" },
    { title: "JavaScript (MERN) & AI", subtitle: "Crash Course", color: "from-yellow-400 to-orange-500" },
    { title: "SQA Manual & Automated Testing", subtitle: "Bootcamp", color: "from-emerald-400 to-teal-500" },
    { title: "AI Engineering Bootcamp", subtitle: "Masterclass", color: "from-blue-400 to-cyan-400" },
    { title: "Python, Django, React & AI", subtitle: "Workshop", color: "from-indigo-400 to-purple-500" },
    { title: "Flutter & AI iOS/Android", subtitle: "Seminar", color: "from-sky-400 to-blue-500" },
    { title: "Digital Marketing Strategy", subtitle: "Bootcamp", color: "from-amber-400 to-yellow-500" },
    { title: "UI/UX Design Foundations", subtitle: "Workshop", color: "from-rose-400 to-pink-500" }
];

const TESTIMONIALS = [
    { name: "Fatema Tuz Zohra", role: "Web Developer", videoImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" },
    { name: "Rafia Khatun", role: "UI/UX Designer", videoImg: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop" },
    { name: "Sumaiya Akter", role: "Digital Marketer", videoImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop" },
    { name: "Tariqul Islam", role: "Full Stack Dev", videoImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop" }
];

export default function RootPage() {
    const [isSeminarModalOpen, setIsSeminarModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1A1D1F] flex flex-col">
            <Header />

            <main className="flex-1 flex flex-col items-center w-full max-w-[1300px] mx-auto px-4 sm:px-6 py-8 md:py-12 gap-16">

                {/* Hero Section */}
                <HeroCarousel onOpenModal={() => setIsSeminarModalOpen(true)} />

                <SeminarModal
                    isOpen={isSeminarModalOpen}
                    onClose={() => setIsSeminarModalOpen(false)}
                />

                {/* Category Flow Tabs - Centered Below Hero */}
                <div className="flex justify-center w-full relative z-20 mt-8 lg:mt-12 px-4 pb-8">
                    <div className="bg-white rounded-[24px] p-2 shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-wrap items-center justify-center gap-1 max-w-fit mx-auto backdrop-blur-sm">

                        {["Live Courses", "Recorded Classes", "Offline Campus"].map((item, idx) => (
                            <button
                                key={item}
                                className={`px-6 py-3 text-[13px] font-black rounded-xl transition-all relative group flex items-center gap-3 overflow-hidden ${idx === 0
                                        ? "text-[#6C5DD3]"
                                        : "text-gray-500 hover:text-[#1A1D1F]"
                                    }`}
                            >
                                {/* Magnetic Glow Background */}
                                <div className="absolute inset-0 bg-[#6C5DD3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[#6C5DD3]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>

                                {/* Icon based on index */}
                                <div className="relative z-10 transition-transform group-hover:scale-110 duration-300">
                                    {idx === 0 && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>}
                                    {idx === 1 && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>}
                                    {idx === 2 && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>}
                                </div>

                                <span className="relative z-10 uppercase tracking-widest">{item}</span>

                                {/* AI Indicator */}
                                {idx === 0 ? (
                                    <div className="relative z-10 flex gap-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#6C5DD3] animate-pulse"></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#6C5DD3]/40"></span>
                                    </div>
                                ) : (
                                    <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#6C5DD3]/30 transition-colors"></div>
                                )}

                                {/* Bottom Energy Bar */}
                                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-[#6C5DD3] rounded-full transition-all duration-300 ${idx === 0 ? 'w-6' : 'w-0 group-hover:w-4 opacity-50'}`}></span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Upcoming Live Batches */}
                <section className="w-full pt-4">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h2 className="text-[28px] font-bold flex items-center gap-3 text-gray-900">
                            <span className="w-5 h-2 bg-[#EF4444] rounded-full inline-block"></span>
                            Upcoming Live Batches
                        </h2>
                        <div className="flex flex-wrap items-center gap-2">
                            <button className="px-5 py-2 bg-[#4A72FF] text-white text-sm font-semibold rounded-full shadow-sm">All</button>
                            <button className="px-5 py-2 bg-white text-gray-600 text-sm font-semibold rounded-full border border-gray-200 hover:bg-gray-50 transition">Data & AI</button>
                            <button className="px-5 py-2 bg-white text-gray-600 text-sm font-semibold rounded-full border border-gray-200 hover:bg-gray-50 transition">Design</button>
                            <button className="px-5 py-2 bg-white text-gray-600 text-sm font-semibold rounded-full border border-gray-200 hover:bg-gray-50 transition">Marketing</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {UPCOMING_BATCHES.map((course, i) => (
                            <div key={i} className="border border-gray-200 rounded-[20px] overflow-hidden bg-white flex flex-col group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
                                <div className="relative h-[180px] bg-gray-100 overflow-hidden">
                                    <img src={course.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-3 left-3 bg-[#EF4444] flex items-center gap-1.5 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider shadow-sm">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                        Live
                                    </div>
                                    <span className="absolute top-3 right-3 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-md backdrop-blur-md font-medium">
                                        {course.tag}
                                    </span>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-gray-900 text-[17px] leading-[1.3] mb-5 group-hover:text-[#1A62FF] transition-colors">{course.title}</h3>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2.5">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-9 h-9 rounded-full bg-gray-200 object-cover border border-gray-200" alt={course.instructor} />
                                            <div className="flex flex-col">
                                                <span className="text-[11px] text-gray-500 font-medium tracking-wide uppercase">Instructor</span>
                                                <span className="text-[13px] font-bold text-gray-900">{course.instructor}</span>
                                            </div>
                                        </div>
                                        <button className="w-9 h-9 flex items-center justify-center bg-blue-50 text-[#1A62FF] rounded-xl hover:bg-blue-100 transition group-hover:translate-x-1">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-10">
                        <button className="px-7 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition text-[15px] flex items-center gap-2 bg-white">
                            Load More Courses
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="m6 9 6 6 6-6" /></svg>
                        </button>
                    </div>
                </section>

                {/* Free Classes (Dark Theme) */}
                <section className="w-full bg-[#181C25] rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden mt-6">
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

                        <div className="flex flex-wrap justify-center items-center gap-3 mb-10 w-full max-w-4xl mx-auto border-b border-gray-800 pb-8">
                            <button className="px-6 py-2.5 bg-white text-[#181C25] rounded-full text-[14px] font-extrabold shadow-lg">All Types</button>
                            <button className="px-6 py-2.5 bg-[#252A36] text-gray-300 border border-gray-700/50 rounded-full text-[14px] font-semibold hover:text-white hover:bg-[#2C3240] transition">Data & AI</button>
                            <button className="px-6 py-2.5 bg-[#252A36] text-gray-300 border border-gray-700/50 rounded-full text-[14px] font-semibold hover:text-white hover:bg-[#2C3240] transition">Web Development</button>
                            <button className="px-6 py-2.5 bg-[#252A36] text-gray-300 border border-gray-700/50 rounded-full text-[14px] font-semibold hover:text-white hover:bg-[#2C3240] transition">Design & Multimedia</button>
                            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#181C25] shadow-lg hover:bg-gray-100 transition ml-2 shrink-0">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {FREE_CLASSES.map((cls, i) => (
                                <div key={i} className="group border border-gray-700/50 rounded-[20px] overflow-hidden bg-[#1E232F] flex flex-col p-4 shadow-xl hover:-translate-y-1 transition-transform duration-300 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                    <div className="relative h-[130px] rounded-2xl overflow-hidden mb-5 bg-[#141820] border border-gray-700/30 flex items-center justify-center group-hover:border-gray-600/50 transition-colors">
                                        <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${cls.color} blur-[30px]`}></div>
                                        <div className="text-center relative z-10 px-4">
                                            <h4 className={`text-xl font-black text-transparent bg-clip-text bg-gradient-to-r ${cls.color} leading-tight drop-shadow-md`}>{cls.title}</h4>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-2 font-bold">{cls.subtitle}</p>
                                        </div>
                                        <span className="absolute top-2.5 left-2.5 bg-[#EF4444] text-white text-[9px] px-2 py-0.5 rounded uppercase font-black tracking-wider shadow-sm flex items-center gap-1">
                                            <span className="w-1 h-1 bg-white rounded-full"></span> LIVE
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col relative z-10">
                                        <p className="text-[11px] text-gray-400 mb-2 font-medium flex items-center gap-1.5">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                            Today • 9:00 PM
                                        </p>
                                        <h3 className="font-bold text-white leading-snug text-[15px] mb-5">Masterclass on {cls.title.split(' ')[0]} Technology & Career.</h3>
                                        <button className="mt-auto w-full py-2.5 flex items-center justify-center gap-2 bg-white/5 text-white font-bold text-sm rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition group-hover:bg-[#4A72FF] group-hover:border-[#4A72FF] group-hover:shadow-lg group-hover:shadow-blue-500/25">
                                            Enroll Now
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-12">
                            <button className="px-8 py-3.5 bg-white text-[#181C25] font-extrabold rounded-xl hover:bg-gray-100 transition text-[15px] shadow-xl shadow-white/10 flex items-center gap-2">
                                Explore All Free Classes
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                        </div>
                    </div>
                </section>

                {/* What You Will Get */}
                <section className="w-full py-16">
                    <div className="text-center mb-10">
                        <h2 className="text-[28px] font-extrabold text-gray-900">What You Will Get</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-b border-gray-200 py-10">
                        {[
                            { title: "১০০% জব প্লেসমেন্ট গাইডেন্স", icon: "💼", color: "text-amber-600", bg: "bg-amber-50" },
                            { title: "ইন্টারেক্টিভ লাইভ সেশন", icon: "💻", color: "text-blue-600", bg: "bg-blue-50" },
                            { title: "ইন্ডাস্ট্রি এক্সপার্টদের মেন্টরশিপ", icon: "👨‍🏫", color: "text-emerald-600", bg: "bg-emerald-50" },
                            { title: "কোর্স সমাপ্তিতে সার্টিফিকেট", icon: "🎓", color: "text-purple-600", bg: "bg-purple-50" }
                        ].map((f, i) => (
                            <div key={i} className="flex flex-col items-center text-center gap-4 group">
                                <div className={`w-16 h-16 rounded-[20px] ${f.bg} flex items-center justify-center text-[28px] shadow-sm transform group-hover:-translate-y-2 transition-transform duration-300`}>
                                    <span className={f.color}>{f.icon}</span>
                                </div>
                                <p className="font-bold text-gray-800 text-[14px] max-w-[140px] leading-snug">{f.title}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Testimonials */}
                <section className="w-full pb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-[28px] font-extrabold text-gray-900">See What Our Students Says</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className="flex flex-col h-full group/card cursor-pointer">
                                {/* Video Thumbnail Card */}
                                <div className="relative rounded-[24px] overflow-hidden aspect-[4/5] shadow-md mb-4 flex-shrink-0">
                                    <img src={t.videoImg} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" alt={t.name} />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#182a26]/90 via-black/20 to-transparent flex flex-col justify-between p-5">
                                        <div className="flex justify-end">
                                        </div>

                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <button className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center pointer-events-auto border border-white/40 shadow-xl group-hover/card:bg-white text-white group-hover/card:text-[#182a26] transition-colors duration-300">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3 mt-auto relative z-10 translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
                                            <div className="w-10 h-10 rounded-[12px] border-2 border-white/80 overflow-hidden shadow-md">
                                                <img src={`https://i.pravatar.cc/100?img=${i + 15}`} className="w-full h-full object-cover" alt="avatar" />
                                            </div>
                                            <div>
                                                <p className="text-white text-[13px] font-extrabold leading-tight">{t.name}</p>
                                                <p className="text-white/80 text-[11px] font-bold">{t.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Text Review Card */}
                                <div className={`flex-1 rounded-[20px] p-5 flex flex-col justify-between ${i % 2 === 0 ? 'bg-[#1e2a27] border border-[#2a443b]' : 'bg-[#1c222c] border border-[#2d3846]'} text-white shadow-lg transition-transform duration-300 group-hover/card:-translate-y-1`}>
                                    <p className="text-[12px] text-gray-300 leading-[1.6] mb-5 font-medium relative z-10 italic">
                                        <span className={`text-[40px] ${i % 2 === 0 ? 'text-[#386252]' : 'text-[#3d4b60]'} absolute -top-5 -left-1 font-serif -z-10`}>"</span>
                                        The curriculum is exactly what the industry demands. The mentors went out of their way to ensure we understood every complex topic. Truly a game changer for my career path!
                                    </p>
                                    <div className="flex items-center gap-2.5 mt-auto pt-4 border-t border-white/10">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 25}`} className="w-7 h-7 rounded-[8px] object-cover" />
                                        <div className="flex flex-col">
                                            <p className="text-[12px] font-bold text-white leading-none">{t.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
