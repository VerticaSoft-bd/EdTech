"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
    ArrowLeft, 
    User, 
    ExternalLink, 
    CheckCircle, 
    Clock, 
    AlertCircle,
    Send,
    Award,
    MessageSquare,
    Search,
    Filter,
    Layout
} from 'lucide-react';
import { format } from 'date-fns';
import { showToast } from "@/lib/toast";

export default function TaskSubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: taskId } = use(params);
    const router = useRouter();
    const [task, setTask] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    
    // Grading state
    const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
    const [gradeData, setGradeData] = useState({ points: 0, feedback: '' });

    useEffect(() => {
        fetchData();
    }, [taskId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [taskRes, subsRes] = await Promise.all([
                fetch(`/api/tasks/${taskId}`),
                fetch(`/api/tasks/${taskId}/submissions`)
            ]);

            const taskData = await taskRes.json();
            const subsData = await subsRes.json();

            if (taskData.success) {
                setTask(taskData.data);
                setGradeData(prev => ({ ...prev, points: taskData.data.points }));
            }
            if (subsData.success) setSubmissions(subsData.data);
        } catch (error) {
            showToast.error("Failed to load submission data");
        } finally {
            setLoading(false);
        }
    };

    const handleGrade = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gradingSubmissionId) return;

        const loadingToast = showToast.loading("Saving grade...");
        try {
            const res = await fetch(`/api/tasks/submissions/${gradingSubmissionId}/grade`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gradeData)
            });

            const data = await res.json();
            showToast.dismiss(loadingToast);

            if (data.success) {
                showToast.success("Grade saved successfully");
                setSubmissions(submissions.map(s => s._id === gradingSubmissionId ? data.data : s));
                setGradingSubmissionId(null);
                setGradeData({ points: task.points, feedback: '' });
                fetchData(); // Refresh to get populated data if needed
            } else {
                showToast.error(data.message || "Failed to save grade");
            }
        } catch (error) {
            showToast.dismiss(loadingToast);
            showToast.error("An error occurred");
        }
    };

    const startGrading = (sub: any) => {
        setGradingSubmissionId(sub._id);
        setGradeData({ 
            points: sub.pointsEarned || task.points, 
            feedback: sub.feedback || '' 
        });
    };

    const filteredSubmissions = submissions.filter(sub => {
        const matchesSearch = sub.studentId?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             sub.studentId?.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || sub.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6C5DD3]"></div>
            </div>
        );
    }

    if (!task) return <div>Task not found</div>;

    return (
        <div className="max-w-[1400px] mx-auto pb-20">
            {/* Header */}
            <div className="mb-8">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#6C5DD3] transition-all mb-4 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Tasks
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-[#6C5DD3]/10 text-[#6C5DD3] text-[10px] font-bold rounded-full uppercase tracking-widest">Submissions Pool</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm font-medium text-gray-500">{task.courseId?.title}</span>
                        </div>
                        <h1 className="text-3xl font-black text-[#1A1D1F]">{task.title}</h1>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-8">
                        <div className="text-center border-r border-gray-50 pr-8">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total Points</p>
                            <p className="text-xl font-black text-[#1A1D1F]">{task.points}</p>
                        </div>
                        <div className="text-center pr-8 border-r border-gray-50">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Submissions</p>
                            <p className="text-xl font-black text-[#6C5DD3]">{submissions.length}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Graded</p>
                            <p className="text-xl font-black text-[#4BD37B]">{submissions.filter(s => s.status === 'Graded').length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Main List */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    {/* Filters Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
                        <div className="relative flex-1 min-w-[240px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by student name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all font-medium"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                             <Filter size={16} className="text-gray-400" />
                             <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="pl-3 pr-8 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold text-[#1A1D1F] focus:ring-2 focus:ring-[#6C5DD3]/20 cursor-pointer"
                            >
                                <option value="All">All Status</option>
                                <option value="Submitted">Pending</option>
                                <option value="Graded">Graded</option>
                                <option value="Late">Late</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {filteredSubmissions.length > 0 ? (
                            filteredSubmissions.map((sub) => (
                                <div 
                                    key={sub._id} 
                                    className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group ${gradingSubmissionId === sub._id ? 'ring-2 ring-[#6C5DD3] border-transparent' : ''}`}
                                    onClick={() => startGrading(sub)}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                                                <img 
                                                    src={sub.studentId?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.studentId?.name || 'Student')}&background=random`} 
                                                    alt={sub.studentId?.name} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-[#1A1D1F] truncate group-hover:text-[#6C5DD3] transition-colors">{sub.studentId?.name}</h3>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase truncate">{sub.studentId?.email}</span>
                                                    <span className="text-[10px] text-gray-300 font-bold">•</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{format(new Date(sub.submittedAt), 'MMM dd, HH:mm')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 pr-4">
                                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${
                                                sub.status === 'Graded' ? 'bg-[#4BD37B]/10 text-[#4BD37B]' :
                                                sub.status === 'Late' ? 'bg-[#FF4C4C]/10 text-[#FF4C4C]' :
                                                'bg-amber-100 text-amber-600'
                                            }`}>
                                                {sub.status === 'Graded' ? <CheckCircle size={14} /> : sub.status === 'Late' ? <AlertCircle size={14} /> : <Clock size={14} />}
                                                <span className="text-[10px] font-black uppercase tracking-wider">{sub.status}</span>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Score</p>
                                                <p className="text-lg font-black text-[#1A1D1F]">
                                                    {sub.pointsEarned !== undefined ? sub.pointsEarned : '--'}<span className="text-gray-300 text-sm font-bold">/{task.points}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-gray-50/50 py-20 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-300 mb-4">
                                    <User size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-[#1A1D1F]">No submissions match the filter</h3>
                                <p className="text-sm text-gray-500 max-w-xs">Try adjusting your search or filters to see student work.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grading Panel */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="sticky top-28 space-y-6">
                        {gradingSubmissionId ? (
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-[#6C5DD3]/5 animate-in slide-in-from-right-4 duration-300">
                                <h2 className="text-xl font-black text-[#1A1D1F] mb-6 flex items-center gap-3">
                                    <Award size={24} className="text-[#6C5DD3]" />
                                    Review Submission
                                </h2>

                                <div className="space-y-8">
                                    {/* Submission Content Review */}
                                    <div className="pb-8 border-b border-gray-50">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Student's Work</p>
                                        
                                        {task.type === 'MCQ' ? (
                                            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                                                <p className="text-sm font-medium text-blue-700">Auto-graded MCQ Task</p>
                                                <p className="text-xs text-blue-500 mt-1">This task was graded based on correct answers provided during creation.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 min-h-[100px] text-sm text-gray-600 leading-relaxed max-h-[300px] overflow-y-auto">
                                                    {submissions.find(s => s._id === gradingSubmissionId)?.content || "No content provided."}
                                                </div>
                                                {submissions.find(s => s._id === gradingSubmissionId)?.content?.startsWith('http') && (
                                                    <a 
                                                        href={submissions.find(s => s._id === gradingSubmissionId)?.content} 
                                                        target="_blank" 
                                                        className="flex items-center justify-center gap-2 w-full py-3 bg-[#6C5DD3]/5 text-[#6C5DD3] rounded-xl text-sm font-bold hover:bg-[#6C5DD3]/10 transition-all border border-[#6C5DD3]/20"
                                                    >
                                                        <ExternalLink size={16} />
                                                        Open Reference Link
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Grading Form */}
                                    <form onSubmit={handleGrade} className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3 flex justify-between items-center">
                                                Award Points
                                                <span className="text-[#6C5DD3] bg-[#6C5DD3]/5 px-2 py-0.5 rounded">Max: {task.points}</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={gradeData.points}
                                                    onChange={(e) => setGradeData({ ...gradeData, points: parseInt(e.target.value) })}
                                                    className="w-full pl-6 pr-12 py-4 bg-gray-50 border-none rounded-2xl text-2xl font-black text-[#1A1D1F] focus:ring-4 focus:ring-[#6C5DD3]/10"
                                                    max={task.points}
                                                    min={0}
                                                    required
                                                />
                                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">pts</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Feedback for Student</label>
                                            <div className="relative">
                                                <MessageSquare size={18} className="absolute left-4 top-4 text-gray-400" />
                                                <textarea
                                                    rows={4}
                                                    value={gradeData.feedback}
                                                    onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                                                    placeholder="Write your feedback here..."
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-4 focus:ring-[#6C5DD3]/10 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-4 bg-[#6C5DD3] text-white rounded-2xl font-black text-sm shadow-xl shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Send size={18} />
                                            Release Grade
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setGradingSubmissionId(null)}
                                            className="w-full py-3 text-gray-400 font-bold text-xs hover:text-gray-600 transition-all"
                                        >
                                            Dismiss Selection
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-10 rounded-3xl border border-dashed border-gray-200 text-center">
                                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-300 mx-auto mb-6">
                                    <Award size={32} />
                                </div>
                                <h3 className="font-bold text-[#1A1D1F] mb-2">Select a Submission</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Click on a student's submission from the list to start reviewing and grading their work.</p>
                            </div>
                        )}

                        {/* Summary Widget */}
                        <div className="bg-[#1A1D1F] p-6 rounded-3xl text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C5DD3] rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50"></div>
                            <h3 className="font-bold mb-4 relative z-10 flex items-center gap-2">
                                <Layout size={16} className="text-[#6C5DD3]" />
                                Grading Progress
                            </h3>
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-gray-400 font-medium">Completion Rate</span>
                                    <span className="text-lg font-black">{submissions.length > 0 ? Math.round((submissions.filter(s => s.status === 'Graded').length / submissions.length) * 100) : 0}%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#6C5DD3] rounded-full transition-all duration-1000"
                                        style={{ width: `${submissions.length > 0 ? (submissions.filter(s => s.status === 'Graded').length / submissions.length) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest pt-2">
                                    <span>{submissions.filter(s => s.status === 'Graded').length} Completed</span>
                                    <span>{submissions.length - submissions.filter(s => s.status === 'Graded').length} Remaining</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
