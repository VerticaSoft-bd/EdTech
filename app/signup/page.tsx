"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "An error occurred during signup");
            } else {
                // Save user and token to local storage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.data));

                // Success! Redirect based on role
                toast.success("Account created successfully! Welcome aboard.");

                // Trigger auth event for components listening to login state
                window.dispatchEvent(new Event('auth-change'));

                if (data.data.role === 'admin') {
                    router.push('/dashboard/admin');
                } else if (data.data.role === 'staff') {
                    router.push('/dashboard/staff');
                } else {
                    router.push('/student-dashboard');
                }
            }
        } catch (err) {
            toast.error("Failed to connect to the server. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-4 py-20">
                <div className="w-full max-w-[480px] bg-white rounded-[32px] p-8 md:p-10 shadow-xl shadow-gray-200/50">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
                        </div>
                        <h1 className="text-3xl font-extrabold text-[#1A1D1F] mb-3">Create an account</h1>
                        <p className="text-gray-500 font-medium">Join us to manage your learning platform.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm font-bold text-[#1A1D1F] mb-2">Full Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/30 focus:bg-white transition-all disabled:opacity-50"
                                    disabled={isLoading}
                                />
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                        </div>

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
                            <label className="block text-sm font-bold text-[#1A1D1F] mb-2">Password</label>
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

                        <div>
                            <label className="block text-sm font-bold text-[#1A1D1F] mb-2">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/30 focus:bg-white transition-all disabled:opacity-50"
                                    disabled={isLoading}
                                />
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
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
                                        Creating Account...
                                    </>
                                ) : (
                                    'Sign Up'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-8 text-center text-sm font-medium text-gray-500">
                        Already have an account?{' '}
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
