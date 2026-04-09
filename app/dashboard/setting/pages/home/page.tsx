'use client';

import React, { useState, useEffect } from 'react';
import HeroSlidePreview from '@/app/components/HeroSlidePreview';
import { toast, Toaster } from 'react-hot-toast';

interface IHeroSlide {
    _id?: string;
    tag: string;
    title: string;
    highlight: string;
    description: string;
    primaryBtn: string;
    secondaryBtn: string;
    image: string;
    color: string;
    order: number;
    isActive: boolean;
}

interface IFreeClass {
    _id?: string;
    title: string;
    subtitle: string;
    category: string;
    time: string;
    color: string;
    link: string;
    order: number;
}

interface ITestimonial {
    _id?: string;
    studentName: string;
    courseName: string;
    textFeedback: string;
    videoUrl: string;
    image: string;
    avatar: string;
    order: number;
}

const DEFAULT_SLIDE: IHeroSlide = {
    tag: "NEXT-GEN LEARNING",
    title: "Master AI-Driven Development",
    highlight: "AI-Driven",
    description: "Harness the power of Artificial Intelligence to build faster, smarter, and more efficient applications.",
    primaryBtn: "Start AI Journey",
    secondaryBtn: "Free AI Workshop",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
    color: "#6C5DD3",
    order: 0,
    isActive: true
};

export default function HomePageSettings() {
    const [activeTab, setActiveTab] = useState<'hero' | 'free-classes' | 'testimonials'>('hero');
    const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
    
    // Hero Slides State
    const [slides, setSlides] = useState<IHeroSlide[]>([]);
    const [editingSlide, setEditingSlide] = useState<IHeroSlide>(DEFAULT_SLIDE);
    const [isEditing, setIsEditing] = useState(false);
    
    // Free Classes State
    const [freeClasses, setFreeClasses] = useState<IFreeClass[]>([]);
    const [currentFreeClass, setCurrentFreeClass] = useState<IFreeClass | null>(null);
    const [freeClassView, setFreeClassView] = useState<'list' | 'add' | 'edit'>('list');

    // Testimonials State
    const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
    const [currentTestimonial, setCurrentTestimonial] = useState<ITestimonial | null>(null);
    const [testimonialView, setTestimonialView] = useState<'list' | 'add' | 'edit'>('list');
    
    // Site Settings State (for legacy purposes or general settings)
    const [siteSettings, setSiteSettings] = useState<any>(null);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchSlides();
        fetchSettings();
    }, []);

    const fetchSlides = async () => {
        try {
            const res = await fetch('/api/hero');
            const data = await res.json();
            if (data.success) {
                setSlides(data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch slides");
        }
    };

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data.success) {
                setSiteSettings(data.data);
                setFreeClasses(data.data.freeClasses || []);
                
                // Ensure exactly 4 testimonials
                let loadedTestimonials = data.data.testimonials || [];
                if (loadedTestimonials.length < 4) {
                    const padding = 4 - loadedTestimonials.length;
                    for (let i = 0; i < padding; i++) {
                        loadedTestimonials.push({ 
                            studentName: '', 
                            courseName: '', 
                            textFeedback: '', 
                            videoUrl: '', 
                            image: '', 
                            avatar: '', 
                            order: loadedTestimonials.length 
                        });
                    }
                } else if (loadedTestimonials.length > 4) {
                    loadedTestimonials = loadedTestimonials.slice(0, 4);
                }
                setTestimonials(loadedTestimonials);
            }
        } catch (error) {
            toast.error("Failed to fetch settings");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'hero' | 'testimonial' | 'avatar' | 'video' = 'hero') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation for video if target is video
        if (target === 'video' && !file.type.startsWith('video/')) {
            toast.error("Please upload a valid video file (.mp4)");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                if (target === 'hero') {
                    setEditingSlide(prev => ({ ...prev, image: data.url }));
                }
                toast.success(target === 'video' ? "Video uploaded!" : "File uploaded!");
                return data.url;
            } else {
                toast.error(data.message || "Upload failed");
            }
        } catch (error) {
            toast.error("Error uploading file");
        } finally {
            setUploading(false);
        }
        return null;
    };

    const handleSubmitHero = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const method = isEditing ? 'PATCH' : 'POST';
        const url = isEditing ? `/api/hero/${editingSlide._id}` : '/api/hero';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingSlide),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(isEditing ? "Slide updated!" : "Slide added!");
                setEditingSlide(DEFAULT_SLIDE);
                setIsEditing(false);
                setView('list');
                fetchSlides();
            } else {
                toast.error(data.message || "Save failed");
            }
        } catch (error) {
            toast.error("Error saving slide");
        } finally {
            setSaving(false);
        }
    };

    const saveSiteSettings = async (updatedFields: any) => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFields),
            });
            const data = await res.json();
            if (data.success) {
                setSiteSettings(data.data);
                // Important: Ensure we update state with fresh data from server
                if (data.data.freeClasses) setFreeClasses(data.data.freeClasses);
                if (data.data.testimonials) setTestimonials(data.data.testimonials);
                toast.success("Settings saved!");
                return true;
            } else {
                toast.error(data.message || "Failed to save settings");
            }
        } catch (error) {
            toast.error("Error saving settings");
        } finally {
            setSaving(false);
        }
        return false;
    };

    const handleEditHero = (slide: IHeroSlide) => {
        setEditingSlide(slide);
        setIsEditing(true);
        setView('edit');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddNewHero = () => {
        setEditingSlide(DEFAULT_SLIDE);
        setIsEditing(false);
        setView('add');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteHero = async (id: string) => {
        if (!confirm("Are you sure you want to delete this slide?")) return;

        try {
            const res = await fetch(`/api/hero/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                toast.success("Slide deleted");
                fetchSlides();
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    // Free Classes Handlers
    const handleAddFreeClass = () => {
        setCurrentFreeClass({ title: '', subtitle: '', category: '', time: '', color: 'from-blue-500 to-indigo-500', link: '#', order: freeClasses.length });
        setFreeClassView('add');
    };

    const handleEditFreeClass = (item: IFreeClass) => {
        setCurrentFreeClass({ ...item });
        setFreeClassView('edit');
    };

    const handleSaveFreeClass = async () => {
        if (!currentFreeClass?.title) return toast.error("Title is required");
        
        // Final sanity check: ensure we have an array
        const baseClasses = Array.isArray(freeClasses) ? freeClasses : [];
        
        let updatedClasses;
        if (freeClassView === 'edit' && currentFreeClass._id) {
            // Updating an existing class from server
            updatedClasses = baseClasses.map(c => c._id === currentFreeClass._id ? currentFreeClass : c);
        } else if (freeClassView === 'edit' && !currentFreeClass._id) {
            // Updating a class that was added this session but not saved/ID'd yet?
            // Fallback to title matching if ID is missing (not ideal but works for session data)
            updatedClasses = baseClasses.map(c => c.title === currentFreeClass.title ? currentFreeClass : c);
        } else {
            // Adding a brand new class
            updatedClasses = [...baseClasses, currentFreeClass];
        }

        const success = await saveSiteSettings({ freeClasses: updatedClasses });
        if (success) {
            setFreeClassView('list');
            setCurrentFreeClass(null);
        }
    };

    const handleDeleteFreeClass = async (index: number) => {
        if (!confirm("Delete this class?")) return;
        const updatedClasses = freeClasses.filter((_, i) => i !== index);
        await saveSiteSettings({ freeClasses: updatedClasses });
    };

    // Testimonials Handlers
    const handleAddTestimonial = () => {
        setCurrentTestimonial({ studentName: '', courseName: '', textFeedback: '', videoUrl: '', image: '', avatar: '', order: testimonials.length });
        setTestimonialView('add');
    };

    const handleEditTestimonial = (item: ITestimonial) => {
        setCurrentTestimonial({ ...item });
        setTestimonialView('edit');
    };

    const handleSaveTestimonial = async () => {
        if (!currentTestimonial?.studentName) return toast.error("Student name is required");
        
        const baseTestimonials = Array.isArray(testimonials) ? testimonials : [];
        
        const updatedTestimonials = baseTestimonials.map((t, idx) => {
            if (idx === currentTestimonial.order) return currentTestimonial;
            return t;
        });

        const success = await saveSiteSettings({ testimonials: updatedTestimonials });
        if (success) {
            setTestimonialView('list');
            setCurrentTestimonial(null);
        }
    };

    const handleDeleteTestimonial = async (index: number) => {
        // Function no longer used for fixed 4 system, but kept for logic safety
        toast.error("Deleting testimonials is no longer allowed. Please just edit them.");
    };

    return (
        <div className="space-y-8 pb-10">
            <Toaster position="top-right" />

            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Home Page Settings</h1>
                        <p className="text-gray-500 font-medium">Manage all sections of your home page</p>
                    </div>
                </div>
                
                {/* Tab Navigation */}
                <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl w-fit">
                    {[
                        { id: 'hero', label: 'Hero Slides', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
                        { id: 'free-classes', label: 'Free Classes', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                        { id: 'testimonials', label: 'Testimonials', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id as any); setView('list'); }}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id 
                                ? 'bg-white text-[#6C5DD3] shadow-md' 
                                : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={tab.icon} /></svg>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════
                HERO SLIDES TAB
                ═══════════════════════════════════════ */}
            {activeTab === 'hero' && (
                <>
                    <div className="flex justify-end pr-2">
                        {view === 'list' ? (
                            <button
                                onClick={handleAddNewHero}
                                className="px-6 py-3 bg-[#6C5DD3] text-white rounded-2xl text-sm font-black shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5b4eb3] transition-all flex items-center gap-2 group"
                            >
                                <svg className="group-hover:rotate-90 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                ADD NEW SLIDE
                            </button>
                        ) : (
                            <button
                                onClick={() => setView('list')}
                                className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl text-sm font-black hover:bg-gray-50 transition-all flex items-center gap-2"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                                BACK TO LIST
                            </button>
                        )}
                    </div>

                    {view !== 'list' && (
                        <div className="flex flex-col gap-8 animate-fade-in">
                            {/* Top: Live Preview */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-bold text-gray-900">Live Preview</h2>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase tracking-widest">Real-time</span>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                                        </div>
                                        <p className="text-[12px] text-blue-700 font-medium">
                                            Desktop version preview.
                                        </p>
                                    </div>
                                </div>

                                {/* Preview Container mirroring home page hero section exactly */}
                                <div className="w-full bg-[#0F1117] rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-gray-800">
                                    <div className="w-full aspect-[21/9] md:aspect-[16/7] min-h-[400px]">
                                        <HeroSlidePreview slide={editingSlide} isActive={true} />
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col gap-8">
                                <div className="flex items-center justify-between border-b pb-6">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {view === 'edit' ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                                    </h2>
                                </div>

                                <form onSubmit={handleSubmitHero} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Tagline</label>
                                            <input
                                                type="text"
                                                value={editingSlide.tag}
                                                onChange={e => setEditingSlide({ ...editingSlide, tag: e.target.value })}
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm transition-all"
                                                placeholder="e.g. NEXT-GEN LEARNING"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Highlight Text</label>
                                            <input
                                                type="text"
                                                value={editingSlide.highlight}
                                                onChange={e => setEditingSlide({ ...editingSlide, highlight: e.target.value })}
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm transition-all"
                                                placeholder="Text to highlight/outline"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Theme Color</label>
                                            <div className="flex gap-3">
                                                <div className="relative group">
                                                    <input
                                                        type="color"
                                                        value={editingSlide.color}
                                                        onChange={e => setEditingSlide({ ...editingSlide, color: e.target.value })}
                                                        className="h-[52px] w-[52px] rounded-2xl border-2 border-gray-100 outline-none cursor-pointer p-1 bg-white"
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={editingSlide.color}
                                                    onChange={e => setEditingSlide({ ...editingSlide, color: e.target.value })}
                                                    className="flex-1 px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm uppercase transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Title</label>
                                        <input
                                            type="text"
                                            value={editingSlide.title}
                                            onChange={e => setEditingSlide({ ...editingSlide, title: e.target.value })}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm transition-all"
                                            placeholder="Main headline text"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
                                        <textarea
                                            value={editingSlide.description}
                                            onChange={e => setEditingSlide({ ...editingSlide, description: e.target.value })}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm h-28 resize-none transition-all"
                                            placeholder="Brief description of the slide..."
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Primary Button</label>
                                            <input
                                                type="text"
                                                value={editingSlide.primaryBtn}
                                                onChange={e => setEditingSlide({ ...editingSlide, primaryBtn: e.target.value })}
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Secondary Button</label>
                                            <input
                                                type="text"
                                                value={editingSlide.secondaryBtn}
                                                onChange={e => setEditingSlide({ ...editingSlide, secondaryBtn: e.target.value })}
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Slide Image</label>
                                        <div className="flex flex-wrap items-center gap-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                            <div className="w-32 h-20 rounded-xl overflow-hidden bg-gray-200 border border-gray-200 shrink-0">
                                                <img src={editingSlide.image} className="w-full h-full object-cover" alt="Preview" />
                                            </div>
                                            <div className="flex-1 min-w-[200px]">
                                                <input
                                                    type="file"
                                                    onChange={handleFileUpload}
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#6C5DD3] file:text-white hover:file:bg-[#5b4eb3] cursor-pointer"
                                                    accept="image/*"
                                                />
                                            </div>
                                            {uploading && (
                                                <div className="flex items-center gap-2 text-[#6C5DD3]">
                                                    <div className="w-5 h-5 border-2 border-[#6C5DD3] border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="text-sm font-black">UPLOADING...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={saving || uploading}
                                            className="w-full bg-[#6C5DD3] text-white text-lg font-black py-5 rounded-[2rem] hover:bg-[#5b4eb3] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-[#6C5DD3]/20"
                                        >
                                            {saving ? (
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>SAVING CHANGES...</span>
                                                </div>
                                            ) : (
                                                view === 'edit' ? 'UPDATE HERO SLIDE' : 'ADD NEW HERO SLIDE'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Slide List */}
                    {view === 'list' && (
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 animate-fade-in">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl font-black text-gray-900">Existing Slides</h2>
                                <div className="px-5 py-2 bg-gray-50 rounded-full border border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    {slides.length} SLIDES TOTAL
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-24 gap-4">
                                    <div className="w-12 h-12 border-4 border-[#6C5DD3] border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-gray-400 font-black text-sm uppercase tracking-widest">Loading Slides...</p>
                                </div>
                            ) : slides.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 gap-6 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-100/50 transition-colors group" onClick={handleAddNewHero}>
                                    <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:scale-110 group-hover:text-[#6C5DD3] transition-all">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-black text-gray-900 mb-2">No slides added yet</h3>
                                        <p className="text-gray-500 font-medium">Click the button above or here to create your first hero slide.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {slides.map(slide => (
                                        <div key={slide._id} className="group border-2 border-gray-50 rounded-[2rem] overflow-hidden bg-white hover:border-[#6C5DD3]/20 hover:shadow-2xl hover:shadow-[#6C5DD3]/10 transition-all duration-500">
                                            <div className="h-56 bg-gray-100 relative overflow-hidden">
                                                <img src={slide.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={slide.title} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4">
                                                    <button
                                                        onClick={() => handleEditHero(slide)}
                                                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#6C5DD3] hover:scale-110 active:scale-95 transition-all shadow-xl font-black uppercase"
                                                    >
                                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteHero(slide._id!)}
                                                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 hover:scale-110 active:scale-95 transition-all shadow-xl"
                                                    >
                                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                                    </button>
                                                </div>
                                                <div className="absolute top-4 left-4 pr-3 pl-1.5 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-[10px] text-white font-black uppercase tracking-widest flex items-center gap-2 border border-white/10">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                                    ORDER: {slide.order}
                                                </div>
                                            </div>
                                            <div className="p-6 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                        {slide.tag}
                                                    </span>
                                                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: slide.color }}></div>
                                                </div>
                                                <h3 className="font-black text-[#1A1D1F] text-lg line-clamp-1 group-hover:text-[#6C5DD3] transition-colors">{slide.title}</h3>
                                                <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed">{slide.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
            {/* ═══════════════════════════════════════
                FREE CLASSES TAB
                ═══════════════════════════════════════ */}
            {activeTab === 'free-classes' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Manage Free Classes</h2>
                                <p className="text-gray-500 font-medium">Add or edit classes shown in the free section</p>
                            </div>
                            {freeClassView === 'list' ? (
                                <button
                                    onClick={handleAddFreeClass}
                                    className="px-6 py-3 bg-[#6C5DD3] text-white rounded-2xl text-sm font-black shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5b4eb3] transition-all flex items-center gap-2 group"
                                >
                                    <svg className="group-hover:rotate-90 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    ADD NEW CLASS
                                </button>
                            ) : (
                                <button
                                    onClick={() => setFreeClassView('list')}
                                    className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl text-sm font-black hover:bg-gray-50 transition-all flex items-center gap-2"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                                    BACK TO LIST
                                </button>
                            )}
                        </div>

                        {freeClassView === 'list' ? (
                            <div className="grid grid-cols-1 gap-4">
                                {freeClasses.length > 0 ? (
                                    freeClasses.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 group hover:border-[#6C5DD3]/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-sm`}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 6.253v13" /></svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-gray-900">{item.title}</h3>
                                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{item.subtitle} • {item.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditFreeClass(item)}
                                                    className="p-3 bg-white text-[#6C5DD3] rounded-xl hover:bg-[#6C5DD3] hover:text-white transition-all shadow-sm border border-gray-100"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteFreeClass(index)}
                                                    className="p-3 bg-white text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm border border-gray-100"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                                        <p className="text-gray-400 font-black uppercase tracking-widest">No free classes added yet</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={(e) => { e.preventDefault(); handleSaveFreeClass(); }} className="space-y-8 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Class Title</label>
                                        <input
                                            type="text"
                                            value={currentFreeClass?.title}
                                            onChange={e => setCurrentFreeClass({ ...currentFreeClass!, title: e.target.value })}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm transition-all font-bold"
                                            placeholder="e.g. AI Automation with Python"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Subtitle / Type</label>
                                        <input
                                            type="text"
                                            value={currentFreeClass?.subtitle}
                                            onChange={e => setCurrentFreeClass({ ...currentFreeClass!, subtitle: e.target.value })}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm transition-all font-bold"
                                            placeholder="e.g. Workshop"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
                                        <input
                                            type="text"
                                            value={currentFreeClass?.category}
                                            onChange={e => setCurrentFreeClass({ ...currentFreeClass!, category: e.target.value })}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm transition-all font-bold"
                                            placeholder="e.g. Python"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Time / Schedule</label>
                                        <input
                                            type="text"
                                            value={currentFreeClass?.time}
                                            onChange={e => setCurrentFreeClass({ ...currentFreeClass!, time: e.target.value })}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm transition-all font-bold"
                                            placeholder="e.g. Today • 9:00 PM"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Enroll Button Link</label>
                                        <input
                                            type="text"
                                            value={currentFreeClass?.link}
                                            onChange={e => setCurrentFreeClass({ ...currentFreeClass!, link: e.target.value })}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm transition-all font-bold"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Gradient Theme</label>
                                        <select
                                            value={currentFreeClass?.color}
                                            onChange={e => setCurrentFreeClass({ ...currentFreeClass!, color: e.target.value })}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm transition-all font-bold"
                                        >
                                            <option value="from-blue-500 to-indigo-500">Blue & Indigo</option>
                                            <option value="from-yellow-400 to-orange-500">Yellow & Orange</option>
                                            <option value="from-emerald-400 to-teal-500">Emerald & Teal</option>
                                            <option value="from-indigo-400 to-purple-500">Indigo & Purple</option>
                                            <option value="from-rose-400 to-pink-500">Rose & Pink</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full bg-[#6C5DD3] text-white text-lg font-black py-5 rounded-[2rem] hover:bg-[#5b4eb3] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-[#6C5DD3]/20"
                                    >
                                        {saving ? 'SAVING...' : freeClassView === 'edit' ? 'UPDATE CLASS' : 'ADD CLASS'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════
                TESTIMONIALS TAB
                ═══════════════════════════════════════ */}
            {activeTab === 'testimonials' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Manage Testimonials</h2>
                                <p className="text-gray-500 font-medium tracking-tight">You have a fixed set of 4 premium video testimonials.</p>
                            </div>
                            {testimonialView !== 'list' && (
                                <button
                                    onClick={() => setTestimonialView('list')}
                                    className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl text-sm font-black hover:bg-gray-50 transition-all flex items-center gap-2"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                                    BACK TO LIST
                                </button>
                            )}
                        </div>

                        {testimonialView === 'list' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {testimonials.map((item, index) => (
                                    <div key={index} className="group border-2 border-gray-50 rounded-[2rem] overflow-hidden bg-white hover:border-[#6C5DD3]/20 hover:shadow-2xl hover:shadow-[#6C5DD3]/10 transition-all duration-500 flex flex-col h-full">
                                        <div className="h-64 bg-gray-100 relative overflow-hidden shrink-0">
                                            {item.image ? (
                                                <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.studentName} />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Testimonial {index + 1}</span>
                                                    <p className="text-[8px] text-gray-300 font-bold uppercase mt-1">Not yet configured</p>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                                                <div>
                                                    <p className="text-white font-black text-sm">{item.studentName || `Testimonial ${index + 1}`}</p>
                                                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">{item.courseName || "Slot Available"}</p>
                                                </div>
                                            </div>
                                            <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => { setCurrentTestimonial({ ...item, order: index }); setTestimonialView('edit'); }} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#6C5DD3] hover:scale-110 transition-all shadow-xl font-black uppercase"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></button>
                                            </div>
                                            {item.videoUrl && (
                                                <div className="absolute top-4 left-4">
                                                    <div className="px-2 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-lg text-[8px] text-white font-black uppercase tracking-widest flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                                        MP4 LOADED
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <p className="text-xs text-gray-500 line-clamp-3 font-medium italic">"{item.textFeedback || "Click edit to add feedback text for your student."}"</p>
                                            <div className="pt-4 mt-4 border-t border-gray-50 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0 overflow-hidden">
                                                    <img src={item.avatar || `https://ui-avatars.com/api/?name=${item.studentName || 'User'}&background=random`} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">POSITION {index + 1}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <form onSubmit={(e) => { e.preventDefault(); handleSaveTestimonial(); }} className="space-y-8 animate-fade-in">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">Student Name</label>
                                                <input
                                                    type="text"
                                                    value={currentTestimonial?.studentName}
                                                    onChange={e => setCurrentTestimonial({ ...currentTestimonial!, studentName: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm transition-all font-bold"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">Course Name</label>
                                                <input
                                                    type="text"
                                                    value={currentTestimonial?.courseName}
                                                    onChange={e => setCurrentTestimonial({ ...currentTestimonial!, courseName: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm transition-all font-bold"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Text Feedback</label>
                                            <textarea
                                                value={currentTestimonial?.textFeedback}
                                                onChange={e => setCurrentTestimonial({ ...currentTestimonial!, textFeedback: e.target.value })}
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm transition-all font-bold h-32 resize-none"
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Testimonial Video (.mp4)</label>
                                            <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col gap-4">
                                                {currentTestimonial?.videoUrl ? (
                                                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-gray-800">
                                                        <video src={currentTestimonial.videoUrl} className="w-full h-full object-contain" controls />
                                                        <div className="absolute top-3 right-3">
                                                            <div className="bg-green-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">UPLOADED</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="aspect-video rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-2">
                                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                                                        <span className="text-xs font-bold uppercase tracking-widest">No video uploaded</span>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    onChange={async (e) => {
                                                        const url = await handleFileUpload(e, 'video');
                                                        if (url) setCurrentTestimonial({ ...currentTestimonial!, videoUrl: url });
                                                    }}
                                                    className="text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#6C5DD3] file:text-white hover:file:bg-[#5b4eb3] cursor-pointer"
                                                    accept="video/mp4"
                                                />
                                                <p className="text-[10px] text-gray-400 font-medium ml-1">Upload a 9:16 vertical video for best results.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Feature Thumbnail (9:16)</label>
                                            <div className="flex flex-wrap items-center gap-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                                <div className="w-24 h-32 rounded-2xl overflow-hidden bg-gray-200 border border-gray-200 shrink-0">
                                                    <img src={currentTestimonial?.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"} className="w-full h-full object-cover" alt="Preview" />
                                                </div>
                                                <div className="flex-1 min-w-[200px] space-y-3">
                                                    <input
                                                        type="file"
                                                        onChange={async (e) => {
                                                            const url = await handleFileUpload(e, 'testimonial');
                                                            if (url) setCurrentTestimonial({ ...currentTestimonial!, image: url });
                                                        }}
                                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#6C5DD3] file:text-white hover:file:bg-[#5b4eb3] cursor-pointer"
                                                        accept="image/*"
                                                    />
                                                    <p className="text-[10px] text-gray-400 font-medium">This image will be shown as the video thumbnail.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full bg-[#6C5DD3] text-white text-lg font-black py-5 rounded-[2rem] hover:bg-[#5b4eb3] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-[#6C5DD3]/20"
                                    >
                                        {saving ? 'SAVING...' : testimonialView === 'edit' ? 'UPDATE TESTIMONIAL' : 'ADD TESTIMONIAL'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scan {
                    0% { top: -10%; }
                    100% { top: 110%; }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }
                .animate-scan {
                    animation: scan 4s linear infinite;
                }
            `}</style>
        </div>
    );
}
