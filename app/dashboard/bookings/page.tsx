"use client";
import React, { useState, useEffect } from 'react';

const ITEMS_PER_PAGE = 10;

export default function BookingsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterCourse, setFilterCourse] = useState('All');

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/seminar-bookings');
            const data = await res.json();
            if (data.success) {
                setBookings(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;
        try {
            const res = await fetch('/api/seminar-bookings', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                fetchBookings();
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const uniqueCourses = ['All', ...new Set(bookings.map(b => b.courseTitle || 'General Seminar'))];

    const filteredBookings = filterCourse === 'All'
        ? bookings
        : bookings.filter(b => (b.courseTitle || 'General Seminar') === filterCourse);

    const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentBookings = filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#1A1D1F]">Demo Class Bookings</h1>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">Manage your live seminar registrations</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Candidate Count */}
                    <div className="hidden sm:flex items-center gap-2 bg-[#6C5DD3]/10 px-4 py-2.5 rounded-2xl border border-[#6C5DD3]/20">
                        <span className="text-[10px] font-black text-[#6C5DD3] uppercase tracking-widest">Candidates</span>
                        <span className="text-sm font-black text-[#6C5DD3]">{filteredBookings.length}</span>
                    </div>

                    <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-gray-200">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#6C5DD3]"></div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filter by Course</span>
                        </div>
                        <div className="h-4 w-[1px] bg-gray-100 mx-1"></div>
                        <select
                            value={filterCourse}
                            onChange={(e) => {
                                setFilterCourse(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="text-sm font-bold text-[#1A1D1F] bg-transparent border-none focus:ring-0 cursor-pointer min-w-[160px] outline-none"
                        >
                            {uniqueCourses.map(course => (
                                <option key={course} value={course}>{course}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Candidate</th>
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Profession</th>
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Course/Class</th>
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400">Loading bookings...</td>
                            </tr>
                        ) : currentBookings.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400">No bookings found</td>
                            </tr>
                        ) : currentBookings.map((booking) => (
                            <tr key={booking._id} className="group hover:bg-gray-50 transition-colors">
                                <td className="p-6">
                                    <p className="text-sm font-bold text-[#1A1D1F]">
                                        {new Date(booking.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                                        {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </td>
                                <td className="p-6">
                                    <h4 className="text-sm font-bold text-[#1A1D1F]">{booking.name}</h4>
                                    <p className="text-xs text-gray-400 font-medium">{booking.phone}</p>
                                    <p className="text-[11px] text-[#6C5DD3] font-bold">{booking.email}</p>
                                </td>
                                <td className="p-6 text-sm font-medium text-gray-600">
                                    {booking.profession}
                                </td>
                                <td className="p-6">
                                    <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-lg inline-block">
                                        {booking.courseTitle || 'General Seminar'}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                        booking.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                    }`}>
                                        {booking.status || 'Pending'}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <button
                                        onClick={() => handleDelete(booking._id)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete Booking"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-500 font-medium">
                            Showing <span className="text-[#1A1D1F] font-bold">{startIndex + 1}</span> to <span className="text-[#1A1D1F] font-bold">{Math.min(startIndex + ITEMS_PER_PAGE, filteredBookings.length)}</span> of <span className="text-[#1A1D1F] font-bold">{filteredBookings.length}</span> bookings
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
