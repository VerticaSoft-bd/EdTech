"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AddCoursePage() {
    const [activeTab, setActiveTab] = useState('basic');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [imageError, setImageError] = useState('');
    const [studentProjectFiles, setStudentProjectFiles] = useState<(File | string)[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);

    // Fetch teachers on mount
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await fetch('/api/users?role=teacher');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        setTeachers(data.data);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch teachers:", err);
            }
        };
        fetchTeachers();
    }, []);

    // Centralized Course State
    const [courseData, setCourseData] = useState({
        title: '',
        subtitle: '',
        category: 'Design',
        level: 'Beginner',
        courseMode: 'Offline Class',
        duration: '',
        batches: [] as { startDate: string, classTime: string }[],
        totalStudents: 0,
        totalLectures: 0,
        totalProjects: 0,
        fullDetails: '',
        targetAudience: '',
        keyDeliverables: [] as string[],
        modules: [] as { title: string, topics: { title: string }[] }[],
        thumbnail: '',
        introVideo: '',
        studentProjects: [] as string[],
        regularFee: 0,
        discountPercentage: 0,
        admissionUrl: '',
        seminarUrl: '',
        isFree: false,
        assignedTeachers: [] as string[],
        careerOpportunities: [] as { title: string, description: string }[],
        uniqueFeatures: [] as { title: string, description: string }[],
        status: 'Draft' as 'Draft' | 'Active' | 'Archived'
    });

    const handleInputChange = (field: string, value: any) => {
        setCourseData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (status: 'Draft' | 'Active') => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        if (!courseData.title || !courseData.category || !courseData.courseMode) {
            setError('Please fill out the required fields (Course Title, Category, and Mode) before saving.');
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            let thumbnailUrl = courseData.thumbnail;

            if (thumbnailFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', thumbnailFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    thumbnailUrl = uploadData.url;
                } else {
                    const errorData = await uploadRes.json();
                    throw new Error(`Image Upload Error: ${errorData.message}`);
                }
            }

            // Upload Student Project Images
            const uploadedProjectUrls: string[] = [];
            for (let i = 0; i < studentProjectFiles.length; i++) {
                const fileOrUrl = studentProjectFiles[i];
                if (fileOrUrl instanceof File) {
                    const uploadFormData = new FormData();
                    uploadFormData.append('file', fileOrUrl);

                    const uploadRes = await fetch('/api/upload', {
                        method: 'POST',
                        body: uploadFormData
                    });

                    if (uploadRes.ok) {
                        const uploadData = await uploadRes.json();
                        uploadedProjectUrls.push(uploadData.url);
                    } else {
                        throw new Error(`Failed to upload student project image ${i + 1}`);
                    }
                } else if (typeof fileOrUrl === 'string' && fileOrUrl.trim() !== '') {
                    uploadedProjectUrls.push(fileOrUrl);
                }
            }

            const payload = {
                ...courseData,
                thumbnail: thumbnailUrl,
                studentProjects: uploadedProjectUrls,
                assignedTeachers: courseData.assignedTeachers.filter(id => id.trim() !== ""),
                status
            };

            const res = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Failed to save course');
            }

            setSuccessMessage(`Course successfully saved as ${status}!`);
            if (status === 'Active') {
                window.location.href = '/dashboard/courses';
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const tabList = ['basic', 'details', 'curriculum', 'media', 'pricing', 'teacher', 'career', 'features'];

    const handleNextTab = () => {
        const currentIndex = tabList.indexOf(activeTab);
        if (currentIndex < tabList.length - 1) {
            setActiveTab(tabList[currentIndex + 1]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePreviousTab = () => {
        const currentIndex = tabList.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabList[currentIndex - 1]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/courses" className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-[#1A1D1F]">Create New Course</h2>
                        <p className="text-sm text-gray-500">Fill in the details to publish a new course.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSave('Draft')}
                        disabled={loading}
                        className="px-5 py-2.5 bg-white border border-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave('Active')}
                        disabled={loading}
                        className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Publishing...' : 'Publish Course'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="p-4 bg-green-50 text-green-600 rounded-xl border border-green-100 text-sm font-medium">
                    {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Form */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Tabs */}
                    <div className="bg-white p-1 rounded-xl border border-gray-100 inline-flex flex-wrap gap-1">
                        {tabList.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-[#6C5DD3] text-white shadow-md' : 'text-gray-500 hover:text-[#1A1D1F]'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Form Content */}
                    <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm space-y-6">
                        {activeTab === 'basic' && (
                            <>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Course Title</label>
                                        <input
                                            type="text"
                                            value={courseData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            placeholder="e.g. Advanced UI/UX Design Masterclass"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Short Description / Subtitle</label>
                                        <input
                                            type="text"
                                            value={courseData.subtitle}
                                            onChange={(e) => handleInputChange('subtitle', e.target.value)}
                                            placeholder="e.g. Master design tools and build a professional portfolio"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                                            <select
                                                value={courseData.category}
                                                onChange={(e) => handleInputChange('category', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F] appearance-none cursor-pointer"
                                            >
                                                <option>Design</option>
                                                <option>Development</option>
                                                <option>Marketing</option>
                                                <option>Business</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Level</label>
                                            <select
                                                value={courseData.level}
                                                onChange={(e) => handleInputChange('level', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F] appearance-none cursor-pointer"
                                            >
                                                <option>Beginner</option>
                                                <option>Intermediate</option>
                                                <option>Advanced</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Course Mode</label>
                                            <select
                                                value={courseData.courseMode}
                                                onChange={(e) => handleInputChange('courseMode', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F] appearance-none cursor-pointer"
                                            >
                                                <option>Offline Class</option>
                                                <option>Online Class</option>
                                                <option>Hybrid</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Course Duration (e.g. 6 Months)</label>
                                            <input
                                                type="text"
                                                value={courseData.duration}
                                                onChange={(e) => handleInputChange('duration', e.target.value)}
                                                placeholder="e.g. 6 Months"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Batches & Schedules</label>
                                            <button
                                                onClick={() => setCourseData(prev => ({ ...prev, batches: [...prev.batches, { startDate: '', classTime: '' }] }))}
                                                className="text-xs font-bold text-[#6C5DD3] hover:underline flex items-center gap-1"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                                                Add Batch
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {courseData.batches.map((batch, index) => (
                                                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Start Date</label>
                                                            <input
                                                                type="date"
                                                                value={batch.startDate}
                                                                onChange={(e) => {
                                                                    const newBatches = [...courseData.batches];
                                                                    newBatches[index].startDate = e.target.value;
                                                                    handleInputChange('batches', newBatches);
                                                                }}
                                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Class Time</label>
                                                            <input
                                                                type="text"
                                                                value={batch.classTime}
                                                                onChange={(e) => {
                                                                    const newBatches = [...courseData.batches];
                                                                    newBatches[index].classTime = e.target.value;
                                                                    handleInputChange('batches', newBatches);
                                                                }}
                                                                placeholder="e.g. 02:00 PM TO 04:00 PM"
                                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20"
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const newBatches = courseData.batches.filter((_, i) => i !== index);
                                                            handleInputChange('batches', newBatches);
                                                        }}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-5"
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                                    </button>
                                                </div>
                                            ))}
                                            {courseData.batches.length === 0 && (
                                                <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-gray-100">No batches added yet. Click "Add Batch" to specify schedules.</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Students</label>
                                            <input
                                                type="number"
                                                value={courseData.totalStudents || ''}
                                                onChange={(e) => handleInputChange('totalStudents', parseInt(e.target.value) || 0)}
                                                placeholder="500"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Lectures</label>
                                            <input
                                                type="number"
                                                value={courseData.totalLectures || ''}
                                                onChange={(e) => handleInputChange('totalLectures', parseInt(e.target.value) || 0)}
                                                placeholder="52"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Projects</label>
                                            <input
                                                type="number"
                                                value={courseData.totalProjects || ''}
                                                onChange={(e) => handleInputChange('totalProjects', parseInt(e.target.value) || 0)}
                                                placeholder="20"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'details' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Course Details</label>
                                    <textarea
                                        rows={6}
                                        value={courseData.fullDetails}
                                        onChange={(e) => handleInputChange('fullDetails', e.target.value)}
                                        placeholder="Describe the full course details..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F] resize-none"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Who is this course for?</label>
                                    <textarea
                                        rows={4}
                                        value={courseData.targetAudience}
                                        onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                                        placeholder="Describe the target audience..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F] resize-none"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Key Deliverables</label>
                                    <div className="space-y-2">
                                        {courseData.keyDeliverables.map((deliverable, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={deliverable}
                                                    onChange={(e) => {
                                                        const newDeliverables = [...courseData.keyDeliverables];
                                                        newDeliverables[index] = e.target.value;
                                                        handleInputChange('keyDeliverables', newDeliverables);
                                                    }}
                                                    placeholder="e.g. Completion Certification"
                                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newDeliverables = courseData.keyDeliverables.filter((_, i) => i !== index);
                                                        handleInputChange('keyDeliverables', newDeliverables);
                                                    }}
                                                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                        {courseData.keyDeliverables.length === 0 && (
                                            <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-gray-100">No deliverables added yet.</div>
                                        )}
                                        <button
                                            onClick={() => setCourseData(prev => ({ ...prev, keyDeliverables: [...prev.keyDeliverables, ''] }))}
                                            className="text-sm font-bold text-[#6C5DD3] hover:underline flex items-center gap-1 mt-2"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                                            Add Deliverable
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'curriculum' && (
                            <div className="text-center py-12 pb-4">
                                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                                </div>
                                <h3 className="font-bold text-[#1A1D1F]">Curriculum Builder</h3>
                                <p className="text-sm text-gray-500 mb-6">Start adding modules and topics to your course syllabus.</p>
                                <button
                                    onClick={() => setCourseData(prev => ({ ...prev, modules: [...prev.modules, { title: '', topics: [] }] }))}
                                    className="px-5 py-2.5 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-xl text-sm font-bold hover:bg-[#6C5DD3]/20 transition-colors"
                                >
                                    + Add Module
                                </button>

                                <div className="mt-8 text-left space-y-4 max-w-lg mx-auto">
                                    {courseData.modules.map((module, mIndex) => (
                                        <div key={mIndex} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-3">
                                                <div className="flex items-center gap-2 flex-1 mr-4">
                                                    <svg className="text-gray-400 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                                                    <input
                                                        type="text"
                                                        value={module.title}
                                                        onChange={(e) => {
                                                            const newModules = [...courseData.modules];
                                                            newModules[mIndex].title = e.target.value;
                                                            handleInputChange('modules', newModules);
                                                        }}
                                                        placeholder={`Module ${mIndex + 1} Title`}
                                                        className="font-bold text-[#1A1D1F] bg-transparent border-none p-0 focus:ring-0 w-full"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const newModules = courseData.modules.filter((_, i) => i !== mIndex);
                                                            handleInputChange('modules', newModules);
                                                        }}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="pl-6 space-y-2">
                                                {module.topics.map((topic, tIndex) => (
                                                    <div key={tIndex} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                        <svg className="text-gray-400 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" /><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" /></svg>
                                                        <input
                                                            type="text"
                                                            value={topic.title}
                                                            onChange={(e) => {
                                                                const newModules = [...courseData.modules];
                                                                newModules[mIndex].topics[tIndex].title = e.target.value;
                                                                handleInputChange('modules', newModules);
                                                            }}
                                                            placeholder="Topic title"
                                                            className="text-sm text-gray-600 bg-transparent border-none p-0 focus:ring-0 w-full flex-1"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const newModules = [...courseData.modules];
                                                                newModules[mIndex].topics = newModules[mIndex].topics.filter((_, i) => i !== tIndex);
                                                                handleInputChange('modules', newModules);
                                                            }}
                                                            className="text-red-400 hover:text-red-600"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                        </button>
                                                    </div>
                                                ))}
                                                {module.topics.length === 0 && (
                                                    <p className="text-xs text-gray-400 italic py-1">No topics added.</p>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        const newModules = [...courseData.modules];
                                                        newModules[mIndex].topics.push({ title: '' });
                                                        handleInputChange('modules', newModules);
                                                    }}
                                                    className="text-xs font-bold text-gray-500 hover:text-[#6C5DD3] mt-2 block"
                                                >
                                                    + Add Topic
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {courseData.modules.length === 0 && (
                                        <div className="text-sm text-gray-500 py-8 border-2 border-dashed border-gray-100 rounded-xl text-center">No modules added yet. Let's create the first one!</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'media' && (
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Course Thumbnail</label>
                                        <span className="text-xs text-gray-400 font-medium">JPG, PNG, WEBP (Max 2MB)</span>
                                    </div>
                                    <div className={`relative border-2 border-dashed ${(thumbnailFile || courseData.thumbnail) ? 'border-transparent' : 'border-gray-200'} rounded-xl hover:border-[#6C5DD3] transition-colors bg-gray-50 text-center overflow-hidden min-h-[200px] flex items-center justify-center`}>
                                        <input
                                            type="file"
                                            accept="image/jpeg, image/png, image/webp"
                                            onChange={e => {
                                                setImageError('');
                                                if (e.target.files && e.target.files.length > 0) {
                                                    const file = e.target.files[0];
                                                    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
                                                    if (!validTypes.includes(file.type)) {
                                                        setImageError('Invalid image format. Please upload JPG, PNG, or WEBP.');
                                                        return;
                                                    }
                                                    if (file.size > 2 * 1024 * 1024) {
                                                        setImageError('Image size exceeds the 2MB limit.');
                                                        return;
                                                    }
                                                    setThumbnailFile(file);
                                                }
                                            }}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        />

                                        {(thumbnailFile || courseData.thumbnail) ? (
                                            <div className="absolute inset-0 w-full h-full group-thumbnail">
                                                <img
                                                    src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : courseData.thumbnail}
                                                    alt="Course Thumbnail"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10 pointer-events-auto">
                                                    <span className="text-white text-sm font-bold mb-1">Click to change</span>
                                                    <span className="text-white/80 text-xs truncate max-w-[200px] px-4">{thumbnailFile ? thumbnailFile.name : "Current Image"}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pointer-events-none py-6 z-10">
                                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 text-gray-400">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                                </div>
                                                <span className="text-sm font-bold text-gray-700 mb-1">Click to upload</span>
                                                <span className="text-xs font-medium text-gray-400">or drag and drop</span>
                                            </div>
                                        )}
                                    </div>
                                    {imageError && (
                                        <div className="mt-2 text-red-500 text-xs font-medium bg-red-50 p-2 rounded-lg border border-red-100 flex items-center gap-1.5">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                            {imageError}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Intro Video (Optional)</label>
                                    <input
                                        type="text"
                                        value={courseData.introVideo}
                                        onChange={(e) => handleInputChange('introVideo', e.target.value)}
                                        placeholder="Paste video URL (YouTube, Vimeo)"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Student Projects Gallery (Images or URLs)</label>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                        {studentProjectFiles.map((fileOrUrl, index) => (
                                            <div key={index} className="relative aspect-video rounded-xl border border-gray-200 overflow-hidden group">
                                                {fileOrUrl instanceof File ? (
                                                    <img
                                                        src={URL.createObjectURL(fileOrUrl)}
                                                        alt={`Project ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={fileOrUrl}
                                                        alt={`Project ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            const newFiles = [...studentProjectFiles];
                                                            newFiles.splice(index, 1);
                                                            setStudentProjectFiles(newFiles);
                                                        }}
                                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add New Project Image Button */}
                                        <div className="relative aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-[#6C5DD3] transition-colors bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                                            <input
                                                type="file"
                                                accept="image/jpeg, image/png, image/webp"
                                                onChange={e => {
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        const file = e.target.files[0];
                                                        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
                                                        if (validTypes.includes(file.type) && file.size <= 2 * 1024 * 1024) {
                                                            setStudentProjectFiles([...studentProjectFiles, file]);
                                                        } else {
                                                            alert("Please upload a valid JPG, PNG, or WEBP image under 2MB.");
                                                        }
                                                    }
                                                }}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                            />
                                            <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-gray-400">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">Upload Image</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {courseData.studentProjects.map((projectUrl, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={projectUrl}
                                                    onChange={(e) => {
                                                        const newProjects = [...courseData.studentProjects];
                                                        newProjects[index] = e.target.value;
                                                        handleInputChange('studentProjects', newProjects);
                                                    }}
                                                    placeholder="Or paste project image URL"
                                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newProjects = courseData.studentProjects.filter((_, i) => i !== index);
                                                        handleInputChange('studentProjects', newProjects);
                                                    }}
                                                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setCourseData(prev => ({ ...prev, studentProjects: [...prev.studentProjects, ''] }))}
                                            className="text-sm font-bold text-[#6C5DD3] hover:underline flex items-center gap-1 mt-2"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                                            Add Details from URL
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'pricing' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Regular Fee (BDT)</label>
                                        <input
                                            type="number"
                                            value={courseData.regularFee || ''}
                                            onChange={(e) => handleInputChange('regularFee', parseInt(e.target.value) || 0)}
                                            placeholder="30000"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Discount Percentage (%)</label>
                                        <input
                                            type="number"
                                            value={courseData.discountPercentage || ''}
                                            onChange={(e) => handleInputChange('discountPercentage', parseInt(e.target.value) || 0)}
                                            placeholder="40"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Admission/Enrollment URL</label>
                                        <input
                                            type="text"
                                            value={courseData.admissionUrl}
                                            onChange={(e) => handleInputChange('admissionUrl', e.target.value)}
                                            placeholder="e.g. https://forms.gle/..."
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Free Seminar Booking URL</label>
                                        <input
                                            type="text"
                                            value={courseData.seminarUrl}
                                            onChange={(e) => handleInputChange('seminarUrl', e.target.value)}
                                            placeholder="e.g. https://forms.gle/..."
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                        />
                                    </div>
                                </div>
                                <div
                                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer"
                                    onClick={() => handleInputChange('isFree', !courseData.isFree)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={courseData.isFree}
                                        readOnly
                                        className="w-5 h-5 rounded text-[#6C5DD3] focus:ring-[#6C5DD3] cursor-pointer pointer-events-none"
                                    />
                                    <span className="text-sm font-medium text-[#1A1D1F]">This is a free course</span>
                                </div>
                            </div>
                        )}

                        {activeTab === 'teacher' && (
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-bold text-[#1A1D1F]">Assign Teachers</h3>
                                        <button
                                            onClick={() => handleInputChange('assignedTeachers', [...courseData.assignedTeachers, ""])}
                                            className="text-sm font-bold text-[#6C5DD3] hover:underline flex items-center gap-1"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                                            Add Teacher
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-6">Select the instructors for this course. They will have access to manage students and lessons.</p>

                                    <div className="space-y-3">
                                        {courseData.assignedTeachers.map((teacherId, index) => {
                                            const selectedTeacher = teachers.find(t => t._id === teacherId);
                                            return (
                                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                                                    <div className="flex-1 relative">
                                                        <select
                                                            value={teacherId}
                                                            onChange={(e) => {
                                                                const newTeachers = [...courseData.assignedTeachers];
                                                                newTeachers[index] = e.target.value;
                                                                handleInputChange('assignedTeachers', newTeachers);
                                                            }}
                                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 appearance-none cursor-pointer"
                                                        >
                                                            <option value="">Select a Teacher</option>
                                                            {teachers.map(t => (
                                                                <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
                                                            ))}
                                                        </select>
                                                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {index === 0 && <span className="px-2.5 py-1 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-lg text-xs font-bold border border-[#6C5DD3]/20">Primary</span>}
                                                        <button
                                                            onClick={() => {
                                                                const newTeachers = [...courseData.assignedTeachers];
                                                                newTeachers.splice(index, 1);
                                                                handleInputChange('assignedTeachers', newTeachers);
                                                            }}
                                                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                        >
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                        {courseData.assignedTeachers.length === 0 && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                                                <div className="flex-1 relative">
                                                    <select
                                                        value=""
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                handleInputChange('assignedTeachers', [...courseData.assignedTeachers, e.target.value]);
                                                            }
                                                        }}
                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Select a Teacher</option>
                                                        {teachers.map(t => (
                                                            <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
                                                        ))}
                                                    </select>
                                                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-1 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-lg text-xs font-bold border border-[#6C5DD3]/20">Primary</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {courseData.assignedTeachers.length > 0 && (
                                        <button
                                            onClick={() => handleInputChange('assignedTeachers', [...courseData.assignedTeachers, ""])}
                                            className="text-sm font-bold text-[#6C5DD3] hover:underline flex items-center gap-1 mt-4"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                                            Add Another Teacher
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'career' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Career Opportunities</label>
                                    <div className="space-y-4">
                                        {courseData.careerOpportunities.map((opp, index) => (
                                            <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <div className="flex-1 space-y-3">
                                                    <input
                                                        type="text"
                                                        value={opp.title}
                                                        onChange={(e) => {
                                                            const newOpps = [...courseData.careerOpportunities];
                                                            newOpps[index].title = e.target.value;
                                                            handleInputChange('careerOpportunities', newOpps);
                                                        }}
                                                        placeholder="Role Title (e.g. Graphic Designer)"
                                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20"
                                                    />
                                                    <textarea
                                                        value={opp.description}
                                                        onChange={(e) => {
                                                            const newOpps = [...courseData.careerOpportunities];
                                                            newOpps[index].description = e.target.value;
                                                            handleInputChange('careerOpportunities', newOpps);
                                                        }}
                                                        placeholder="Brief description of the opportunity"
                                                        rows={2}
                                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 resize-none"
                                                    ></textarea>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const newOpps = [...courseData.careerOpportunities];
                                                        newOpps.splice(index, 1);
                                                        handleInputChange('careerOpportunities', newOpps);
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1 shrink-0"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {courseData.careerOpportunities.length === 0 && (
                                        <div className="text-sm text-gray-500 py-6 text-center border-2 border-dashed border-gray-100 rounded-xl mb-4 mt-2">No career opportunities added.</div>
                                    )}

                                    <button
                                        onClick={() => handleInputChange('careerOpportunities', [...courseData.careerOpportunities, { title: '', description: '' }])}
                                        className="text-sm font-bold text-[#6C5DD3] hover:text-[#5a4cb5] flex items-center gap-1.5 mt-2"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                        Add Opportunity
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'features' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Unique Features</label>
                                    <div className="space-y-4">
                                        {courseData.uniqueFeatures.map((feature, index) => (
                                            <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <div className="flex-1 space-y-3">
                                                    <input
                                                        type="text"
                                                        value={feature.title}
                                                        onChange={(e) => {
                                                            const newFeatures = [...courseData.uniqueFeatures];
                                                            newFeatures[index].title = e.target.value;
                                                            handleInputChange('uniqueFeatures', newFeatures);
                                                        }}
                                                        placeholder="Feature Title (e.g. Certificate of Completion)"
                                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20"
                                                    />
                                                    <textarea
                                                        value={feature.description}
                                                        onChange={(e) => {
                                                            const newFeatures = [...courseData.uniqueFeatures];
                                                            newFeatures[index].description = e.target.value;
                                                            handleInputChange('uniqueFeatures', newFeatures);
                                                        }}
                                                        placeholder="Brief description of the feature"
                                                        rows={2}
                                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 resize-none"
                                                    ></textarea>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const newFeatures = [...courseData.uniqueFeatures];
                                                        newFeatures.splice(index, 1);
                                                        handleInputChange('uniqueFeatures', newFeatures);
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1 shrink-0"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {courseData.uniqueFeatures.length === 0 && (
                                        <div className="text-sm text-gray-500 py-6 text-center border-2 border-dashed border-gray-100 rounded-xl mb-4 mt-2">No unique features added.</div>
                                    )}

                                    <button
                                        onClick={() => handleInputChange('uniqueFeatures', [...courseData.uniqueFeatures, { title: '', description: '' }])}
                                        className="text-sm font-bold text-[#6C5DD3] hover:text-[#5a4cb5] flex items-center gap-1.5 mt-2"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                        Add Feature
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                            <button
                                onClick={handlePreviousTab}
                                disabled={activeTab === 'basic'}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${activeTab === 'basic' ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50' : 'bg-white border text-gray-600 hover:bg-gray-50 shadow-sm'}`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNextTab}
                                disabled={activeTab === 'features'}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${activeTab === 'features' ? 'opacity-0 pointer-events-none w-0 h-0 overflow-hidden' : 'bg-[#6C5DD3] text-white shadow-[#6C5DD3]/25 shadow-lg hover:shadow-xl hover:bg-[#5a4cb5]'}`}
                            >
                                Next Step
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Preview */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="sticky top-6">
                        <h3 className="text-lg font-bold text-[#1A1D1F] mb-6">Preview</h3>

                        {/* Card Preview */}
                        <div className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 mb-6">
                            <div className="h-[160px] rounded-[20px] bg-gradient-to-br from-[#8E8AFF] to-[#B4B1FF] relative p-5 flex flex-col justify-between overflow-hidden mb-4">
                                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>
                                {thumbnailFile && (
                                    <img
                                        src={URL.createObjectURL(thumbnailFile)}
                                        alt="Preview"
                                        className="absolute top-0 left-0 w-full h-full object-cover z-0"
                                    />
                                )}
                                <div className="flex justify-between items-start relative z-10">
                                    <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-bold border border-white/20 shadow-sm">{courseData.category || "Design"}</span>
                                    <span className="px-2.5 py-1 backdrop-blur-md rounded-lg text-white text-[10px] font-bold border border-white/20 bg-[#8E8AFF]/40 shadow-sm">{courseData.courseMode === 'Online Class' ? 'Online' : courseData.courseMode === 'Offline Class' ? 'Offline' : courseData.courseMode || "Online"}</span>
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-1 text-white/90 text-[11px] font-medium mb-1 drop-shadow-md">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        0h 0m • {courseData.totalLectures || 0} Lessons
                                    </div>
                                </div>
                            </div>
                            <div className="px-2 pb-2">
                                <h3 className="font-bold text-[#1A1D1F] text-lg leading-tight mb-2 line-clamp-2 min-h-[50px]">{courseData.title || "Your Course Title"}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                                    <span className="text-xs text-gray-500 font-medium">by You</span>
                                </div>
                                <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
                                    <span className="text-lg font-bold text-[#1A1D1F]">
                                        {courseData.isFree ? (
                                            "Free"
                                        ) : (
                                            <>৳{courseData.regularFee || "0.00"}</>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tips Card */}
                        <div className="bg-[#6C5DD3]/5 rounded-[24px] p-6 border border-[#6C5DD3]/10">
                            <h4 className="font-bold text-[#6C5DD3] mb-2 flex items-center gap-2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                                Pro Tips
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                                <li>Use a high-quality eye-catching thumbnail.</li>
                                <li>Keep your title clear and benefit-oriented.</li>
                                <li>Break down content into bite-sized lessons.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
