"use client";
import React, { useState, useEffect, useCallback } from 'react';

interface Enrollment {
    _id: string;
    user: { name?: string; email?: string; phone?: string } | null;
    amount: number;
    status: string;
    metadata: { courseName?: string; email?: string };
    createdAt: string;
    transactionId: string;
    gateway_ref?: string;
    method?: string;
    studentPayment?: {
        totalCourseFee: number;
        paidAmount: number;
        dueAmount: number;
    } | null;
}

const ITEMS_PER_PAGE = 10;

export default function EnrollmentsPage() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchEnrollments = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('limit', ITEMS_PER_PAGE.toString());
            params.set('page', currentPage.toString());
            if (searchQuery) params.set('search', searchQuery);
            if (statusFilter) params.set('status', statusFilter);

            const res = await fetch(`/api/admin/enrollments?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setEnrollments(data.data);
                setTotalItems(data.total);
            }
        } catch (error) {
            console.error('Failed to fetch enrollments:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchQuery, statusFilter]);

    useEffect(() => {
        fetchEnrollments();
    }, [fetchEnrollments]);

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const formatAmount = (amount: number) => {
        return `৳${amount.toLocaleString()}`;
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status === statusFilter ? '' : status);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Stats summary
    const completedCount = enrollments.filter(e => e.status === 'completed').length;
    const pendingCount = enrollments.filter(e => e.status === 'pending').length;
    const totalRevOnPage = enrollments
        .filter(e => e.status === 'completed')
        .reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="space-y-6 pb-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-xs font-medium text-gray-400 mb-1">Total Enrollments</p>
                    <h3 className="text-xl font-bold text-[#1A1D1F]">{totalItems.toLocaleString()}</h3>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-xs font-medium text-gray-400 mb-1">Completed (this page)</p>
                    <h3 className="text-xl font-bold text-[#4BD37B]">{completedCount}</h3>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-xs font-medium text-gray-400 mb-1">Revenue (this page)</p>
                    <h3 className="text-xl font-bold text-[#6C5DD3]">{formatAmount(totalRevOnPage)}</h3>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <svg className="absolute left-3 top-2.5 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input
                        type="text"
                        placeholder="Search by name, email, or course..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-sm border border-gray-200 focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3]/30 outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    {['completed', 'pending', 'failed'].map((s) => (
                        <button
                            key={s}
                            onClick={() => handleStatusFilter(s)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === s
                                ? s === 'completed' ? 'bg-[#4BD37B] text-white shadow-lg shadow-[#4BD37B]/20'
                                    : s === 'pending' ? 'bg-[#FFAB7B] text-white shadow-lg shadow-[#FFAB7B]/20'
                                        : 'bg-[#FF4C4C] text-white shadow-lg shadow-[#FF4C4C]/20'
                                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
                            <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Course</th>
                            <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">This Payment</th>
                            <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Total Fee</th>
                            <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Paid</th>
                            <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Due</th>
                            <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gray-200"></div><div><div className="h-3 w-24 bg-gray-200 rounded mb-2"></div><div className="h-2 w-16 bg-gray-100 rounded"></div></div></div></td>
                                    <td className="p-5"><div className="h-3 w-20 bg-gray-200 rounded"></div></td>
                                    <td className="p-5"><div className="h-3 w-14 bg-gray-200 rounded"></div></td>
                                    <td className="p-5"><div className="h-3 w-14 bg-gray-200 rounded"></div></td>
                                    <td className="p-5"><div className="h-3 w-14 bg-gray-200 rounded"></div></td>
                                    <td className="p-5"><div className="h-3 w-14 bg-gray-200 rounded"></div></td>
                                    <td className="p-5"><div className="h-5 w-16 bg-gray-100 rounded-lg"></div></td>
                                    <td className="p-5"><div className="h-3 w-20 bg-gray-200 rounded"></div></td>
                                </tr>
                            ))
                        ) : enrollments.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="p-12 text-center">
                                    <div className="flex flex-col items-center text-gray-400">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-gray-300">
                                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                        </svg>
                                        <p className="text-sm font-bold">No enrollments found</p>
                                        <p className="text-xs mt-1">Try adjusting your search or filters</p>
                                    </div>
                                </td>
                            </tr>
                        ) : enrollments.map((enrollment) => {
                            const name = (enrollment.user as any)?.name || enrollment.metadata?.email || 'Unknown';
                            const email = (enrollment.user as any)?.email || enrollment.metadata?.email || '';
                            const course = enrollment.metadata?.courseName || 'Unknown Course';
                            const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

                            const totalFee = enrollment.studentPayment?.totalCourseFee || 0;
                            const paidAmount = enrollment.studentPayment?.paidAmount || 0;
                            const dueAmount = enrollment.studentPayment?.dueAmount || 0;
                            const paidPercent = totalFee > 0 ? Math.min(100, Math.round((paidAmount / totalFee) * 100)) : 0;

                            return (
                                <tr key={enrollment._id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C5DD3] to-[#8E8AFF] flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                                                {initials}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-[#1A1D1F]">{name}</h4>
                                                <p className="text-xs text-gray-400">{email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="text-sm font-medium text-[#1A1D1F]">{course}</span>
                                    </td>
                                    <td className="p-5">
                                        <span className="text-sm font-bold text-[#1A1D1F]">{formatAmount(enrollment.amount)}</span>
                                    </td>
                                    <td className="p-5">
                                        <span className="text-sm font-bold text-[#1A1D1F]">{totalFee > 0 ? formatAmount(totalFee) : '—'}</span>
                                    </td>
                                    <td className="p-5">
                                        <div>
                                            <span className="text-sm font-bold text-[#4BD37B]">{totalFee > 0 ? formatAmount(paidAmount) : '—'}</span>
                                            {totalFee > 0 && (
                                                <div className="mt-1.5">
                                                    <div className="w-[80px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${paidPercent >= 100 ? 'bg-[#4BD37B]' : paidPercent >= 50 ? 'bg-[#6C5DD3]' : 'bg-[#FFAB7B]'}`}
                                                            style={{ width: `${paidPercent}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-[9px] text-gray-400">{paidPercent}% paid</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        {totalFee > 0 ? (
                                            <span className={`text-sm font-bold ${dueAmount > 0 ? 'text-[#FF4C4C]' : 'text-[#4BD37B]'}`}>
                                                {dueAmount > 0 ? formatAmount(dueAmount) : 'Fully Paid'}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${enrollment.status === 'completed' ? 'bg-[#4BD37B]/10 text-[#4BD37B]' :
                                            enrollment.status === 'pending' ? 'bg-[#FFAB7B]/10 text-[#FF754C]' :
                                                'bg-[#FF4C4C]/10 text-[#FF4C4C]'
                                            }`}>
                                            {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <p className="text-sm text-[#1A1D1F]">{formatDate(enrollment.createdAt)}</p>
                                        <p className="text-[10px] text-gray-400">{formatTime(enrollment.createdAt)}</p>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-500 font-medium">
                            Showing <span className="text-[#1A1D1F] font-bold">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="text-[#1A1D1F] font-bold">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> of <span className="text-[#1A1D1F] font-bold">{totalItems}</span> enrollments
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-xl transition-all ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 hover:text-[#1A1D1F]'}`}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                            </button>

                            {Array.from({ length: totalPages }).map((_, idx) => {
                                const page = idx + 1;
                                // Show first, last, current, and neighbors
                                if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${currentPage === page
                                                ? 'bg-[#6C5DD3] text-white shadow-lg shadow-[#6C5DD3]/20'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#1A1D1F]'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                }
                                // Show dots
                                if (page === 2 && currentPage > 3) {
                                    return <span key="dots-start" className="text-gray-400 px-1">…</span>;
                                }
                                if (page === totalPages - 1 && currentPage < totalPages - 2) {
                                    return <span key="dots-end" className="text-gray-400 px-1">…</span>;
                                }
                                return null;
                            })}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-xl transition-all ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 hover:text-[#1A1D1F]'}`}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
