"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function AccountsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/students');
            const data = await res.json();
            if (data.success) {
                setStudents(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch accounts data:", error);
            toast.error("Failed to load accounts data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student =>
        student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentStudents = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Calculate Totals
    const overallTotal = filteredStudents.reduce((acc, curr) => acc + (curr.totalCourseFee || 0), 0);
    const overallPaid = filteredStudents.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
    const overallDue = filteredStudents.reduce((acc, curr) => acc + (curr.dueAmount || 0), 0);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Receivables</p>
                        <h3 className="text-2xl font-bold text-[#1A1D1F]">৳{overallTotal.toLocaleString()}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Collected</p>
                        <h3 className="text-2xl font-bold text-green-600">৳{overallPaid.toLocaleString()}</h3>
                    </div>
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Due</p>
                        <h3 className="text-2xl font-bold text-red-500">৳{overallDue.toLocaleString()}</h3>
                    </div>
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-50 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#1A1D1F]">Fee Transactions</h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search student or course..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-10 pr-4 py-2 bg-[#F4F4F4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all w-64"
                            />
                            <svg className="absolute left-3 top-2.5 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50 text-[11px] uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50">
                                <th className="p-4 pl-6 font-medium">Student Name</th>
                                <th className="p-4 font-medium">Course</th>
                                <th className="p-4 font-medium text-right">Total Fee</th>
                                <th className="p-4 font-medium text-right">Paid Amount</th>
                                <th className="p-4 font-medium text-right">Due Amount</th>
                                <th className="p-4 font-medium text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        Loading accounts data...
                                    </td>
                                </tr>
                            ) : currentStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                                        </div>
                                        <p>No transaction records found.</p>
                                    </td>
                                </tr>
                            ) : (
                                currentStudents.map((student, index) => (
                                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#6C5DD3] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                                                    {student.avatar ? (
                                                        <img src={student.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                                                    ) : (
                                                        student.fullName?.charAt(0) || 'U'
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#1A1D1F]">{student.fullName}</p>
                                                    <p className="text-xs text-gray-400">{student.mobileNo}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-[#1A1D1F] font-medium">{student.courseName}</td>
                                        <td className="p-4 text-right font-bold text-gray-600">৳{(student.totalCourseFee || 0).toLocaleString()}</td>
                                        <td className="p-4 text-right font-bold text-green-600">৳{(student.paidAmount || 0).toLocaleString()}</td>
                                        <td className="p-4 text-right font-bold text-red-500">৳{(student.dueAmount || 0).toLocaleString()}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${(student.dueAmount || 0) <= 0
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {(student.dueAmount || 0) <= 0 ? 'Clear' : 'Due'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                    <div className="p-4 border-t border-gray-50 flex items-center justify-between bg-white text-sm">
                        <span className="text-gray-500">
                            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredStudents.length)} of {filteredStudents.length} records
                        </span>
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
