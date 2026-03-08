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
    const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
    const [slides, setSlides] = useState<IHeroSlide[]>([]);
    const [editingSlide, setEditingSlide] = useState<IHeroSlide>(DEFAULT_SLIDE);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchSlides();
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
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

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
                setEditingSlide(prev => ({ ...prev, image: data.url }));
                toast.success("Image uploaded!");
            } else {
                toast.error(data.message || "Upload failed");
            }
        } catch (error) {
            toast.error("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
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

    const handleEdit = (slide: IHeroSlide) => {
        setEditingSlide(slide);
        setIsEditing(true);
        setView('edit');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddNew = () => {
        setEditingSlide(DEFAULT_SLIDE);
        setIsEditing(false);
        setView('add');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
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

    return (
        <div className="space-y-8 pb-10">
            <Toaster position="top-right" />

            <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Home Page Settings</h1>
                    <p className="text-gray-500 font-medium">Manage Hero Carousel Slides</p>
                </div>
                {view === 'list' ? (
                    <button
                        onClick={handleAddNew}
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

                        <form onSubmit={handleSubmit} className="space-y-8">
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
                        <div className="flex flex-col items-center justify-center py-24 gap-6 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-100/50 transition-colors group" onClick={handleAddNew}>
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
                                                onClick={() => handleEdit(slide)}
                                                className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#6C5DD3] hover:scale-110 active:scale-95 transition-all shadow-xl font-black uppercase"
                                            >
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(slide._id!)}
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
