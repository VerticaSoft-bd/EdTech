"use client";
import React, { useState } from "react";

interface AddPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    student: any;
}

export default function AddPaymentModal({ isOpen, onClose, onSuccess, student }: AddPaymentModalProps) {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("Cash");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen || !student) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: Number(amount),
                    email: student.email,
                    courseName: student.courseName,
                    method,
                    description,
                }),
            });

            const data = await res.json();
            if (data.success) {
                onSuccess();
                onClose();
            } else {
                setError(data.message || "Failed to record payment");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-[#1A1D1F]">Record Offline Payment</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-[#1A1D1F] mb-1.5">Student Information</label>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-sm font-bold text-[#1A1D1F]">{student.fullName}</p>
                            <p className="text-xs text-gray-500">{student.courseName}</p>
                            <p className="text-xs text-[#6C5DD3] font-bold mt-1">Due: ৳{student.dueAmount}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#1A1D1F] mb-1.5">Payment Amount (৳)</label>
                        <input
                            type="number"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.target.value"
                            className="w-full px-4 py-3 bg-[#F4F4F4] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#1A1D1F] mb-1.5">Payment Method</label>
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-full px-4 py-3 bg-[#F4F4F4] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                        >
                            <option value="Cash">Cash</option>
                            <option value="bKash (Offline)">bKash (Offline)</option>
                            <option value="Nagad (Offline)">Nagad (Offline)</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#1A1D1F] mb-1.5">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add any notes here..."
                            rows={3}
                            className="w-full px-4 py-3 bg-[#F4F4F4] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#6C5DD3] transition-all resize-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-[#6C5DD3] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
                    >
                        {isLoading ? "Saving..." : "Confirm Payment"}
                    </button>
                </form>
            </div>
        </div>
    );
}
