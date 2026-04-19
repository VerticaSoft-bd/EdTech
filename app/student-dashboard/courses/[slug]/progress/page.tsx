"use client";

import React, { useEffect, useState, use } from "react";
import Header from "@/app/components/Header";
import { format } from "date-fns";
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    ArrowLeft, 
    PlayCircle, 
    BookOpen, 
    Trophy,
    User as UserIcon,
    Calendar,
    Target
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CourseProgressPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/student-progress/${slug}`);
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                } else {
                    setError(json.message);
                }
            } catch (err) {
                setError("Failed to fetch progress details");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6C5DD3]"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                    <XCircle size={40} />
                </div>
                <h1 className="text-2xl font-bold text-[#1A1D1F] mb-2">Oops! Something went wrong</h1>
                <p className="text-gray-500 mb-8 max-w-md">{error || "We couldn't find the progress details for this course."}</p>
                <Link 
                    href="/student-dashboard" 
                    className="px-8 py-3 bg-[#6C5DD3] text-white rounded-2xl font-bold shadow-lg hover:bg-[#5a4cb5] transition-all flex items-center gap-2"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const { course, student, attendanceHistory } = data;
    const progress = student.progress || 0;
    const isOffline = student.courseMode === 'Offline';

    return (
        <div className="min-h-screen bg-[#FDFCFD] text-[#1A1D1F]">
            <Header />

            <main className="max-w-[1600px] mx-auto p-6 md:p-10">
                {/* Breadcrumb & Header */}
                <div className="mb-10">
                    <button 
                        onClick={() => router.back()} 
                        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#6C5DD3] transition-colors mb-4 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </button>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-extrabold text-[#1A1D1F] leading-tight mb-2">
                                {course.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-full shadow-sm">
                                    <BookOpen size={14} className="text-[#FFAB7B]" />
                                    {isOffline ? `${student.totalClasses} Classes` : `${student.totalClasses} Modules`}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-full shadow-sm">
                                    <Clock size={14} className="text-[#FF9AD5]" />
                                    {course.duration || "Self-paced"}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-14 w-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[#6C5DD3]/5 group-hover:bg-[#6C5DD3]/10 transition-colors"></div>
                                <Trophy size={24} className="text-[#6C5DD3] relative z-10" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Current Score</p>
                                <p className="text-xl font-black text-[#1A1D1F]">{progress}% Complete</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Left Column: Progress Content */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        {/* Progress Visualizer */}
                        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/40 border border-white/60 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#6C5DD3]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                            
                            <h3 className="text-2xl font-bold text-[#1A1D1F] mb-8 flex items-center gap-3">
                                <Target className="text-[#6C5DD3]" />
                                Your Progress Journey
                            </h3>

                            <div className="space-y-10 relative z-10">
                                <div>
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-400 mb-1">Overall Completion</p>
                                            <p className="text-3xl font-black text-[#1A1D1F]">{progress}%</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-[#6C5DD3] bg-[#6C5DD3]/10 px-3 py-1 rounded-full">{isOffline ? 'Offline Mode' : 'Online Mode'}</p>
                                        </div>
                                    </div>
                                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden p-1">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#6C5DD3] via-[#8E8AFF] to-[#B4B1FF] rounded-full transition-all duration-1000 shadow-lg shadow-[#6C5DD3]/20"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-[#F8F9FE] p-6 rounded-2xl border border-[#EEEEFF]">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#6C5DD3]">
                                                <BookOpen size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 capitalize">{isOffline ? 'Attendance' : 'Materials'}</p>
                                                <p className="text-lg font-bold text-[#1A1D1F]">{student.attendedClasses} / {student.totalClasses} {isOffline ? 'Classes' : 'Modules'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white/50 rounded-2xl p-4">
                                            <p className="text-xs text-gray-500 leading-relaxed italic">
                                                {isOffline 
                                                    ? "Regular attendance is key to mastering these concepts. Keep showing up!" 
                                                    : "Every module completed brings you closer to your certification."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-[#FFF9F5] p-6 rounded-2xl border border-[#FFEEE0]">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#FFAB7B]">
                                                <Calendar size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
                                                <p className="text-lg font-bold text-[#1A1D1F]">{progress >= 100 ? 'Course Completed' : 'In Progress'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white/50 rounded-2xl p-4">
                                            <p className="text-xs text-gray-500 leading-relaxed italic">
                                                Last activity recorded on {format(new Date(student.updatedAt || new Date()), 'MMM dd, yyyy')}.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                         {/* Course Modules List (Visual Placeholder/Detail) */}
                         <div className="space-y-4">
                            <h3 className="text-xl font-bold text-[#1A1D1F] flex items-center gap-2 px-2">
                                {isOffline ? 'Curriculum Preview' : 'Learning Pathway'}
                            </h3>
                            <div className="grid gap-3">
                                {course.modules?.slice(0, isOffline ? 4 : 8).map((module: any, idx: number) => (
                                    <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-[#6C5DD3] group-hover:text-white transition-all">
                                                {String(idx + 1).padStart(2, '0')}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#1A1D1F] group-hover:text-[#6C5DD3] transition-colors">{module.title || `Module ${idx + 1}`}</h4>
                                                <p className="text-[11px] text-gray-400 font-medium">Estimated Time: {module.duration || '45 mins'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {idx < student.attendedClasses ? (
                                                <CheckCircle size={20} className="text-[#4BD37B]" />
                                            ) : (
                                                <PlayCircle size={20} className="text-gray-300" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {course.modules?.length > 8 && (
                                    <div className="text-center py-4 text-sm font-bold text-[#6C5DD3] opacity-60">
                                        + {course.modules.length - 8} more modules in this course
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Attendance Tracker */}
                    <div className="col-span-12 lg:col-span-4">
                        <section className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/20 border border-white/60 sticky top-28">
                            <h3 className="text-xl font-bold text-[#1A1D1F] mb-8 flex items-center justify-between">
                                Attendance Log
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">Historical View</span>
                            </h3>

                            <div className="space-y-5">
                                {attendanceHistory.length > 0 ? (
                                    attendanceHistory.map((record: any) => (
                                        <div key={record._id} className="relative group">
                                            {/* Step Connector */}
                                            <div className="absolute left-[19px] top-10 bottom-[-10px] w-0.5 bg-gray-100 last:hidden"></div>

                                            <div className="flex gap-4">
                                                <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center relative z-10 transition-all ${
                                                    record.status === 'Present' ? 'bg-green-50 text-green-600' :
                                                    record.status === 'Absent' ? 'bg-red-50 text-red-600' :
                                                    'bg-amber-50 text-amber-600'
                                                }`}>
                                                    {record.status === 'Present' ? <CheckCircle size={18} /> :
                                                     record.status === 'Absent' ? <XCircle size={18} /> :
                                                     <Clock size={18} />}
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className="text-sm font-bold text-[#1A1D1F]">{format(new Date(record.date), 'MMMM dd, yyyy')}</p>
                                                        <span className={`text-[10px] font-black uppercase tracking-tight py-1 px-2 rounded-lg ${
                                                            record.status === 'Present' ? 'bg-green-100 text-green-700' :
                                                            record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                                                            'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            {record.status}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Teacher Attribution (The "Teacher kon mark dilo" part) */}
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                                            <UserIcon size={10} className="text-gray-500" />
                                                        </div>
                                                        <p className="text-[10px] text-gray-500 font-medium">
                                                            Marked by <span className="font-bold text-[#6C5DD3]">{record.markedBy?.name || 'Academic Office'}</span>
                                                            {record.markedBy?.role && <span className="ml-1 text-gray-300">({record.markedBy.role})</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 px-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                        <Calendar size={32} className="mx-auto text-gray-300 mb-4" />
                                        <p className="text-sm text-gray-400 font-medium font-italic">No classes marked yet for this course.</p>
                                    </div>
                                )}
                            </div>

                            {/* Attendance Legend */}
                            {attendanceHistory.length > 0 && (
                                <div className="mt-10 pt-8 border-t border-gray-50 grid grid-cols-3 gap-2">
                                    <div className="text-center">
                                        <div className="text-[14px] font-black text-[#4BD37B]">
                                            {attendanceHistory.filter((r:any) => r.status === 'Present').length}
                                        </div>
                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Present</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[14px] font-black text-[#FF4C4C]">
                                            {attendanceHistory.filter((r:any) => r.status === 'Absent').length}
                                        </div>
                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Absent</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[14px] font-black text-[#FFAB7B]">
                                            {attendanceHistory.filter((r:any) => r.status === 'Late').length}
                                        </div>
                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Late</div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
