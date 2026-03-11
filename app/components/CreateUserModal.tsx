"use client";

import { useState, useEffect } from "react";

interface CreateUserModalProps {
    role: "admin" | "student" | "teacher" | "staff";
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    editingUser?: any;
}

export default function CreateUserModal({ role, isOpen, onClose, onSuccess, editingUser }: CreateUserModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [staffPermissions, setStaffPermissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Setup form values
    useEffect(() => {
        if (isOpen) {
            if (editingUser) {
                setName(editingUser.name || "");
                setEmail(editingUser.email || "");
                setPassword(""); // Leave blank when editing
                setStaffPermissions(editingUser.staffPermissions || []);
            } else {
                setName("");
                setEmail("");
                setPassword("");
                setStaffPermissions([]);
            }
            setError("");
            setSuccessMsg("");
        }
    }, [isOpen, editingUser]);

    const handleCheckboxChange = (perm: string) => {
        setStaffPermissions(prev => 
            prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
        );
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMsg("");

        try {
            const url = editingUser ? `/api/users/${editingUser._id}` : "/api/users";
            const method = editingUser ? "PUT" : "POST";

            const payload: any = { name, email, role };
            if (password) payload.password = password; // Only send password if editing user provided one, or new user
            if (role === 'staff') payload.staffPermissions = staffPermissions;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to create user");
            }

            setSuccessMsg(data.message);
            setName("");
            setEmail("");
            setPassword("");

            setTimeout(() => {
                onClose();
                if (onSuccess) onSuccess();
            }, 1000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const roleFormat = role.charAt(0).toUpperCase() + role.slice(1);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-[#1A1D1F]">{editingUser ? `Edit ${roleFormat}` : `Create ${roleFormat}`}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="px-6 py-6 border-b border-gray-100 flex-1 overflow-y-auto">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                            {error}
                        </div>
                    )}
                    {successMsg && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-600 text-sm rounded-xl">
                            {successMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all"
                                placeholder={`Enter ${role} name`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all"
                                placeholder={`Enter ${role} email`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password {editingUser && '(Leave empty to keep current)'}</label>
                            <input
                                type="password"
                                required={!editingUser}
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all"
                                placeholder={editingUser ? "Leave blank to ignore" : "Enter minimum 6 characters"}
                            />
                        </div>

                        {role === 'staff' && (
                            <div className="pt-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Accounts Page Permissions</label>
                                <div className="space-y-2 bg-[#F4F4F4] p-4 rounded-xl">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" className="peer sr-only"
                                                checked={staffPermissions.includes('overview')}
                                                onChange={() => handleCheckboxChange('overview')} />
                                            <div className="w-5 h-5 rounded border-2 border-gray-300 bg-white peer-checked:bg-[#6C5DD3] peer-checked:border-[#6C5DD3] transition-all"></div>
                                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#1A1D1F] transition-colors">Accounts Overview</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" className="peer sr-only"
                                                checked={staffPermissions.includes('expenses')}
                                                onChange={() => handleCheckboxChange('expenses')} />
                                            <div className="w-5 h-5 rounded border-2 border-gray-300 bg-white peer-checked:bg-[#6C5DD3] peer-checked:border-[#6C5DD3] transition-all"></div>
                                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#1A1D1F] transition-colors">Daily / Monthly Expenses</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" className="peer sr-only"
                                                checked={staffPermissions.includes('employees')}
                                                onChange={() => handleCheckboxChange('employees')} />
                                            <div className="w-5 h-5 rounded border-2 border-gray-300 bg-white peer-checked:bg-[#6C5DD3] peer-checked:border-[#6C5DD3] transition-all"></div>
                                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#1A1D1F] transition-colors">Employees & Payroll</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" className="peer sr-only"
                                                checked={staffPermissions.includes('dues')}
                                                onChange={() => handleCheckboxChange('dues')} />
                                            <div className="w-5 h-5 rounded border-2 border-gray-300 bg-white peer-checked:bg-[#6C5DD3] peer-checked:border-[#6C5DD3] transition-all"></div>
                                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#1A1D1F] transition-colors">Student Dues</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        <div className="pt-2 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="px-5 py-2.5 rounded-[12px] font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 bg-[#6C5DD3] text-white rounded-[12px] font-semibold hover:bg-[#5b4eb3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        Creating...
                                    </>
                                ) : (
                                    editingUser ? `Save Changes` : `Create ${roleFormat}`
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
