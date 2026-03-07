"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Enrollment {
    _id: string;
    user: { name?: string; email?: string } | null;
    amount: number;
    status: string;
    metadata: { courseName?: string; email?: string };
    createdAt: string;
    transactionId: string;
}

const RecentAdmissions: React.FC = () => {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const res = await fetch('/api/admin/enrollments?limit=5');
                const data = await res.json();
                if (data.success) {
                    setEnrollments(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch recent enrollments:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatAmount = (amount: number) => {
        return `৳${amount.toLocaleString()}`;
    };

    return (
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 col-span-12 lg:col-span-4 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#1A1D1F]">Recent Enrollments</h3>
                <Link href="/dashboard/enrollments" className="text-xs font-bold text-[#6C5DD3] hover:underline">View All</Link>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                    <div>
                                        <div className="h-3 w-24 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-2 w-16 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="h-5 w-14 bg-gray-100 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-gray-300">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                        <p className="text-sm font-medium">No enrollments yet</p>
                        <p className="text-xs mt-1">Course purchases will appear here</p>
                    </div>
                ) : (
                    enrollments.map((enrollment) => {
                        const name = (enrollment.user as any)?.name || enrollment.metadata?.email || 'Unknown';
                        const course = enrollment.metadata?.courseName || 'Unknown Course';
                        const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

                        return (
                            <div key={enrollment._id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C5DD3] to-[#8E8AFF] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                        {initials}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#1A1D1F] group-hover:text-[#6C5DD3] transition-colors">{name}</h4>
                                        <p className="text-[10px] text-gray-400">{course}</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    {enrollment.status === 'completed' ? (
                                        <span className="px-2.5 py-1 rounded-lg bg-[#4BD37B]/10 text-[#4BD37B] text-[10px] font-bold">
                                            {formatAmount(enrollment.amount)}
                                        </span>
                                    ) : enrollment.status === 'pending' ? (
                                        <span className="px-2.5 py-1 rounded-lg bg-[#FFAB7B]/10 text-[#FF754C] text-[10px] font-bold">
                                            Pending
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 rounded-lg bg-[#FF4C4C]/10 text-[#FF4C4C] text-[10px] font-bold">
                                            Failed
                                        </span>
                                    )}
                                    <p className="text-[9px] text-gray-300 mt-1">{formatDate(enrollment.createdAt)}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default RecentAdmissions;
