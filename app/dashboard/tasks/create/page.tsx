"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    ArrowLeft, 
    Save, 
    Plus, 
    Trash2, 
    CheckCircle2, 
    FileText, 
    HelpCircle,
    Calendar,
    Award,
    Hash
} from 'lucide-react';
import { showToast } from "@/lib/toast";

export default function CreateTaskPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'Assignment',
        points: 100,
        courseId: '',
        deadline: '',
        mcqQuestions: [
            { question: '', options: ['', '', '', ''], correctAnswer: 0 }
        ]
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await fetch('/api/courses');
            const data = await res.json();
            if (data.success) {
                setCourses(data.data);
                if (data.data.length > 0) {
                    setFormData(prev => ({ ...prev, courseId: data.data[0]._id }));
                }
            }
        } catch (error) {
            showToast.error("Failed to load courses");
        }
    };

    const handleAddMCQ = () => {
        setFormData({
            ...formData,
            mcqQuestions: [
                ...formData.mcqQuestions,
                { question: '', options: ['', '', '', ''], correctAnswer: 0 }
            ]
        });
    };

    const removeMCQ = (index: number) => {
        const newMCQs = [...formData.mcqQuestions];
        newMCQs.splice(index, 1);
        setFormData({ ...formData, mcqQuestions: newMCQs });
    };

    const handleMCQChange = (index: number, field: string, value: any, optionIndex?: number) => {
        const newMCQs = [...formData.mcqQuestions];
        if (field === 'question') {
            newMCQs[index].question = value;
        } else if (field === 'correctAnswer') {
            newMCQs[index].correctAnswer = value;
        } else if (field === 'option' && optionIndex !== undefined) {
            newMCQs[index].options[optionIndex] = value;
        }
        setFormData({ ...formData, mcqQuestions: newMCQs });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title || !formData.courseId) {
            showToast.error("Please fill in all required fields");
            return;
        }

        setLoading(true);
        const loadingToast = showToast.loading("Creating task...");

        try {
            const submissionData = {
                ...formData,
                mcqQuestions: formData.type === 'MCQ' ? formData.mcqQuestions : []
            };

            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData)
            });

            const data = await res.json();
            showToast.dismiss(loadingToast);

            if (data.success) {
                showToast.success("Task created successfully");
                router.push('/dashboard/tasks');
            } else {
                showToast.error(data.message || "Failed to create task");
            }
        } catch (error) {
            showToast.dismiss(loadingToast);
            showToast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 bg-white rounded-xl border border-gray-100 hover:bg-gray-50 transition-all text-gray-500"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#1A1D1F]">Create Task</h1>
                        <p className="text-sm text-gray-500">Define a new assessment for your students</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info Card */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#6C5DD3]/10 flex items-center justify-center text-[#6C5DD3]">
                            <FileText size={18} />
                        </div>
                        <h2 className="font-bold text-[#1A1D1F]">Basic Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Task Title*</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Final Project Submission"
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Target Course*</label>
                            <select
                                value={formData.courseId}
                                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50 font-medium"
                                required
                            >
                                <option value="" disabled>Select a course</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>{course.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Task Type*</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Assignment', 'MCQ', 'Project'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: type as any })}
                                        className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                                            formData.type === type 
                                            ? 'bg-[#6C5DD3] text-white border-[#6C5DD3] shadow-lg shadow-[#6C5DD3]/20' 
                                            : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Description / Instructions</label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Guidelines for students..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50"
                            />
                        </div>
                    </div>
                </div>

                {/* Configurations Card */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                            <Hash size={18} />
                        </div>
                        <h2 className="font-bold text-[#1A1D1F]">Grading & Schedule</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Award size={16} className="text-yellow-500" />
                                Max Score (Points)*
                            </label>
                            <input
                                type="number"
                                value={formData.points}
                                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50"
                                required
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Calendar size={16} className="text-blue-500" />
                                Deadline (Optional)
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50 font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* MCQ Section - Only show if task type is MCQ */}
                {formData.type === 'MCQ' && (
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                    <HelpCircle size={18} />
                                </div>
                                <h2 className="font-bold text-[#1A1D1F]">MCQ Questions</h2>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddMCQ}
                                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Add Question
                            </button>
                        </div>

                        <div className="space-y-8">
                            {formData.mcqQuestions.map((q, qIndex) => (
                                <div key={qIndex} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-4 relative group">
                                    <button
                                        type="button"
                                        onClick={() => removeMCQ(qIndex)}
                                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Question {qIndex + 1}</label>
                                        <input
                                            type="text"
                                            value={q.question}
                                            onChange={(e) => handleMCQChange(qIndex, 'question', e.target.value)}
                                            placeholder="Enter your question here..."
                                            className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.options.map((opt, optIndex) => (
                                            <div key={optIndex} className="relative">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMCQChange(qIndex, 'correctAnswer', optIndex)}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                                                            q.correctAnswer === optIndex 
                                                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                                                            : 'bg-white text-gray-300 border border-gray-100 hover:border-green-500 hover:text-green-500'
                                                        }`}
                                                        title="Mark as Correct"
                                                    >
                                                        {q.correctAnswer === optIndex ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-current"></div>}
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={opt}
                                                        onChange={(e) => handleMCQChange(qIndex, 'option', e.target.value, optIndex)}
                                                        placeholder={`Option ${optIndex + 1}`}
                                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-sm"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-4 mt-8">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-10 py-3 bg-[#6C5DD3] text-white rounded-xl font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-all flex items-center gap-2"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={20} />}
                        Launch Task
                    </button>
                </div>
            </form>
        </div>
    );
}
