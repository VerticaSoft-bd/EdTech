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
    const [teachers, setTeachers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    // Fetch teachers and categories on mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [teachersRes, categoriesRes] = await Promise.all([
                    fetch('/api/users?role=teacher'),
                    fetch('/api/categories')
                ]);

                if (teachersRes.ok) {
                    const data = await teachersRes.json();
                    if (data.success && data.data) {
                        setTeachers(data.data);
                    }
                }

                if (categoriesRes.ok) {
                    const data = await categoriesRes.json();
                    if (data.success && data.data) {
                        setCategories(data.data);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch initial data:", err);
            }
        };
        fetchInitialData();
    }, []);

    // Centralized Course State
    const [aiBannerFile, setAiBannerFile] = useState<File | null>(null);
    const [aiLearningBannerFile, setAiLearningBannerFile] = useState<File | null>(null);
    const [toolImageFiles, setToolImageFiles] = useState<(File | null)[]>([]);
    const [learnItemIconFiles, setLearnItemIconFiles] = useState<(File | null)[]>([]);
    const [benefitIconFiles, setBenefitIconFiles] = useState<(File | null)[]>([]);

    const [courseData, setCourseData] = useState({
        title: '',
        subtitle: '',
        category: '',
        courseMode: 'Offline Class',
        duration: '',
        batches: [] as { startDate: string, classTime: string }[],
        totalLectures: 0,
        totalProjects: 0,
        fullDetails: '',
        targetAudience: [] as string[],
        modules: [] as { title: string, topics: { title: string }[] }[],
        thumbnail: '',
        introVideo: '',
        regularFee: 0,
        discountPercentage: 0,
        assignedTeachers: [] as string[],
        careerOpportunities: [] as { title: string, description: string }[],
        batchNumber: '',
        benefits: [] as { icon: string, title: string, subtitle: string }[],
        whatYouWillLearn: [] as { text: string, icon: string }[],
        successStories: [] as { name: string, role: string }[],
        testimonials: [] as { text: string, name: string }[],
        faqs: [] as { question: string, answer: string }[],
        tools: [] as { name: string, image: string }[],
        demoClass: { date: '', time: '', platform: '', videoUrls: [] as string[] },
        aiBannerUrl: '',
        aiLearningBannerUrl: '',
        aiLearningBadge: 'AI-Powered Learning',
        aiLearningTitle1: 'এই কোর্সে',
        aiLearningHighlight: 'AI ব্যবহার করে',
        aiLearningTitle2: 'শিখবেন কীভাবে কাজ করতে হয়',
        aiLearningDetails: 'শুধু কোড নয়, এই কোর্সে আপনি শিখবেন কীভাবে AI tools ব্যবহার করে real-world সমস্যা সমাধান করতে হয়, Error Handle করতে হয় এবং productivity বাড়াতে হয়।',
        aiLearningImageBadge1: 'AI',
        aiLearningImageBadge2: 'Driven',
        showAiLearningBanner: true,
        aiJobReadyBadge: 'ক্যারিয়ার রেডি',
        aiJobReadyTitle1: 'কোর্স শেষে আপনি',
        aiJobReadyHighlight: 'চাকরির জন্য প্রস্তুত',
        aiJobReadyTitle2: 'হয়ে যাবেন',
        aiJobReadyDetails: 'প্রতিটি মডিউলে real-world project, AI-assisted coding, এবং expert mentorship — সবকিছু মিলিয়ে আপনাকে industry-ready করে তুলবে।',
        aiJobReadyImageBadge: 'Job Ready',
        showAiJobReadyBanner: true,
        status: 'Draft' as 'Draft' | 'Active' | 'Archived',
        aiFeatures: ['🤖 ChatGPT Integration', '⚡ GitHub Copilot', '🧠 AI Error Handling'] as string[],
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



            // Upload Tool Images
            const uploadedTools: { name: string, image: string }[] = [];
            for (let i = 0; i < courseData.tools.length; i++) {
                const tool = courseData.tools[i];
                const imageFile = toolImageFiles[i];
                let imageUrl = tool.image || '';
                if (imageFile) {
                    const uploadFormData = new FormData();
                    uploadFormData.append('file', imageFile);
                    const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadFormData });
                    if (uploadRes.ok) {
                        const uploadData = await uploadRes.json();
                        imageUrl = uploadData.url;
                    } else {
                        throw new Error(`Failed to upload tool image for ${tool.name}`);
                    }
                }
                uploadedTools.push({ name: tool.name, image: imageUrl });
            }

            // Upload What You Will Learn Icons
            const uploadedLearnItems: { text: string, icon: string }[] = [];
            for (let i = 0; i < courseData.whatYouWillLearn.length; i++) {
                const item = courseData.whatYouWillLearn[i];
                const imageFile = learnItemIconFiles[i];
                let imageUrl = item.icon || '';
                if (imageFile) {
                    const uploadFormData = new FormData();
                    uploadFormData.append('file', imageFile);
                    const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadFormData });
                    if (uploadRes.ok) {
                        const uploadData = await uploadRes.json();
                        imageUrl = uploadData.url;
                    } else {
                        throw new Error(`Failed to upload icon for what you will learn item ${i + 1}`);
                    }
                }
                uploadedLearnItems.push({ text: item.text, icon: imageUrl });
            }

            // Upload Benefit Icons
            const uploadedBenefits: { icon: string, title: string, subtitle: string }[] = [];
            for (let i = 0; i < courseData.benefits.length; i++) {
                const benefit = courseData.benefits[i];
                const imageFile = benefitIconFiles[i];
                let imageUrl = benefit.icon || '';
                if (imageFile) {
                    const uploadFormData = new FormData();
                    uploadFormData.append('file', imageFile);
                    const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadFormData });
                    if (uploadRes.ok) {
                        const uploadData = await uploadRes.json();
                        imageUrl = uploadData.url; // Use URL string 
                    } else {
                        throw new Error(`Failed to upload benefit icon ${i + 1}`);
                    }
                }
                uploadedBenefits.push({ ...benefit, icon: imageUrl });
            }



            // Handle AI banner upload
            let uploadedAiBannerUrl = courseData.aiBannerUrl;
            if (aiBannerFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', aiBannerFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData,
                });

                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    uploadedAiBannerUrl = data.url;
                }
            }

            // Handle AI Learning banner upload
            let uploadedAiLearningBannerUrl = courseData.aiLearningBannerUrl;
            if (aiLearningBannerFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', aiLearningBannerFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData,
                });

                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    uploadedAiLearningBannerUrl = data.url;
                }
            }

            const payload = {
                ...courseData,
                thumbnail: thumbnailUrl,
                tools: uploadedTools,
                whatYouWillLearn: uploadedLearnItems,
                benefits: uploadedBenefits,
                aiFeatures: courseData.aiFeatures,
                aiBannerUrl: uploadedAiBannerUrl,
                aiLearningBannerUrl: uploadedAiLearningBannerUrl,
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

    const tabList = ['basic', 'details', 'curriculum', 'media', 'banners', 'pricing', 'teacher', 'career', 'extras'];

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
                <Link href="/dashboard/courses" className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                </Link>
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
                        {loading ? 'Publishing (পাবলিশ হচ্ছে)...' : 'Publish Course (কোর্স পাবলিশ করুন)'}
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
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Course Title (কোর্সের শিরোনাম)</label>
                                        <input
                                            type="text"
                                            value={courseData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            placeholder="e.g. Advanced UI/UX Design Masterclass"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Short Description / Subtitle (সংক্ষিপ্ত বর্ণনা)</label>
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
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Course Category (কোর্স ক্যাটাগরি)</label>
                                            <select
                                                value={courseData.category}
                                                onChange={(e) => handleInputChange('category', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F] appearance-none cursor-pointer"
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((cat: any) => (
                                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Course Mode (কোর্স মোড)</label>
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
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Course Duration (কোর্সের সময়সীমা - যেমন: ৬ মাস)</label>
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
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Batches & Schedules (ব্যাচ ও সময়সূচী)</label>
                                            <button
                                                onClick={() => setCourseData(prev => ({ ...prev, batches: [...prev.batches, { startDate: '', classTime: '' }] }))}
                                                className="text-xs font-bold text-[#6C5DD3] hover:underline flex items-center gap-1"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                                                Add Batch (ব্যাচ যোগ করুন)
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {courseData.batches.map((batch, index) => (
                                                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Start Date (শুরুর তারিখ)</label>
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
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Class Time (ক্লাসের সময়)</label>
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
                                                <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-gray-100">No batches added yet.</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Lectures (মোট লেকচার)</label>
                                            <input
                                                type="number"
                                                value={courseData.totalLectures || ''}
                                                onChange={(e) => handleInputChange('totalLectures', parseInt(e.target.value) || 0)}
                                                placeholder="50"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Projects (মোট প্রজেক্ট)</label>
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
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Detailed Description</label>
                                    <textarea
                                        value={courseData.fullDetails}
                                        onChange={(e) => handleInputChange('fullDetails', e.target.value)}
                                        placeholder="Comprehensive description of the course, what students will learn, output, etc."
                                        rows={6}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F] resize-y"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Who is this course for? (কোর্সটি কাদের জন্য?)</label>
                                    <div className="space-y-2">
                                        {courseData.targetAudience.map((item, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => {
                                                        const newAudience = [...courseData.targetAudience];
                                                        newAudience[index] = e.target.value;
                                                        handleInputChange('targetAudience', newAudience);
                                                    }}
                                                    placeholder="e.g. যারা একদম শূন্য থেকে শিখতে চান"
                                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newAudience = courseData.targetAudience.filter((_, i) => i !== index);
                                                        handleInputChange('targetAudience', newAudience);
                                                    }}
                                                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                        {courseData.targetAudience.length === 0 && (
                                            <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-gray-100">No target audience items added yet.</div>
                                        )}
                                        <button
                                            onClick={() => setCourseData(prev => ({ ...prev, targetAudience: [...prev.targetAudience, ''] }))}
                                            className="text-sm font-bold text-[#6C5DD3] hover:underline flex items-center gap-1 mt-2"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                                            Add Audience
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
                                        <span className="text-xs text-gray-400 font-medium">Recommended ratio:(293x164px) | JPG, PNG, WEBP (Max 2MB)</span>
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
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Intro Video (ইন্ট্রো ভিডিও - ঐচ্ছিক)</label>
                                    <input
                                        type="text"
                                        value={courseData.introVideo}
                                        onChange={(e) => handleInputChange('introVideo', e.target.value)}
                                        placeholder="Paste video URL (YouTube, Vimeo)"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                    />
                                </div>


                            </div>
                        )}

                        {activeTab === 'banners' && (
                            <div className="space-y-8">
                                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-blue-900 text-base flex items-center gap-2">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                                            AI-Powered Learning Banner details (Top Option)
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-blue-800">Show Banner (ব্যানার দেখান)</span>
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={courseData.showAiLearningBanner}
                                                onClick={() => handleInputChange('showAiLearningBanner', !courseData.showAiLearningBanner)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${courseData.showAiLearningBanner ? 'bg-blue-600' : 'bg-gray-300'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${courseData.showAiLearningBanner ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Small Badge Text (ছোট ব্যাজ টেক্সট)</label>
                                                <input
                                                    type="text"
                                                    value={courseData.aiLearningBadge}
                                                    onChange={(e) => handleInputChange('aiLearningBadge', e.target.value)}
                                                    placeholder="AI-Powered Learning"
                                                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-[#1A1D1F]"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Image Badge Line 1 (ইমেজ ব্যাজ লাইন ১)</label>
                                                    <input
                                                        type="text"
                                                        value={courseData.aiLearningImageBadge1}
                                                        onChange={(e) => handleInputChange('aiLearningImageBadge1', e.target.value)}
                                                        placeholder="AI"
                                                        className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-[#1A1D1F]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Image Badge Line 2 (ইমেজ ব্যাজ লাইন ২)</label>
                                                    <input
                                                        type="text"
                                                        value={courseData.aiLearningImageBadge2}
                                                        onChange={(e) => handleInputChange('aiLearningImageBadge2', e.target.value)}
                                                        placeholder="Driven"
                                                        className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-[#1A1D1F]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Title Prefix</label>
                                                <input
                                                    type="text"
                                                    value={courseData.aiLearningTitle1}
                                                    onChange={(e) => handleInputChange('aiLearningTitle1', e.target.value)}
                                                    placeholder="এই কোর্সে"
                                                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-[#1A1D1F]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Highlighted Text</label>
                                                <input
                                                    type="text"
                                                    value={courseData.aiLearningHighlight}
                                                    onChange={(e) => handleInputChange('aiLearningHighlight', e.target.value)}
                                                    placeholder="AI ব্যবহার করে"
                                                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-[#1A1D1F]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Title Suffix</label>
                                                <input
                                                    type="text"
                                                    value={courseData.aiLearningTitle2}
                                                    onChange={(e) => handleInputChange('aiLearningTitle2', e.target.value)}
                                                    placeholder="শিখবেন কীভাবে কাজ করতে হয়"
                                                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-[#1A1D1F]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Details Text Paragraph</label>
                                            <textarea
                                                value={courseData.aiLearningDetails}
                                                onChange={(e) => handleInputChange('aiLearningDetails', e.target.value)}
                                                placeholder="শুধু কোড নয়, এই কোর্সে আপনি শিখবেন..."
                                                rows={3}
                                                className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-[#1A1D1F] resize-y"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">AI Feature 1</label>
                                                <input
                                                    type="text"
                                                    value={courseData.aiFeatures?.[0] || ''}
                                                    onChange={(e) => {
                                                        const newFeatures = [...(courseData.aiFeatures || [])];
                                                        newFeatures[0] = e.target.value;
                                                        handleInputChange('aiFeatures', newFeatures);
                                                    }}
                                                    placeholder="🤖 ChatGPT Integration"
                                                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-[#1A1D1F]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">AI Feature 2</label>
                                                <input
                                                    type="text"
                                                    value={courseData.aiFeatures?.[1] || ''}
                                                    onChange={(e) => {
                                                        const newFeatures = [...(courseData.aiFeatures || [])];
                                                        newFeatures[1] = e.target.value;
                                                        handleInputChange('aiFeatures', newFeatures);
                                                    }}
                                                    placeholder="⚡ GitHub Copilot"
                                                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-[#1A1D1F]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">AI Feature 3</label>
                                                <input
                                                    type="text"
                                                    value={courseData.aiFeatures?.[2] || ''}
                                                    onChange={(e) => {
                                                        const newFeatures = [...(courseData.aiFeatures || [])];
                                                        newFeatures[2] = e.target.value;
                                                        handleInputChange('aiFeatures', newFeatures);
                                                    }}
                                                    placeholder="🧠 AI Error Handling"
                                                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-[#1A1D1F]"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider">Background Image</label>
                                                <span className="text-xs text-blue-400 font-medium">Recommended ratio:(520x480px)| JPG, PNG, WEBP (Max 2MB)</span>
                                            </div>
                                            <div className={`relative border-2 border-dashed ${(aiLearningBannerFile || courseData.aiLearningBannerUrl) ? 'border-transparent' : 'border-blue-200'} rounded-xl hover:border-blue-400 transition-colors bg-white text-center overflow-hidden min-h-[150px] flex items-center justify-center`}>
                                                <input
                                                    type="file"
                                                    accept="image/jpeg, image/png, image/webp"
                                                    onChange={e => {
                                                        if (e.target.files && e.target.files.length > 0) {
                                                            const file = e.target.files[0];
                                                            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
                                                            if (!validTypes.includes(file.type)) { alert('Invalid image format.'); return; }
                                                            if (file.size > 2 * 1024 * 1024) { alert('Size exceeds limit.'); return; }
                                                            setAiLearningBannerFile(file);
                                                        }
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                />
                                                {(aiLearningBannerFile || courseData.aiLearningBannerUrl) ? (
                                                    <div className="absolute inset-0 w-full h-full group-thumbnail">
                                                        <img src={aiLearningBannerFile ? URL.createObjectURL(aiLearningBannerFile) : courseData.aiLearningBannerUrl} alt="AI Learning Banner" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10 pointer-events-auto">
                                                            <span className="text-white text-sm font-bold mb-1">Click to change</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pointer-events-none py-6 z-10 text-blue-400">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                                        <span className="text-sm font-bold text-blue-700">Upload Banner Image (ব্যানার ইমেজ আপলোড করুন)</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* TOP BANNER LIVE PREVIEW */}
                                        <div className="mt-8 relative overflow-hidden rounded-[30px] bg-[#050D1F] border border-blue-900/40 pointer-events-none xl:scale-100 origin-top-left transition-all">
                                            <div className="absolute top-4 left-4 bg-blue-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full z-50 shadow-lg tracking-wider">Live Preview</div>

                                            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-0">
                                                {/* Text Content */}
                                                <div className="flex-1 p-8 lg:p-10 space-y-6">
                                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-blue-300 text-[11px] font-black rounded-xl border border-white/10 uppercase tracking-wider">
                                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                                                        {courseData.aiLearningBadge || 'AI-Powered Learning'}
                                                    </span>

                                                    <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight">
                                                        {courseData.aiLearningTitle1 || 'এই কোর্সে '} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{courseData.aiLearningHighlight || 'AI ব্যবহার করে'}</span> {courseData.aiLearningTitle2 || ' শিখবেন কীভাবে কাজ করতে হয়'}
                                                    </h2>

                                                    <p className="text-gray-400 text-[14px] leading-relaxed font-medium max-w-[480px]">
                                                        {courseData.aiLearningDetails || 'শুধু কোড নয়, এই কোর্সে আপনি শিখবেন কীভাবে AI tools ব্যবহার করে real-world সমস্যা সমাধান করতে হয়, Error Handle করতে হয় এবং productivity বাড়াতে হয়।'}
                                                    </p>

                                                    {/* Feature Pills */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {(courseData.aiFeatures && courseData.aiFeatures.length > 0 ? courseData.aiFeatures : ['🤖 ChatGPT Integration', '⚡ GitHub Copilot', '🧠 AI Error Handling']).map((item, i) => (
                                                            item ? (
                                                                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-300">
                                                                    <span>{item}</span>
                                                                </div>
                                                            ) : null
                                                        ))}
                                                    </div>

                                                    <button className="inline-flex items-center gap-2 px-6 py-3 text-white font-black text-[14px] rounded-2xl transition-all shadow-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-blue-900/40">
                                                        কোর্সে ভর্তি হোন
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                                    </button>
                                                </div>

                                                {/* Right Banner Image */}
                                                <div className="w-full lg:w-[400px] shrink-0 relative">
                                                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#050D1F] to-transparent z-10"></div>
                                                    <img
                                                        src={aiLearningBannerFile ? URL.createObjectURL(aiLearningBannerFile) : (courseData.aiLearningBannerUrl || "/images/ai-banner.png")}
                                                        alt="AI Learning Preview"
                                                        className="w-full h-full object-cover opacity-90 rounded-r-[30px]"
                                                        style={{ minHeight: '300px', maxHeight: '420px' }}
                                                    />
                                                    <div className="absolute top-5 right-5 z-20 flex flex-col gap-2">
                                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-2 text-white text-center shadow-lg">
                                                            <div className="text-xl font-black text-blue-300">{courseData.aiLearningImageBadge1 || 'AI'}</div>
                                                            <div className="text-[10px] font-black text-gray-300 uppercase tracking-wider">{courseData.aiLearningImageBadge2 || 'Driven'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-purple-900 text-base flex items-center gap-2">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                            AI Job Ready Banner details (AI জব রেডি ব্যানার - নিচের অপশন)
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-purple-800">Show Banner (ব্যানার দেখান)</span>
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={courseData.showAiJobReadyBanner}
                                                onClick={() => handleInputChange('showAiJobReadyBanner', !courseData.showAiJobReadyBanner)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${courseData.showAiJobReadyBanner ? 'bg-purple-600' : 'bg-gray-300'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${courseData.showAiJobReadyBanner ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">Small Badge Text (ছোট ব্যাজ টেক্সট)</label>
                                                <input
                                                    type="text"
                                                    value={courseData.aiJobReadyBadge}
                                                    onChange={(e) => handleInputChange('aiJobReadyBadge', e.target.value)}
                                                    placeholder="ক্যারিয়ার রেডি"
                                                    className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-[#1A1D1F]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">Image Badge Text (ইমেজ ব্যাজ টেক্সট)</label>
                                                <input
                                                    type="text"
                                                    value={courseData.aiJobReadyImageBadge}
                                                    onChange={(e) => handleInputChange('aiJobReadyImageBadge', e.target.value)}
                                                    placeholder="Job Ready"
                                                    className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-[#1A1D1F]"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">Title Prefix (শিরোনাম শুরু)</label>
                                                <input
                                                    type="text"
                                                    value={courseData.aiJobReadyTitle1}
                                                    onChange={(e) => handleInputChange('aiJobReadyTitle1', e.target.value)}
                                                    placeholder="কোর্স শেষে আপনি"
                                                    className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-[#1A1D1F]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">Highlighted Text (হাইলাইট টেক্সট)</label>
                                                <input
                                                    type="text"
                                                    value={courseData.aiJobReadyHighlight}
                                                    onChange={(e) => handleInputChange('aiJobReadyHighlight', e.target.value)}
                                                    placeholder="চাকরির জন্য প্রস্তুত"
                                                    className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-[#1A1D1F]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">Title Suffix</label>
                                                <input
                                                    type="text"
                                                    value={courseData.aiJobReadyTitle2}
                                                    onChange={(e) => handleInputChange('aiJobReadyTitle2', e.target.value)}
                                                    placeholder="হয়ে যাবেন"
                                                    className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-[#1A1D1F]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">Details Text Paragraph (বিস্তারিত টেক্সট অনুচ্ছেদ)</label>
                                            <textarea
                                                value={courseData.aiJobReadyDetails}
                                                onChange={(e) => handleInputChange('aiJobReadyDetails', e.target.value)}
                                                placeholder="প্রতিটি মডিউলে real-world project..."
                                                rows={3}
                                                className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-[#1A1D1F] resize-y"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-xs font-bold text-purple-700 uppercase tracking-wider">Background Image (ব্যাকগ্রাউন্ড ইমেজ)</label>
                                                <span className="text-xs text-purple-400 font-medium">Recommended ratio:(520x480px)| JPG, PNG, WEBP (Max 2MB)</span>
                                            </div>
                                            <div className={`relative border-2 border-dashed ${(aiBannerFile || courseData.aiBannerUrl) ? 'border-transparent' : 'border-purple-200'} rounded-xl hover:border-purple-400 transition-colors bg-white text-center overflow-hidden min-h-[150px] flex items-center justify-center`}>
                                                <input
                                                    type="file"
                                                    accept="image/jpeg, image/png, image/webp"
                                                    onChange={e => {
                                                        if (e.target.files && e.target.files.length > 0) {
                                                            const file = e.target.files[0];
                                                            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
                                                            if (!validTypes.includes(file.type)) { alert('Invalid image format.'); return; }
                                                            if (file.size > 2 * 1024 * 1024) { alert('Size exceeds limit.'); return; }
                                                            setAiBannerFile(file);
                                                        }
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                />
                                                {(aiBannerFile || courseData.aiBannerUrl) ? (
                                                    <div className="absolute inset-0 w-full h-full group-thumbnail">
                                                        <img src={aiBannerFile ? URL.createObjectURL(aiBannerFile) : courseData.aiBannerUrl} alt="AI Banner" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10 pointer-events-auto">
                                                            <span className="text-white text-sm font-bold mb-1">Click to change</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pointer-events-none py-6 z-10 text-purple-400">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                                        <span className="text-sm font-bold text-purple-700">Upload AI Banner Image (AI ব্যানার ইমেজ আপলোড করুন)</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* LIVE PREVIEW SECTION */}
                                        <div className="mt-8 relative overflow-hidden rounded-[30px] bg-[#050D1F] border border-purple-900/40 pointer-events-none xl:scale-100 origin-top-left transition-all">
                                            <div className="absolute top-4 left-4 bg-purple-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full z-50 shadow-lg tracking-wider">Live Preview (লাইভ প্রিভিউ)</div>

                                            {/* Glowing Background Orbs */}
                                            <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                                            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px] pointer-events-none"></div>

                                            <div className="relative z-10 flex flex-col lg:flex-row-reverse items-center gap-0">
                                                {/* Text Content */}
                                                <div className="flex-1 p-8 lg:p-10 space-y-6">
                                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-purple-300 text-[11px] font-black rounded-xl border border-white/10 uppercase tracking-wider">
                                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span>
                                                        {courseData.aiJobReadyBadge || 'ক্যারিয়ার রেডি'}
                                                    </span>

                                                    <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight">
                                                        {courseData.aiJobReadyTitle1 || 'কোর্স শেষে আপনি'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{courseData.aiJobReadyHighlight || 'চাকরির জন্য প্রস্তুত'}</span> {courseData.aiJobReadyTitle2 || 'হয়ে যাবেন'}
                                                    </h2>

                                                    <p className="text-gray-400 text-[14px] leading-relaxed font-medium max-w-[480px]">
                                                        {courseData.aiJobReadyDetails || 'প্রতিটি মডিউলে real-world project, AI-assisted coding, এবং expert mentorship — সবকিছু মিলিয়ে আপনাকে industry-ready করে তুলবে।'}
                                                    </p>

                                                    {/* Stats Row */}
                                                    <div className="flex flex-wrap gap-3">
                                                        {[
                                                            { value: '৩৩', label: 'মডিউল' },
                                                            { value: '৭৩', label: 'লাইভ ক্লাস' },
                                                            { value: '১৫+', label: 'প্রজেক্ট' },
                                                        ].map((stat, i) => (
                                                            <div key={i} className="flex flex-col items-center px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl min-w-[75px]">
                                                                <span className="text-xl font-black text-white">{stat.value}</span>
                                                                <span className="text-[10px] font-bold text-gray-400 mt-0.5">{stat.label}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <button
                                                        className="inline-flex items-center gap-2 px-6 py-3 text-white font-black text-[14px] rounded-2xl transition-all shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-purple-900/40"
                                                    >
                                                        এখনই ভর্তি হোন
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                                    </button>
                                                </div>

                                                {/* AI Banner Image */}
                                                <div className="w-full lg:w-[400px] shrink-0 relative">
                                                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#050D1F] to-transparent z-10 pointer-events-none"></div>
                                                    <img
                                                        src={aiBannerFile ? URL.createObjectURL(aiBannerFile) : (courseData.aiBannerUrl || "/images/ai-banner.png")}
                                                        alt="Career Ready Preview"
                                                        className="w-full h-full object-cover opacity-90 rounded-l-[30px]"
                                                        style={{ minHeight: '300px', maxHeight: '420px' }}
                                                    />
                                                    <div className="absolute top-5 left-5 z-20">
                                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-2 text-white text-center shadow-lg">
                                                            <div className="text-xl font-black text-purple-300">🏆</div>
                                                            <div className="text-[10px] font-black text-gray-300 uppercase tracking-wider">{courseData.aiJobReadyImageBadge || 'Job Ready'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        )}

                        {activeTab === 'pricing' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Regular Fee (BDT) (নিয়মিত ফি)</label>
                                        <input
                                            type="number"
                                            value={courseData.regularFee || ''}
                                            onChange={(e) => handleInputChange('regularFee', parseInt(e.target.value) || 0)}
                                            placeholder="30000"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Discount Percentage (%) (ডিসকাউন্ট শতাংশ %)</label>
                                        <input
                                            type="number"
                                            value={courseData.discountPercentage || ''}
                                            onChange={(e) => handleInputChange('discountPercentage', parseInt(e.target.value) || 0)}
                                            placeholder="40"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                                        />
                                    </div>
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
                                                        <option value="">Select a Teacher (শিক্ষক নির্বাচন করুন)</option>
                                                        {teachers.map(t => (
                                                            <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
                                                        ))}
                                                    </select>
                                                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-1 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-lg text-xs font-bold border border-[#6C5DD3]/20">Primary (প্রধান)</span>
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
                                            Add Another Teacher (আরও শিক্ষক যোগ করুন)
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'career' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Career Opportunities (ক্যারিয়ার সুযোগ)</label>
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
                                        <div className="text-sm text-gray-500 py-6 text-center border-2 border-dashed border-gray-100 rounded-xl mb-4 mt-2">No career opportunities added. (কোন ক্যারিয়ার সুযোগ যোগ করা হয়নি)</div>
                                    )}

                                    <button
                                        onClick={() => handleInputChange('careerOpportunities', [...courseData.careerOpportunities, { title: '', description: '' }])}
                                        className="text-sm font-bold text-[#6C5DD3] hover:text-[#5a4cb5] flex items-center gap-1.5 mt-2"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                        Add Opportunity (সুযোগ যোগ করুন)
                                    </button>
                                </div>
                            </div>
                        )}



                        {activeTab === 'extras' && (
                            <div className="space-y-8">
                                {/* Stats Section */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-[#6C5DD3] rounded-full"></span>
                                        Additional Info
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Batch Number (ব্যাচ নম্বর)</label>
                                            <input type="text" value={courseData.batchNumber} onChange={(e) => handleInputChange('batchNumber', e.target.value)} placeholder="e.g. ১১তম ব্যাচ" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Demo Class Section */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-[#6C5DD3] rounded-full"></span>
                                        Demo Class Info (ডেমো ক্লাসের তথ্য)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date (তারিখ)</label>
                                            <input type="text" value={courseData.demoClass.date} onChange={(e) => handleInputChange('demoClass', { ...courseData.demoClass, date: e.target.value })} placeholder="e.g. ৬ই মার্চ" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Time (সময়)</label>
                                            <input type="text" value={courseData.demoClass.time} onChange={(e) => handleInputChange('demoClass', { ...courseData.demoClass, time: e.target.value })} placeholder="e.g. রাত ১০:৩০টা" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Platform (প্ল্যাটফর্ম)</label>
                                            <input type="text" value={courseData.demoClass.platform} onChange={(e) => handleInputChange('demoClass', { ...courseData.demoClass, platform: e.target.value })} placeholder="e.g. Zoom" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]" />
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Youtube Video Links (ভিডিও লিঙ্ক - সর্বোচ্চ ৪টি)</label>
                                        <div className="space-y-3">
                                            {courseData.demoClass.videoUrls?.map((url, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input type="text" value={url} onChange={(e) => { const n = [...(courseData.demoClass.videoUrls || [])]; n[index] = e.target.value; handleInputChange('demoClass', { ...courseData.demoClass, videoUrls: n }); }} placeholder="e.g. https://www.youtube.com/watch?v=..." className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]" />
                                                    <button onClick={() => handleInputChange('demoClass', { ...courseData.demoClass, videoUrls: (courseData.demoClass.videoUrls || []).filter((_, i) => i !== index) })} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => handleInputChange('demoClass', { ...courseData.demoClass, videoUrls: [...(courseData.demoClass.videoUrls || []), ''] })} className="text-sm font-bold text-[#6C5DD3] hover:underline flex items-center gap-1 mt-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>Add Video Link (ভিডিও লিঙ্ক যোগ করুন)</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Tools */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-[#6C5DD3] rounded-full"></span>
                                        Tools & Technologies (টুলস ও টেকনোলজি)
                                    </h3>
                                    <div className="space-y-3">
                                        {courseData.tools.map((tool, index) => (
                                            <div key={index} className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
                                                <div className="flex gap-2">
                                                    <input type="text" value={tool.name} onChange={(e) => { const n = [...courseData.tools]; n[index] = { ...n[index], name: e.target.value }; handleInputChange('tools', n); }} placeholder="e.g. Python, React, Django" className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all text-[#1A1D1F]" />
                                                    <button onClick={() => { handleInputChange('tools', courseData.tools.filter((_, i) => i !== index)); const nf = [...toolImageFiles]; nf.splice(index, 1); setToolImageFiles(nf); }} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {(toolImageFiles[index] || tool.image) && (
                                                        <img src={toolImageFiles[index] ? URL.createObjectURL(toolImageFiles[index]!) : tool.image} alt={tool.name} className="w-12 h-12 object-contain rounded-lg border border-gray-200 bg-white p-1" />
                                                    )}
                                                    <label className="flex-1 cursor-pointer">
                                                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 hover:border-[#6C5DD3] transition-colors">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                                            {toolImageFiles[index] ? toolImageFiles[index]!.name : (tool.image ? 'Change Image (ছবি পরিবর্তন করুন)' : 'Upload Icon/Image (আইকন/ছবি আপলোড করুন)')}
                                                        </div>
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) { const nf = [...toolImageFiles]; while (nf.length <= index) nf.push(null); nf[index] = e.target.files[0]; setToolImageFiles(nf); } }} />
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                        {courseData.tools.length === 0 && <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-gray-100">No tools added yet. (এখন পর্যন্ত কোন টুল যোগ করা হয়নি)</div>}
                                        <button onClick={() => { setCourseData(prev => ({ ...prev, tools: [...prev.tools, { name: '', image: '' }] })); setToolImageFiles(prev => [...prev, null]); }} className="text-sm font-bold text-[#6C5DD3] hover:underline flex items-center gap-1 mt-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>Add Tool (টুল যোগ করুন)</button>
                                    </div>
                                </div>

                                {/* What You Will Learn */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-[#6C5DD3] rounded-full"></span>
                                        What You Will Learn (এই কোর্সে যা শিখবেন)
                                    </h3>
                                    <div className="space-y-3">
                                        {courseData.whatYouWillLearn.map((item, index) => (
                                            <div key={index} className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
                                                <div className="flex gap-2">
                                                    <input type="text" value={item.text} onChange={(e) => { const n = [...courseData.whatYouWillLearn]; n[index] = { ...n[index], text: e.target.value }; handleInputChange('whatYouWillLearn', n); }} placeholder="e.g. পাইথন প্রোগ্রামিং শিখবেন" className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all text-[#1A1D1F]" />
                                                    <button onClick={() => { handleInputChange('whatYouWillLearn', courseData.whatYouWillLearn.filter((_, i) => i !== index)); const nf = [...learnItemIconFiles]; nf.splice(index, 1); setLearnItemIconFiles(nf); }} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {(learnItemIconFiles[index] || item.icon) && (
                                                        <img src={learnItemIconFiles[index] ? URL.createObjectURL(learnItemIconFiles[index]!) : item.icon} alt="Icon" className="w-12 h-12 object-contain rounded-lg border border-gray-200 bg-white p-1" />
                                                    )}
                                                    <label className="flex-1 cursor-pointer">
                                                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 hover:border-[#6C5DD3] transition-colors">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                                            {learnItemIconFiles[index] ? learnItemIconFiles[index]!.name : (item.icon ? 'Change Icon (আইকন পরিবর্তন করুন)' : 'Upload Icon/Image (আইকন/ছবি আপলোড করুন)')}
                                                        </div>
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) { const nf = [...learnItemIconFiles]; while (nf.length <= index) nf.push(null); nf[index] = e.target.files[0]; setLearnItemIconFiles(nf); } }} />
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                        {courseData.whatYouWillLearn.length === 0 && <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-gray-100">No items added yet. (এখন পর্যন্ত কোন আইটেম যোগ করা হয়নি)</div>}
                                        <button onClick={() => { setCourseData(prev => ({ ...prev, whatYouWillLearn: [...prev.whatYouWillLearn, { text: '', icon: '' }] })); setLearnItemIconFiles(prev => [...prev, null]); }} className="text-sm font-bold text-[#6C5DD3] hover:underline flex items-center gap-1 mt-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>Add Item (আইটেম যোগ করুন)</button>
                                    </div>
                                </div>

                                {/* Benefits */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-[#6C5DD3] rounded-full"></span>
                                        Course Benefits (কোর্সের সুবিধা সমূহ)
                                    </h3>
                                    <div className="space-y-3">
                                        {courseData.benefits.map((benefit, index) => (
                                            <div key={index} className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
                                                <div className="grid grid-cols-4 gap-2">
                                                    <input type="text" value={benefit.icon} onChange={(e) => { const n = [...courseData.benefits]; n[index] = { ...n[index], icon: e.target.value }; handleInputChange('benefits', n); }} placeholder="🗓️ (Text Icon)" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 text-center" />
                                                    <input type="text" value={benefit.title} onChange={(e) => { const n = [...courseData.benefits]; n[index] = { ...n[index], title: e.target.value }; handleInputChange('benefits', n); }} placeholder="Title" className="col-span-3 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <input type="text" value={benefit.subtitle} onChange={(e) => { const n = [...courseData.benefits]; n[index] = { ...n[index], subtitle: e.target.value }; handleInputChange('benefits', n); }} placeholder="Subtitle" className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20" />
                                                    <button onClick={() => { handleInputChange('benefits', courseData.benefits.filter((_, i) => i !== index)); const nf = [...benefitIconFiles]; nf.splice(index, 1); setBenefitIconFiles(nf); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {(benefitIconFiles[index] || (benefit.icon && benefit.icon.startsWith('http'))) && (
                                                        <img src={benefitIconFiles[index] ? URL.createObjectURL(benefitIconFiles[index]!) : benefit.icon} alt="Benefit" className="w-12 h-12 object-contain rounded-lg border border-gray-200 bg-white p-1" />
                                                    )}
                                                    <label className="flex-1 cursor-pointer">
                                                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 hover:border-[#6C5DD3] transition-colors">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                                            {benefitIconFiles[index] ? benefitIconFiles[index]!.name : (benefit.icon && benefit.icon.startsWith('http') ? 'Change Image (ছবি পরিবর্তন করুন)' : 'Upload Image (ছবি আপলোড করুন)')}
                                                        </div>
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) { const nf = [...benefitIconFiles]; while (nf.length <= index) nf.push(null); nf[index] = e.target.files[0]; setBenefitIconFiles(nf); } }} />
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                        {courseData.benefits.length === 0 && <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-gray-100">No benefits added yet. (এখন পর্যন্ত কোন সুবিধা যোগ করা হয়নি)</div>}
                                        <button onClick={() => { handleInputChange('benefits', [...courseData.benefits, { icon: '', title: '', subtitle: '' }]); setBenefitIconFiles(prev => [...prev, null]); }} className="text-sm font-bold text-[#6C5DD3] hover:underline flex items-center gap-1 mt-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>Add Benefit (সুবিধা যোগ করুন)</button>
                                    </div>
                                </div>

                                {/* Success Stories */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-[#6C5DD3] rounded-full"></span>
                                        Success Stories (সাফল্যের গল্প)
                                    </h3>
                                    <div className="space-y-2">
                                        {courseData.successStories.map((story, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input type="text" value={story.name} onChange={(e) => { const n = [...courseData.successStories]; n[index] = { ...n[index], name: e.target.value }; handleInputChange('successStories', n); }} placeholder="Student Name" className="w-1/3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]" />
                                                <input type="text" value={story.role} onChange={(e) => { const n = [...courseData.successStories]; n[index] = { ...n[index], role: e.target.value }; handleInputChange('successStories', n); }} placeholder="Description" className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]" />
                                                <button onClick={() => handleInputChange('successStories', courseData.successStories.filter((_, i) => i !== index))} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                                            </div>
                                        ))}
                                        {courseData.successStories.length === 0 && <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-gray-100">No success stories added yet. (এখন পর্যন্ত কোন সাফল্যের গল্প যোগ করা হয়নি)</div>}
                                        <button onClick={() => handleInputChange('successStories', [...courseData.successStories, { name: '', role: '' }])} className="text-sm font-bold text-[#6C5DD3] hover:underline flex items-center gap-1 mt-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>Add Story (গল্প যোগ করুন)</button>
                                    </div>
                                </div>

                                {/* Testimonials */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-[#6C5DD3] rounded-full"></span>
                                        Testimonials / Reviews (রিভিউসমূহ)
                                    </h3>
                                    <div className="space-y-3">
                                        {courseData.testimonials.map((review, index) => (
                                            <div key={index} className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
                                                <input type="text" value={review.name} onChange={(e) => { const n = [...courseData.testimonials]; n[index] = { ...n[index], name: e.target.value }; handleInputChange('testimonials', n); }} placeholder="Reviewer Name" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20" />
                                                <div className="flex gap-2">
                                                    <textarea rows={2} value={review.text} onChange={(e) => { const n = [...courseData.testimonials]; n[index] = { ...n[index], text: e.target.value }; handleInputChange('testimonials', n); }} placeholder="Review text..." className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 resize-none"></textarea>
                                                    <button onClick={() => handleInputChange('testimonials', courseData.testimonials.filter((_, i) => i !== index))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                                                </div>
                                            </div>
                                        ))}
                                        {courseData.testimonials.length === 0 && <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-gray-100">No testimonials added yet. (এখন পর্যন্ত কোন রিভিউ যোগ করা হয়নি)</div>}
                                        <button onClick={() => handleInputChange('testimonials', [...courseData.testimonials, { text: '', name: '' }])} className="text-sm font-bold text-[#6C5DD3] hover:underline flex items-center gap-1 mt-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>Add Testimonial (রিভিউ যোগ করুন)</button>
                                    </div>
                                </div>

                                {/* FAQs */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-[#6C5DD3] rounded-full"></span>
                                        FAQs (সাধারণ জিজ্ঞাসা)
                                    </h3>
                                    <div className="space-y-3">
                                        {courseData.faqs.map((faq, index) => (
                                            <div key={index} className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
                                                <input type="text" value={faq.question} onChange={(e) => { const n = [...courseData.faqs]; n[index] = { ...n[index], question: e.target.value }; handleInputChange('faqs', n); }} placeholder="Question" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20" />
                                                <div className="flex gap-2">
                                                    <textarea rows={2} value={faq.answer} onChange={(e) => { const n = [...courseData.faqs]; n[index] = { ...n[index], answer: e.target.value }; handleInputChange('faqs', n); }} placeholder="Answer..." className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 resize-none"></textarea>
                                                    <button onClick={() => handleInputChange('faqs', courseData.faqs.filter((_, i) => i !== index))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                                                </div>
                                            </div>
                                        ))}
                                        {courseData.faqs.length === 0 && <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-gray-100">No FAQs added yet. (এখন পর্যন্ত কোন প্রশ্ন যোগ করা হয়নি)</div>}
                                        <button onClick={() => handleInputChange('faqs', [...courseData.faqs, { question: '', answer: '' }])} className="text-sm font-bold text-[#6C5DD3] hover:underline flex items-center gap-1 mt-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>Add FAQ (প্রশ্ন যোগ করুন)</button>
                                    </div>
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
                                disabled={activeTab === 'extras'}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${activeTab === 'extras' ? 'opacity-0 pointer-events-none w-0 h-0 overflow-hidden' : 'bg-[#6C5DD3] text-white shadow-[#6C5DD3]/25 shadow-lg hover:shadow-xl hover:bg-[#5a4cb5]'}`}
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
                                    <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-bold border border-white/20 shadow-sm">Courses</span>
                                    <span className="px-2.5 py-1 backdrop-blur-md rounded-lg text-white text-[10px] font-bold border border-white/20 bg-[#8E8AFF]/40 shadow-sm">{courseData.courseMode === 'Online Class' ? 'Online' : courseData.courseMode === 'Offline Class' ? 'Offline' : "Hybrid"}</span>
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
                                    <span className="text-lg font-bold text-[#1A1D1F]">
                                        ৳{courseData.regularFee || "0.00"}
                                    </span>
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
        </div >
    );
}
