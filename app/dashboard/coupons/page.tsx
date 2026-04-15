"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'Percentage',
        discountValue: '',
        description: '',
        expiryDate: '',
        isActive: true,
        usageLimit: ''
    });

    // Fetch coupons
    const fetchCoupons = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/coupons');
            if (res.ok) {
                const json = await res.json();
                setCoupons(json.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch coupons", error);
            toast.error("Failed to load coupons");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                discountValue: Number(formData.discountValue),
                usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
                code: formData.code.toUpperCase()
            };

            const url = editingId ? `/api/coupons/${editingId}` : '/api/coupons';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                fetchCoupons();
                closeModal();
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Failed to save coupon", error);
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (coupon: any) => {
        setEditingId(coupon._id);
        setFormData({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue.toString(),
            description: coupon.description || '',
            expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
            isActive: coupon.isActive,
            usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;

        try {
            const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Coupon deleted");
                fetchCoupons();
            } else {
                const data = await res.json();
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({
            code: '',
            discountType: 'Percentage',
            discountValue: '',
            description: '',
            expiryDate: '',
            isActive: true,
            usageLimit: ''
        });
    };

    return (
        <div className="space-y-8 pb-8 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1A1D1F]">Manage Coupons</h1>
                    <p className="text-sm text-gray-500 mt-1">Create and manage discounts for your courses</p>
                </div>
                <button
                    onClick={() => { closeModal(); setIsModalOpen(true); }}
                    className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-colors flex items-center gap-2"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Create Coupon
                </button>
            </div>

            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Coupon Code</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Discount</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Usage</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Expiry</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">Loading coupons...</td>
                                </tr>
                            ) : coupons.length > 0 ? (
                                coupons.map((coupon) => (
                                    <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-[#1A1D1F] bg-gray-100 px-3 py-1 rounded-lg inline-block font-mono tracking-wider">
                                                {coupon.code}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">{coupon.description || 'No description'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-[#6C5DD3]">
                                                {coupon.discountType === 'Percentage' ? `${coupon.discountValue}%` : `৳${coupon.discountValue}`}
                                            </div>
                                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{coupon.discountType}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-[#1A1D1F]">{coupon.usageCount} <span className="text-gray-400 font-normal">/ {coupon.usageLimit || '∞'}</span></div>
                                            <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                                <div 
                                                    className="h-full bg-[#6C5DD3]" 
                                                    style={{ width: coupon.usageLimit ? `${(coupon.usageCount / coupon.usageLimit) * 100}%` : '0%' }}
                                                ></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${coupon.isActive && new Date(coupon.expiryDate) >= new Date() ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {coupon.isActive && new Date(coupon.expiryDate) >= new Date() ? 'Active' : 'Expired/Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(coupon)} className="p-2 text-gray-400 hover:text-[#6C5DD3] hover:bg-[#6C5DD3]/10 rounded-lg transition-colors">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </button>
                                                <button onClick={() => handleDelete(coupon._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-500">No coupons found. Create your first discount!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-[#1A1D1F]">{editingId ? 'Edit Coupon' : 'Create New Coupon'}</h3>
                            <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-[#1A1D1F] mb-1.5">Coupon Code <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all font-mono uppercase"
                                        placeholder="e.g. SUMMER50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#1A1D1F] mb-1.5">Discount Type</label>
                                    <select
                                        value={formData.discountType}
                                        onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all font-bold"
                                    >
                                        <option value="Percentage">Percentage (%)</option>
                                        <option value="Fixed">Fixed (৳)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#1A1D1F] mb-1.5">Value <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.discountValue}
                                        onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all font-bold"
                                        placeholder={formData.discountType === 'Percentage' ? 'e.g. 10' : 'e.g. 500'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#1A1D1F] mb-1.5">Usage Limit</label>
                                    <input
                                        type="number"
                                        value={formData.usageLimit}
                                        onChange={e => setFormData({ ...formData, usageLimit: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all"
                                        placeholder="e.g. 100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#1A1D1F] mb-1.5">Expiry Date <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.expiryDate}
                                        onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#1A1D1F] mb-1.5">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all min-h-[80px] resize-none"
                                    placeholder="Brief details about the coupon..."
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-[#6C5DD3] rounded border-gray-300 focus:ring-[#6C5DD3]"
                                />
                                <label htmlFor="isActive" className="text-sm font-bold text-[#1A1D1F]">Active</label>
                            </div>

                            <div className="mt-8 flex items-center justify-end gap-3">
                                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5]"
                                >
                                    {isSubmitting ? 'Saving...' : (editingId ? 'Save Changes' : 'Create Coupon')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
