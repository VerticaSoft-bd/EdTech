"use client";
import React, { useState, useEffect } from 'react';

export default function BatchesPage() {
    const [batches, setBatches] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'Offline Batch' | 'Online Batch'>('Offline Batch');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Offline Batch',
        schedule: '',
        timing: '',
        totalSeats: 0,
        startDate: '',
        teachers: [] as string[],
        status: 'Active',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Time picker helpers
    const [startT, setStartT] = useState('10:00');
    const [endT, setEndT] = useState('12:00');

    const convertTo12Hour = (time: string) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        let h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12;
        return `${h}:${minutes.padStart(2, '0')} ${ampm}`;
    };

    const convertTo24Hour = (time12h: string) => {
        if (!time12h) return '10:00';
        const [time, modifier] = time12h.trim().split(' ');
        let [hours, minutes] = time.split(':');
        let h = parseInt(hours);
        if (h === 12) h = 0;
        if (modifier === 'PM') h += 12;
        return `${h.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };

    useEffect(() => {
        if (isModalOpen) {
            handleInputChange('timing', `${convertTo12Hour(startT)} - ${convertTo12Hour(endT)}`);
        }
    }, [startT, endT, isModalOpen]);

    useEffect(() => {
        fetchBatches();
        fetchTeachers();
    }, []);

    const fetchBatches = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/batches');
            if (res.ok) {
                const data = await res.json();
                setBatches(data.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            const res = await fetch('/api/users?role=teacher');
            if (res.ok) {
                const data = await res.json();
                setTeachers(data.data || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenModal = (batch: any = null) => {
        if (batch) {
            setEditingBatch(batch);
            setFormData({
                name: batch.name,
                type: batch.type,
                schedule: batch.schedule,
                timing: batch.timing,
                totalSeats: batch.totalSeats,
                startDate: batch.startDate,
                teachers: batch.teachers?.map((t: any) => t._id) || [],
                status: batch.status,
            });
            setIsModalOpen(true);
            setError('');
            if (batch.timing && batch.timing.includes(' - ')) {
                const [s, e] = batch.timing.split(' - ');
                setStartT(convertTo24Hour(s));
                setEndT(convertTo24Hour(e));
            }
        } else {
            setEditingBatch(null);
            setFormData({
                name: '',
                type: activeTab,
                schedule: '',
                timing: '10:00 AM - 12:00 PM',
                totalSeats: 0,
                startDate: '',
                teachers: [],
                status: 'Active',
            });
            setStartT('10:00');
            setEndT('12:00');
            setIsModalOpen(true);
            setError('');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const url = editingBatch ? `/api/batches/${editingBatch._id}` : '/api/batches';
            const method = editingBatch ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                await fetchBatches();
                handleCloseModal();
            } else {
                setError(data.message || 'Failed to save batch');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this batch?')) return;
        try {
            const res = await fetch(`/api/batches/${id}`, { method: 'DELETE' });
            if (res.ok) {
                await fetchBatches();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredBatches = batches.filter(b => b.type === activeTab);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1A1D1F]">Manage Batches</h1>
                    <p className="text-sm text-gray-500 mt-1">Create and monitor student batch allocations</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-colors flex items-center gap-2"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add New Batch
                </button>
            </div>

            <div className="flex space-x-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('Offline Batch')}
                    className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Offline Batch' ? 'border-[#6C5DD3] text-[#6C5DD3]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Offline Batches
                </button>
                <button
                    onClick={() => setActiveTab('Online Batch')}
                    className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Online Batch' ? 'border-[#6C5DD3] text-[#6C5DD3]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Online Batches
                </button>
            </div>

            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center min-h-[400px]">
                        <div className="w-10 h-10 border-4 border-[#6C5DD3] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredBatches.length > 0 ? (
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-400 font-bold">
                            <tr>
                                <th className="px-6 py-4">Batch Name</th>
                                <th className="px-6 py-4">Schedule & Time</th>
                                <th className="px-6 py-4">Teachers</th>
                                <th className="px-6 py-4">Seats & Enrollment</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBatches.map((batch) => (
                                <tr key={batch._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-[#1A1D1F]">{batch.name}</div>
                                        <div className="text-xs text-gray-400 mt-1">Starts: {batch.startDate}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-700">{batch.schedule}</div>
                                        <div className="text-xs text-gray-400">{batch.timing}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex -space-x-2">
                                            {batch.teachers?.map((t: any) => (
                                                <div key={t._id} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm overflow-hidden" title={t.name}>
                                                    {t.avatar ? <img src={t.avatar} className="w-full h-full object-cover" /> : t.name?.substring(0, 2).toUpperCase()}
                                                </div>
                                            ))}
                                            {(!batch.teachers || batch.teachers.length === 0) && <span className="text-xs text-gray-400">None</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-[#1A1D1F]">{batch.enrolledStudents} <span className="text-gray-400 font-normal">/ {batch.totalSeats}</span></div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                                            <div className="bg-[#6C5DD3] h-1.5 rounded-full" style={{ width: `${(batch.enrolledStudents / batch.totalSeats) * 100 || 0}%` }}></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-lg ${batch.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {batch.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenModal(batch)} className="p-2 text-gray-400 hover:text-[#6C5DD3] hover:bg-indigo-50 rounded-lg transition-colors">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                            <button onClick={() => handleDelete(batch._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                        <h3 className="text-lg font-bold text-[#1A1D1F]">No {activeTab}s Found</h3>
                        <p className="text-sm text-gray-500 mt-1 mb-4 text-center max-w-sm">You haven't created any {activeTab.toLowerCase()}s yet. Get started by creating your first one.</p>
                        <button onClick={() => handleOpenModal()} className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5]">
                            Add New Batch
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-[#1A1D1F]">{editingBatch ? 'Edit Batch' : 'Create New Batch'}</h2>
                            <button onClick={handleCloseModal} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="p-6 text-[#1A1D1F]">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Batch Name *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="e.g. Graphic Design M-W-F Batch"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Batch Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => handleInputChange('type', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-colors appearance-none"
                                        >
                                            <option value="Offline Batch">Offline Batch</option>
                                            <option value="Online Batch">Online Batch</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Total Seats *</label>
                                        <input
                                            required
                                            type="number"
                                            min="1"
                                            value={formData.totalSeats || ''}
                                            onChange={(e) => handleInputChange('totalSeats', parseInt(e.target.value) || 0)}
                                            placeholder="50"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Schedule (Days) *</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.schedule}
                                            onChange={(e) => handleInputChange('schedule', e.target.value)}
                                            placeholder="e.g. Sat, Mon, Wed"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Class Timing *</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Start</span>
                                                <input
                                                    type="time"
                                                    value={startT}
                                                    onChange={(e) => setStartT(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-colors"
                                                />
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">End</span>
                                                <input
                                                    type="time"
                                                    value={endT}
                                                    onChange={(e) => setEndT(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1 font-medium italic">Formatted as: {formData.timing}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Start Date *</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => handleInputChange('status', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-colors appearance-none"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Archived">Archived</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Assigned Teachers</label>
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-48 overflow-y-auto space-y-2">
                                        {teachers.length === 0 ? (
                                            <p className="text-xs text-gray-500 text-center py-4">No teachers found.</p>
                                        ) : (
                                            teachers.map((teacher: any) => (
                                                <label key={teacher._id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.teachers.includes(teacher._id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                handleInputChange('teachers', [...formData.teachers, teacher._id]);
                                                            } else {
                                                                handleInputChange('teachers', formData.teachers.filter(id => id !== teacher._id));
                                                            }
                                                        }}
                                                        className="w-4 h-4 rounded border-gray-300 text-[#6C5DD3] focus:ring-[#6C5DD3]"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                                            {teacher.avatar ? <img src={teacher.avatar} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-xs font-bold text-gray-500">{teacher.name.substring(0,2).toUpperCase()}</span>}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700">{teacher.name}</span>
                                                    </div>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                        {editingBatch ? 'Save Changes' : 'Create Batch'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
