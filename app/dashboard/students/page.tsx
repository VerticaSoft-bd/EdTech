"use client";
import React, { useState, useEffect } from 'react';
import CreateStudentModal from "@/app/components/CreateStudentModal";

const ITEMS_PER_PAGE = 5;

export default function StudentsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/students');
            const data = await res.json();
            if (data.success) {
                setStudents(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch students:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentStudents = students.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="space-y-6 pb-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#1A1D1F]">Student Management</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-colors flex items-center gap-2"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Student
                </button>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Course Info</th>
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Fee Status</th>
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Progress</th>
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-400">Loading students...</td>
                            </tr>
                        ) : currentStudents.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-400">No students found</td>
                            </tr>
                        ) : currentStudents.map((student) => {
                            // Map real DB fields to display correctly
                            const name = student.fullName || student.name || 'Unknown';
                            const course = student.courseName || student.course || 'Unassigned';
                            const courseType = student.courseMode || student.courseType || 'Online';
                            const status = student.status || 'Active';
                            const feeStatus = student.feeStatus || 'Pending';
                            const progress = student.progress || 0;
                            const avatar = student.avatar || `https://i.pravatar.cc/150?u=${student._id || student.id}`;

                            return (
                                <tr key={student._id || student.id} className="group hover:bg-gray-50 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                            <div>
                                                <h4 className="text-sm font-bold text-[#1A1D1F]">{name}</h4>
                                                <p className="text-xs text-gray-400">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <h4 className="text-sm font-bold text-[#1A1D1F]">{course}</h4>
                                        <p className="text-[11px] px-2 py-0.5 bg-gray-100 rounded-lg inline-block mt-1 font-medium text-gray-500">{student.education || student.batch || 'General'}</p>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${courseType === 'Online' ? 'bg-[#8E8AFF]/10 text-[#6C5DD3]' : 'bg-[#FFAB7B]/10 text-[#FF754C]'
                                            }`}>
                                            {courseType}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${status === 'Active' ? 'bg-[#4BD37B]/10 text-[#4BD37B]' :
                                            status === 'Locked' ? 'bg-[#FF4C4C]/10 text-[#FF4C4C]' :
                                                'bg-gray-100 text-gray-500'
                                            }`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <span className={`text-xs font-bold ${feeStatus === 'Paid' ? 'text-[#4BD37B]' :
                                            feeStatus === 'Overdue' ? 'text-[#FF4C4C]' :
                                                'text-[#FFAB7B]'
                                            }`}>
                                            {feeStatus}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="w-[100px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${progress > 80 ? 'bg-[#4BD37B]' :
                                                progress > 40 ? 'bg-[#6C5DD3]' :
                                                    'bg-[#FF4C4C]'
                                                }`} style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-1 block">{progress}%</span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-[#1A1D1F] transition-colors">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-500 font-medium">
                        Showing <span className="text-[#1A1D1F] font-bold">{startIndex + 1}</span> to <span className="text-[#1A1D1F] font-bold">{Math.min(startIndex + ITEMS_PER_PAGE, students.length)}</span> of <span className="text-[#1A1D1F] font-bold">{students.length}</span> students
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
            </div>

            <CreateStudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchStudents();
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}
