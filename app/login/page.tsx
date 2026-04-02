"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Invalid credentials. Please try again.");
            } else {
                // Success! Token is set in cookies
                toast.success("Welcome back!");

                if (data.data) {
                    localStorage.setItem('user', JSON.stringify(data.data));
                }
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                // Trigger auth event for components listening to login state
                window.dispatchEvent(new Event('auth-change'));

                // Check role and redirect accordingly
                if (data.data?.role === 'student') {
                    router.push('/student-dashboard');
                } else {
                    router.push('/dashboard');
                }
            }
        } catch (err) {
            toast.error("Failed to connect to the server. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center p-4">
            <div className="w-full max-w-[480px] bg-white rounded-[32px] p-8 md:p-10 shadow-xl shadow-gray-200/50">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#1A1D1F] mb-3">Welcome Back</h1>
                    <p className="text-gray-500 font-medium">Log in to your account to continue.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-bold text-[#1A1D1F] mb-2">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="you@example.com"
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/30 focus:bg-white transition-all disabled:opacity-50"
                                disabled={isLoading}
                            />
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold text-[#1A1D1F]">Password</label>
                            <a href="#" className="text-xs font-bold text-[#6C5DD3] hover:underline">Forgot password?</a>
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/30 focus:bg-white transition-all disabled:opacity-50"
                                disabled={isLoading}
                            />
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 bg-[#6C5DD3] hover:bg-[#5a4cb5] text-white rounded-2xl text-sm font-bold shadow-xl shadow-[#6C5DD3]/20 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Logging In...
                                </>
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </div>
                </form>

                {/* Footer Link */}
                <div className="mt-8 text-center text-sm font-medium text-gray-500">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-[#6C5DD3] font-bold hover:underline transition-all">
                        Sign up here
                    </Link>
                </div>

            </div>
        </div>
    );
}
