"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
    const [mobileNo, setMobileNo] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'request-otp', mobileNo })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("OTP sent to your mobile number");
                setStep(2);
            } else {
                toast.error(data.message || "Failed to send OTP");
            }
        } catch (err) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    action: 'reset-password', 
                    mobileNo, 
                    otp, 
                    newPassword 
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Password reset successfully! Please log in.");
                router.push('/login');
            } else {
                toast.error(data.message || "Failed to reset password");
            }
        } catch (err) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-4 py-20">
                <div className="w-full max-w-[480px] bg-white rounded-[32px] p-8 md:p-10 shadow-xl shadow-gray-200/50">
                    
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3y"></path></svg>
                        </div>
                        <h1 className="text-3xl font-extrabold text-[#1A1D1F] mb-3">
                            {step === 1 ? 'Forgot Password' : 'Reset Password'}
                        </h1>
                        <p className="text-gray-500 font-medium">
                            {step === 1 
                                ? "Enter your mobile number to receive a 6-digit OTP." 
                                : "Enter the OTP sent to your mobile and your new password."}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleRequestOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-[#1A1D1F] mb-2">Mobile Number</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        required
                                        value={mobileNo}
                                        onChange={(e) => setMobileNo(e.target.value)}
                                        placeholder="01XXXXXXXXX"
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/30 focus:bg-white transition-all disabled:opacity-50"
                                        disabled={isLoading}
                                    />
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-4 bg-[#6C5DD3] hover:bg-[#5a4cb5] text-white rounded-2xl text-sm font-bold shadow-xl shadow-[#6C5DD3]/20 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-[#1A1D1F] mb-1">OTP</label>
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/30"
                                    maxLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#1A1D1F] mb-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#1A1D1F] mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/30"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-4 bg-[#6C5DD3] hover:bg-[#5a4cb5] text-white rounded-2xl text-sm font-bold shadow-xl shadow-[#6C5DD3]/20 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Resetting Password...' : 'Reset Password'}
                            </button>
                            <button 
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-center text-sm font-bold text-gray-400 hover:text-gray-600 transition-all"
                            >
                                Back to step 1
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center text-sm font-medium text-gray-500">
                        Remember your password?{' '}
                        <Link href="/login" className="text-[#6C5DD3] font-bold hover:underline transition-all">
                            Log in here
                        </Link>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}
