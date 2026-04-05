"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, MapPin, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

function CheckInContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const course = searchParams.get('course');
    const date = searchParams.get('date');

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleCheckIn = async () => {
        if (!course || !date) {
            toast.error('Invalid check-in link');
            return;
        }

        setLoading(true);
        try {
            // Get device info for smart tracking
            const deviceInfo = {
                userAgent: navigator.userAgent,
                language: navigator.language,
                screen: `${window.screen.width}x${window.screen.height}`,
                timestamp: new Date().toISOString()
            };

            const res = await fetch('/api/student/attendance/check-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseName: course,
                    date: date,
                    deviceInfo
                })
            });

            const data = await res.json();
            if (data.success) {
                setStatus('success');
                setMessage(data.message || 'Attendance marked successfully!');
                toast.success('Done!');
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to mark attendance');
                toast.error(data.error);
            }
        } catch (err) {
            setStatus('error');
            setMessage('A network error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!course || !date) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                    <XCircle size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Invalid Link</h1>
                <p className="text-gray-500 mt-2">This attendance link is missing required information.</p>
                <button 
                    onClick={() => router.push('/dashboard')}
                    className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-xl font-bold"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto pt-12 pb-24 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100 p-8">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 mb-6 shadow-sm">
                        <Smartphone size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Self Check-in</h1>
                    <p className="text-gray-500 mt-3 font-medium">Verify your presence for today's session</p>
                </div>

                {status === 'idle' && (
                    <div className="space-y-8">
                        <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs border border-gray-100">
                                        <ShieldCheck className="text-green-500" size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Course</span>
                                        <span className="text-sm font-bold text-gray-900">{course}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs border border-gray-100">
                                        <MapPin className="text-blue-500" size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Session Date</span>
                                        <span className="text-sm font-bold text-gray-900">{new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleCheckIn}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-[#6C5DD3] text-white rounded-2xl font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                            Confirm Presence
                        </button>

                        <p className="text-[11px] text-gray-400 text-center leading-relaxed px-4">
                            By clicking confirm, you are marking yourself as 'Present' for this course today.
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center py-6 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-8 ring-green-50">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Great Job!</h2>
                        <p className="text-gray-500 mt-2 font-medium">{message}</p>
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className="mt-10 w-full flex items-center justify-center gap-2 py-4 border-2 border-gray-900 text-gray-900 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
                        >
                            Return to Home
                            <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center py-6 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-8 ring-red-50">
                            <XCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Check-in Failed</h2>
                        <p className="text-gray-500 mt-2 font-medium">{message}</p>
                        <button 
                            onClick={() => setStatus('idle')}
                            className="mt-10 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CheckInPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="animate-spin text-[#6C5DD3]" size={40} />
                </div>
            }>
                <CheckInContent />
            </Suspense>
        </div>
    );
}
