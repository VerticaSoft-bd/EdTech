"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";

interface PasswordSetupModalProps {
    isOpen: boolean;
    onSuccess: () => void;
}

export default function PasswordSetupModal({ isOpen, onSuccess }: PasswordSetupModalProps) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/setup-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Password secured successfully!");
                onSuccess();
            } else {
                toast.error(data.message || "Failed to set password");
            }
        } catch (error) {
            console.error("Setup password error:", error);
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[#1A1D1F]/60 backdrop-blur-md" />
            
            <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C5DD3]/10 rounded-full blur-3xl -translate-y-12 translate-x-12" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FF754C]/10 rounded-full blur-3xl translate-y-12 -translate-x-12" />

                <div className="relative p-8">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-50">
                            <Lock className="text-[#6C5DD3]" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1A1D1F] mb-2">Secure Your Account</h2>
                        <p className="text-gray-500 text-sm max-w-[280px]">
                            Welcome! Please set a strong password to protect your learning progress.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#1A1D1F] ml-1">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Min. 6 characters"
                                    className="w-full px-5 py-3.5 bg-[#F4F4F4] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-[#1A1D1F] font-medium"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#1A1D1F] ml-1">Confirm Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Repeat your password"
                                className="w-full px-5 py-3.5 bg-[#F4F4F4] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-[#1A1D1F] font-medium"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-[#6C5DD3] text-white rounded-2xl font-bold hover:bg-[#5b4eb3] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6C5DD3]/20 disabled:opacity-50 group"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Secure Account
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                        <ShieldCheck size={12} className="text-[#4BD37B]" />
                        End-to-end Encrypted Security
                    </div>
                </div>
            </div>
        </div>
    );
}
