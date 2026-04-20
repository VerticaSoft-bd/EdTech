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
                                                <Trophy size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase">Task Score</p>
                                                <p className="text-lg font-bold text-[#1A1D1F]">
                                                    {data.tasks?.reduce((sum: number, t: any) => sum + (t.submission?.pointsEarned || 0), 0) || 0}
                                                    <span className="text-xs text-gray-400 ml-1">Pts Earned</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-white/50 rounded-2xl p-4">
                                            <p className="text-xs text-gray-500 leading-relaxed italic">
                                                {data.tasks?.filter((t: any) => t.submission?.status === 'Graded').length || 0} of {data.tasks?.length || 0} tasks evaluated.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                         {/* Course Content & Tasks Tabs */}
                         <div className="space-y-6">
                            <div className="flex items-center gap-6 border-b border-gray-100 px-2">
                                <button className="pb-4 text-sm font-bold text-[#6C5DD3] border-b-2 border-[#6C5DD3] transition-all flex items-center gap-2">
                                    <Target size={16} />
                                    Tasks & Projects
                                </button>
                                <button className="pb-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition-all flex items-center gap-2">
                                    <Layout size={16} />
                                    Curriculum
                                </button>
                            </div>

                            <div className="grid gap-4">
                                {data.tasks && data.tasks.length > 0 ? (
                                    data.tasks.map((task: any) => (
                                        <div key={task._id} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all group">
                                            <div className="flex items-center gap-5 flex-1 min-w-0">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                                                    task.type === 'MCQ' ? 'bg-blue-50 text-blue-500' :
                                                    task.type === 'Project' ? 'bg-purple-50 text-purple-500' :
                                                    'bg-orange-50 text-orange-500'
                                                }`}>
                                                    {task.type === 'MCQ' ? <CheckCircle size={24} /> : task.type === 'Project' ? <Layout size={24} /> : <FileText size={24} />}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#6C5DD3] bg-[#6C5DD3]/5 px-2 py-0.5 rounded">{task.type}</span>
                                                        {task.deadline && (
                                                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                                <Clock size={10} />
                                                                Due: {format(new Date(task.deadline), 'MMM dd')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="font-bold text-[#1A1D1F] text-lg truncate group-hover:text-[#6C5DD3] transition-colors">{task.title}</h4>
                                                    <p className="text-xs text-gray-500 line-clamp-1 mt-1">{task.description}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8 px-4 border-l border-gray-50 md:border-l md:pl-8">
                                                <div className="text-center min-w-[60px]">
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Score</p>
                                                    <p className="text-lg font-black text-[#1A1D1F]">
                                                        {task.submission?.pointsEarned !== undefined ? task.submission.pointsEarned : '--'}
                                                        <span className="text-xs text-gray-300 font-bold ml-0.5">/{task.points}</span>
                                                    </p>
                                                </div>

                                                <div className="text-center min-w-[80px]">
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Status</p>
                                                    {task.submission ? (
                                                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-tight ${
                                                            task.submission.status === 'Graded' ? 'bg-[#4BD37B]/10 text-[#4BD37B]' : 
                                                            'bg-amber-100 text-amber-600'
                                                        }`}>
                                                            {task.submission.status === 'Graded' ? 'Completed' : 'Pending'}
                                                        </span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-tight">Not Started</span>
                                                    )}
                                                </div>

                                                <Link 
                                                    href={`/student-dashboard/tasks/${task._id}/submit`}
                                                    className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                                                        task.submission?.status === 'Graded' 
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                        : 'bg-[#1A1D1F] text-white shadow-xl shadow-gray-200 hover:-translate-y-0.5'
                                                    }`}
                                                >
                                                    {task.submission ? 'View submission' : 'Start Task'}
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-gray-50/50 py-16 rounded-3xl border border-dashed border-gray-200 text-center">
                                        <Trophy size={40} className="mx-auto text-gray-200 mb-4" />
                                        <h4 className="font-bold text-[#1A1D1F]">No tasks found for this course</h4>
                                        <p className="text-sm text-gray-400 mt-1">Your teacher hasn't assigned any tasks yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Attendance Tracker */}
                    <div className="col-span-12 lg:col-span-4">
                        <section className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/20 border border-white/60 sticky top-28">
                            <h3 className="text-xl font-bold text-[#1A1D1F] mb-8 flex items-center justify-between">
                                Attendance Log
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">Record</span>
                            </h3>

                            <div className="space-y-6">
                                {attendanceHistory.length > 0 ? (
                                    attendanceHistory.map((record: any) => (
                                        <div key={record._id} className="relative group">
                                            {/* Step Connector */}
                                            <div className="absolute left-[19px] top-10 bottom-[-10px] w-0.5 bg-gray-50 last:hidden"></div>

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
                                                        <p className="text-sm font-bold text-[#1A1D1F]">{format(new Date(record.date), 'MMM dd, yyyy')}</p>
                                                        <span className={`text-[9px] font-black uppercase tracking-tight py-1 px-2 rounded-lg ${
                                                            record.status === 'Present' ? 'bg-green-100 text-green-700' :
                                                            record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                                                            'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            {record.status}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center">
                                                            <UserIcon size={10} className="text-gray-400" />
                                                        </div>
                                                        <p className="text-[9px] text-gray-400 font-medium">
                                                            By <span className="font-bold text-[#6C5DD3]">{record.markedBy?.name || 'Office'}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 px-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                        <Calendar size={32} className="mx-auto text-gray-200 mb-4" />
                                        <p className="text-xs text-gray-400 font-medium font-italic">No classes marked yet.</p>
                                    </div>
                                )}
                            </div>

                            {/* Attendance Legend */}
                            {attendanceHistory.length > 0 && (
                                <div className="mt-10 pt-8 border-t border-gray-50 grid grid-cols-3 gap-2">
                                    <div className="text-center">
                                        <div className="text-lg font-black text-[#4BD37B]">
                                            {attendanceHistory.filter((r:any) => r.status === 'Present').length}
                                        </div>
                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Present</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-black text-[#FF4C4C]">
                                            {attendanceHistory.filter((r:any) => r.status === 'Absent').length}
                                        </div>
                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Absent</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-black text-[#FFAB7B]">
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
