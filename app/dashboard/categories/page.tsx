"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'Active',
        color: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const ITEMS_PER_PAGE = 6;

    // Fetch categories
    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/categories', {
                cache: 'no-store',
                headers: {
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache'
                }
            });
            if (res.ok) {
                const json = await res.json();
                setCategories(json.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const filteredCategories = categories.filter(category => {
        if (filterStatus === 'All') return true;
        return category.status === filterStatus;
    });

    const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedCategories = filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset to page 1 when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [originalThumbnail, setOriginalThumbnail] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let thumbnailUrl = originalThumbnail || '';

            // 1. Upload new image if it exists and differs from original
            if (thumbnailFile) {
                console.log("Uploading new thumbnail file to S3...", thumbnailFile.name);
                const uploadFormData = new FormData();
                uploadFormData.append('file', thumbnailFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    console.log("S3 Upload Successful. URL received:", uploadData.url);
                    thumbnailUrl = uploadData.url;
                } else {
                    const errorData = await uploadRes.json();
                    console.error("S3 Upload Error:", errorData);
                    alert(`Image Upload Error: ${errorData.message}`);
                    setIsSubmitting(false);
                    return; // Stop submission if image upload fails
                }
            }

            // 2. Create or Update category
            const colors = [
                'from-[#8E8AFF] to-[#B4B1FF]',
                'from-[#FFAB7B] to-[#FFCF9D]',
                'from-[#FF9AD5] to-[#FFC2E8]',
                'from-[#4BD37B] to-[#80F2AA]',
                'from-[#6C5DD3] to-[#8E8AFF]'
            ];
            const randomColor = formData.color || colors[Math.floor(Math.random() * colors.length)];

            const payload = {
                ...formData,
                color: randomColor,
                thumbnail: thumbnailUrl
            };

            const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
            const method = editingId ? 'PUT' : 'POST';

            console.log(`Final payload being sent to ${url}:`, payload);

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const responseData = await res.json();
                console.log(`Category ${editingId ? 'update' : 'creation'} successful.`, responseData);
                // Refresh list and close modal
                await fetchCategories();
                closeModal();
            } else {
                const errorData = await res.json();
                console.error("Category API Error:", errorData);
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Failed to save category", error);
            alert("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (category: any) => {
        setEditingId(category._id || category.id);
        setFormData({
            name: category.name,
            description: category.description || '',
            status: category.status,
            color: category.color
        });
        setOriginalThumbnail(category.thumbnail || null);
        setThumbnailFile(null); // Reset any pending local uploads
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this category? Its image will also be permanently deleted from S3.")) {
            return;
        }

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                console.log("Category deleted successfully.");
                await fetchCategories();
                // If deleting last item on page, jump back
                if (paginatedCategories.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                }
            } else {
                const errorData = await res.json();
                alert(`Error deleting category: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Failed to delete category", error);
            alert("An unexpected error occurred during deletion.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', description: '', status: 'Active', color: '' });
        setThumbnailFile(null);
        setOriginalThumbnail(null);
    };

    return (
        <div className="space-y-8 pb-8 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#1A1D1F]">Categories</h2>
                    <p className="text-sm text-gray-500">Manage course categories and grouping.</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 cursor-pointer font-bold text-[#1A1D1F]"
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Draft">Draft</option>
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                    </div>

                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                        <input type="text" placeholder="Search categories..." className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 w-[240px]" />
                    </div>
                    {/* Create Category Button */}
                    <button
                        onClick={() => { closeModal(); setIsModalOpen(true); }}
                        className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-colors flex items-center gap-2"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Create Category
                    </button>
                </div>
            </div>

            {/* Category Table */}
            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category Base</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Courses Count</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#6C5DD3]"></div>
                                        <p className="mt-2 text-sm text-gray-500">Loading categories...</p>
                                    </td>
                                </tr>
                            ) : paginatedCategories.length > 0 ? (
                                paginatedCategories.map((category) => (
                                    <tr key={category._id || category.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {category.thumbnail ? (
                                                    <img src={category.thumbnail} alt={category.name} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                                                ) : (
                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                                                        {category.name?.charAt(0) || '?'}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-[#1A1D1F]">{category.name}</div>
                                                    <div className="text-[10px] text-gray-400 font-mono mt-1">ID: {category._id?.slice(-6) || category.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-[250px] truncate">
                                            {category.description || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg text-sm font-bold text-[#1A1D1F]">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                                                {category.courseCount || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${category.status === 'Active' ? 'bg-[#4BD37B]/10 text-[#4BD37B]' :
                                                category.status === 'Draft' ? 'bg-gray-100 text-gray-500' :
                                                    'bg-[#FF4C4C]/10 text-[#FF4C4C]'
                                                }`}>
                                                {category.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2 text-gray-400 hover:text-[#6C5DD3] hover:bg-[#6C5DD3]/10 rounded-lg transition-colors"
                                                    title="Edit Category"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category._id || category.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Category"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline><polyline points="2 17 12 22 22 17"></polyline></svg>
                                        </div>
                                        <h3 className="text-[#1A1D1F] font-bold mb-1">No categories found</h3>
                                        <p className="text-sm text-gray-500">Get started by creating a new course category.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
                <div className="p-6 bg-white rounded-[24px] border border-gray-100 flex items-center justify-between shadow-sm">
                    <p className="text-xs text-gray-500 font-medium">
                        Showing <span className="text-[#1A1D1F] font-bold">{filteredCategories.length > 0 ? startIndex + 1 : 0}</span> to <span className="text-[#1A1D1F] font-bold">{Math.min(startIndex + ITEMS_PER_PAGE, filteredCategories.length)}</span> of <span className="text-[#1A1D1F] font-bold">{filteredCategories.length}</span> categories
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-xl transition-all ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 hover:text-[#1A1D1F]'}`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                        </button>

                        {Array.from({ length: totalPages }).map((_, idx) => {
                            const page = idx + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${currentPage === page
                                        ? 'bg-[#6C5DD3] text-white shadow-lg shadow-[#6C5DD3]/20'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-[#1A1D1F]'
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-xl transition-all ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 hover:text-[#1A1D1F]'}`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Create Component Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closeModal}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-[#1A1D1F]">{editingId ? 'Edit Category' : 'Create New Category'}</h3>
                            <button
                                onClick={closeModal}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-[#1A1D1F] mb-1.5">Category Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all"
                                        placeholder="e.g. Web Development"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#1A1D1F] mb-1.5">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all min-h-[100px] resize-none"
                                        placeholder="Brief description of the category..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#1A1D1F] mb-1.5">Status</label>
                                    <div className="relative">
                                        <select
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all font-medium text-[#1A1D1F]"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Draft">Draft</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#1A1D1F] mb-1.5">Category Image (Optional)</label>
                                    <div className={`relative border-2 border-dashed ${(thumbnailFile || originalThumbnail) ? 'border-transparent' : 'border-gray-200'} rounded-xl hover:border-[#6C5DD3] transition-colors bg-gray-50 text-center overflow-hidden min-h-[140px] flex items-center justify-center`}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    setThumbnailFile(e.target.files[0]);
                                                }
                                            }}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        />

                                        {(thumbnailFile || originalThumbnail) ? (
                                            <div className="absolute inset-0 w-full h-full pointer-events-none group-thumbnail">
                                                <img
                                                    src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : originalThumbnail!}
                                                    alt="Preview"
                                                    className="object-cover w-full h-full"
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
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !formData.name}
                                    className={`px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${(isSubmitting || !formData.name) ? 'opacity-50 cursor-not-allowed' : 'shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5]'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            {editingId ? 'Saving...' : 'Creating...'}
                                        </>
                                    ) : (
                                        editingId ? 'Save Changes' : 'Create Category'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
