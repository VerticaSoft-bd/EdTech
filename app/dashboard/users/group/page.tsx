"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function GroupUsersPage() {
    const [groups, setGroups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'Active'
    });

    // Fetch groups on mount
    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/groups', {
                cache: 'no-store',
                headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
            });
            if (res.ok) {
                const json = await res.json();
                setGroups(json.data || []);
            } else {
                toast.error("Failed to load groups.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error while loading groups.");
        } finally {
            setIsLoading(false);
        }
    };

    const openCreateModal = () => {
        setModalMode('create');
        setEditingId(null);
        setFormData({ name: '', description: '', status: 'Active' });
        setIsModalOpen(true);
    };

    const openEditModal = (group: any) => {
        setModalMode('edit');
        setEditingId(group._id);
        setFormData({
            name: group.name,
            description: group.description || '',
            status: group.status,
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = modalMode === 'create' ? 'POST' : 'PUT';
        const endpoint = modalMode === 'create' ? '/api/groups' : `/api/groups/${editingId}`;

        const loadingToast = toast.loading(modalMode === 'create' ? "Creating group..." : "Updating group...");

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const json = await res.json();

            if (!res.ok) {
                toast.error(json.message || "Operation failed", { id: loadingToast });
                return;
            }

            toast.success(`Group successfully ${modalMode === 'create' ? 'created' : 'updated'}!`, { id: loadingToast });
            handleCloseModal();
            fetchGroups(); // Refresh table data

        } catch (error) {
            toast.error("Server connection failed.", { id: loadingToast });
        }
    };

    const handleDelete = async (id: string, groupName: string) => {
        if (!confirm(`Are you sure you want to delete the group "${groupName}"? This action cannot be undone.`)) return;

        const loadingToast = toast.loading("Deleting group...");
        try {
            const res = await fetch(`/api/groups/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Group deleted successfully", { id: loadingToast });
                fetchGroups(); // Refresh table data
            } else {
                const json = await res.json();
                toast.error(json.message || "Failed to delete group", { id: loadingToast });
            }
        } catch (error) {
            toast.error("Server connection failed.", { id: loadingToast });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Header section matches design of Categories page */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#1A1D1F]">User Groups</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage cohorts, batches, and collective class groupings.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-[#6C5DD3] hover:bg-[#5a4cb5] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#6C5DD3]/20"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Group
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider pb-4 px-4">Group Name</th>
                                <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider pb-4 px-4">Description</th>
                                <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider pb-4 px-4">Users</th>
                                <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider pb-4 px-4">Status</th>
                                <th className="text-right text-xs font-bold text-gray-400 uppercase tracking-wider pb-4 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-500 font-medium">Loading groups...</td>
                                </tr>
                            ) : groups.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <div className="w-16 h-16 bg-[#B4B1FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B4B1FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                        </div>
                                        <p className="text-gray-500 font-medium font-sm">No groups found. Create one to get started.</p>
                                    </td>
                                </tr>
                            ) : (
                                groups.map((group) => (
                                    <tr key={group._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-4">
                                            <div className="font-bold text-[#1A1D1F] text-sm">{group.name}</div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-sm text-gray-500 max-w-xs truncate">{group.description || '-'}</div>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold text-xs">
                                                {group.membersCount || 0}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${group.status === 'Active' ? 'bg-[#4BD37B]/10 text-[#4BD37B]' : 'bg-[#FF4C4C]/10 text-[#FF4C4C]'
                                                }`}>
                                                {group.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEditModal(group)}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#6C5DD3] hover:bg-[#6C5DD3]/10 transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(group._id, group.name)}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#FF4C4C] hover:bg-[#FF4C4C]/10 transition-colors"
                                                    title="Delete"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[500px] overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-[#1A1D1F]">
                                {modalMode === 'create' ? 'Create New Group' : 'Edit Group'}
                            </h3>
                            <button onClick={handleCloseModal} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleFormSubmit}>
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-[#1A1D1F] mb-2">Group Name <span className="text-[#FF4C4C]">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Batch 1 - Web Development"
                                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/30 focus:bg-white transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#1A1D1F] mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Optional details about this cohort..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/30 focus:bg-white transition-all resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#1A1D1F] mb-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/30 focus:bg-white transition-all appearance-none"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#6C5DD3] hover:bg-[#5a4cb5] text-white shadow-lg shadow-[#6C5DD3]/20 transition-all"
                                >
                                    {modalMode === 'create' ? 'Create Group' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
