"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
    ArrowLeft, 
    Send, 
    CheckCircle, 
    Layout, 
    FileText, 
    AlertCircle,
    Info,
    Clock,
    Award,
    ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { showToast } from "@/lib/toast";

export default function TaskSubmitPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: taskId } = use(params);
    const router = useRouter();
    const [task, setTask] = useState<any>(null);
    const [submission, setSubmission] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Form state
    const [content, setContent] = useState('');
    const [mcqAnswers, setMcqAnswers] = useState<number[]>([]);

    useEffect(() => {
        fetchData();
    }, [taskId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/tasks/${taskId}`);
            const data = await res.json();
            
            if (data.success) {
                setTask(data.data);
                // Initialize MCQ answers if it's an MCQ task
                if (data.data.type === 'MCQ' && data.data.mcqQuestions) {
                    setMcqAnswers(new Array(data.data.mcqQuestions.length).fill(-1));
                }
                
                // Fetch existing submission if any (this is a simple implementation, ideally we'd have a separate endpoint or it would be in the task res)
                // For now, we'll try to find it via a student-progress call or similar if needed, 
                // but usually the student-progress already has it. 
                // To keep it simple and localized, let's assume this page is for NEW submissions or VIEWING only.
            }
        } catch (error) {
            showToast.error("Failed to load task details");
        } finally {
            setLoading(false);
        }
    };

    const handleMcqSelect = (qIndex: number, optIndex: number) => {
        const newAnswers = [...mcqAnswers];
        newAnswers[qIndex] = optIndex;
        setMcqAnswers(newAnswers);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (task.type === 'MCQ' && mcqAnswers.includes(-1)) {
            showToast.error("Please answer all questions before submitting");
            return;
        }

        if (task.type !== 'MCQ' && !content.trim()) {
            showToast.error("Please provide your submission content or link");
            return;
        }

        setSubmitting(true);
        const loadingToast = showToast.loading("Submitting your work...");

        try {
            const res = await fetch(`/api/tasks/${taskId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    mcqAnswers
                })
            });

            const data = await res.json();
            showToast.dismiss(loadingToast);

            if (data.success) {
                showToast.success("Task submitted successfully!");
                router.back();
            } else {
                showToast.error(data.message || "Failed to submit task");
            }
        } catch (error) {
            showToast.dismiss(loadingToast);
            showToast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6C5DD3]"></div>
            </div>
        );
    }

    if (!task) return <div>Task not found</div>;

    const isDeadlinePassed = task.deadline && new Date() > new Date(task.deadline);

    return (
        <div className="min-h-screen bg-[#FDFCFD] pb-20">
            <div className="max-w-4xl mx-auto p-6 md:p-10">
                {/* Header */}
                <div className="mb-8">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#6C5DD3] transition-all mb-4 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Course
                    </button>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    task.type === 'MCQ' ? 'bg-blue-50 text-blue-600' :
                                    task.type === 'Project' ? 'bg-purple-50 text-purple-600' :
                                    'bg-orange-50 text-orange-600'
                                }`}>
                                    {task.type}
                                </span>
                                {isDeadlinePassed && <span className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest">Deadline Passed</span>}
                            </div>
                            <h1 className="text-3xl font-black text-[#1A1D1F] leading-tight mb-2 truncate">{task.title}</h1>
                            <p className="text-gray-500 text-sm">{task.courseId?.title}</p>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6 shrink-0">
                            <div className="text-center pr-6 border-r border-gray-50">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Max Score</p>
                                <p className="text-xl font-black text-[#1A1D1F]">{task.points}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Due Date</p>
                                <p className="text-sm font-bold text-[#1A1D1F]">{task.deadline ? format(new Date(task.deadline), 'MMM dd, HH:mm') : 'No Deadline'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
                    <h2 className="text-lg font-bold text-[#1A1D1F] mb-4 flex items-center gap-2">
                        <Info size={20} className="text-[#6C5DD3]" />
                        Guidelines & Instructions
                    </h2>
                    <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                        {task.description || "No specific instructions provided. Please submit your work according to the task requirements."}
                    </div>
                </div>

                {/* Submission Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {task.type === 'MCQ' ? (
                        <div className="space-y-8">
                            {task.mcqQuestions?.map((q: any, qIdx: number) => (
                                <div key={qIdx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-400 shrink-0">
                                            {String(qIdx + 1).padStart(2, '0')}
                                        </div>
                                        <h3 className="text-lg font-bold text-[#1A1D1F] mt-1">{q.question}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-14">
                                        {q.options.map((opt: string, optIdx: number) => (
                                            <button
                                                key={optIdx}
                                                type="button"
                                                onClick={() => handleMcqSelect(qIdx, optIdx)}
                                                className={`p-4 rounded-2xl text-left text-sm font-medium transition-all border ${
                                                    mcqAnswers[qIdx] === optIdx 
                                                    ? 'bg-[#6C5DD3] text-white border-[#6C5DD3] shadow-lg shadow-[#6C5DD3]/20 scale-[1.02]' 
                                                    : 'bg-white text-gray-600 border-gray-100 hover:border-[#6C5DD3]/50 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                                                        mcqAnswers[qIdx] === optIdx ? 'bg-white/20' : 'bg-gray-100'
                                                    }`}>
                                                        {String.fromCharCode(65 + optIdx)}
                                                    </span>
                                                    {opt}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-[#1A1D1F]">Your Submission</h2>
                                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
                                    <FileText size={14} className="text-gray-400" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{task.type} Mode</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Content / Link Submission</label>
                                <textarea
                                    rows={8}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder={task.type === 'Project' ? "Provide your project URL (e.g. GitHub, Google Drive) or a detailed explanation..." : "Write your assignment here or provide a link to your work..."}
                                    className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:ring-4 focus:ring-[#6C5DD3]/10 focus:border-[#6C5DD3] transition-all text-sm leading-relaxed"
                                    required
                                />
                                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 items-start">
                                    <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-700 leading-relaxed">
                                        Make sure your submission follows the guidelines. If you are submitting a link, ensure it is set to <strong>&quot;Public&quot;</strong> or <strong>&quot;Anyone with the link&quot;</strong> so your teacher can review it.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-6 pt-4">
                        <p className="text-xs text-gray-400 font-medium">Ready to submit? This action cannot be undone.</p>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-12 py-4 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center gap-3 ${
                                submitting 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-[#1A1D1F] text-white hover:bg-[#000] hover:shadow-2xl active:scale-95'
                            }`}
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Submit Work
                                    <Send size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
