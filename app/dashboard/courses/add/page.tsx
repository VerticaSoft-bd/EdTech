"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function AddCoursePage() {
    const [activeTab, setActiveTab] = useState('basic');

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
                    <button className="px-5 py-2.5 bg-white border border-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
                        Save Draft
                    </button>
                    <button className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-colors">
                        Publish Course
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Form */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Tabs */}
                    <div className="bg-white p-1 rounded-xl border border-gray-100 inline-flex">
                        {['basic', 'curriculum', 'media', 'pricing'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-[#6C5DD3] text-white shadow-md' : 'text-gray-500 hover:text-[#1A1D1F]'}`}
                            >
                                {tab} Info
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
                                        <input type="text" placeholder="e.g. Advanced UI/UX Design Masterclass" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                                            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F] appearance-none cursor-pointer">
                                                <option>Design</option>
                                                <option>Development</option>
                                                <option>Marketing</option>
                                                <option>Business</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Level</label>
                                            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F] appearance-none cursor-pointer">
                                                <option>Beginner</option>
                                                <option>Intermediate</option>
                                                <option>Advanced</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                        <textarea rows={6} placeholder="Describe your course content..." className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F] resize-none"></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">What you'll learn</label>
                                        <div className="space-y-2">
                                            <input type="text" placeholder="Key learning outcome 1" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]" />
                                            <input type="text" placeholder="Key learning outcome 2" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]" />
                                            <button className="text-sm font-bold text-[#6C5DD3] hover:underline flex items-center gap-1">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                                                Add Outcome
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'curriculum' && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                                </div>
                                <h3 className="font-bold text-[#1A1D1F]">Curriculum Builder</h3>
                                <p className="text-sm text-gray-500 mb-6">Start adding sections and lessons to your course.</p>
                                <button className="px-5 py-2.5 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-xl text-sm font-bold hover:bg-[#6C5DD3]/20 transition-colors">
                                    + Add First Section
                                </button>
                            </div>
                        )}

                        {activeTab === 'media' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Course Thumbnail</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#6C5DD3] hover:bg-[#6C5DD3]/5 transition-all">
                                        <div className="w-12 h-12 rounded-full bg-[#6C5DD3]/10 flex items-center justify-center text-[#6C5DD3] mb-3">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                        </div>
                                        <p className="text-sm font-bold text-[#1A1D1F]">Click to upload or drag and drop</p>
                                        <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Intro Video (Optional)</label>
                                    <input type="text" placeholder="Paste video URL (YouTube, Vimeo)" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'pricing' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Course Price ($)</label>
                                        <input type="number" placeholder="0.00" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Discounted Price ($)</label>
                                        <input type="number" placeholder="0.00" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5 rounded text-[#6C5DD3] focus:ring-[#6C5DD3]" />
                                    <span className="text-sm font-medium text-[#1A1D1F]">This is a free course</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Preview */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-[#1A1D1F]">Preview</h3>

                    {/* Card Preview */}
                    <div className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100">
                        <div className="h-[160px] rounded-[20px] bg-gradient-to-br from-[#8E8AFF] to-[#B4B1FF] relative p-5 flex flex-col justify-between overflow-hidden mb-4">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>
                            <div className="flex justify-between items-start relative z-10">
                                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-bold border border-white/20">Design</span>
                                <span className="px-2.5 py-1 backdrop-blur-md rounded-lg text-white text-[10px] font-bold border border-white/20 bg-[#8E8AFF]/40">Online</span>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-1 text-white/90 text-[11px] font-medium mb-1">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    0h 0m • 0 Lessons
                                </div>
                            </div>
                        </div>
                        <div className="px-2 pb-2">
                            <h3 className="font-bold text-[#1A1D1F] text-lg leading-tight mb-2">Your Course Title</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                                <span className="text-xs text-gray-500 font-medium">by You</span>
                            </div>
                            <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
                                <span className="text-lg font-bold text-[#1A1D1F]">$0.00</span>
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
    );
}
