"use client";
import React, { useState } from 'react';

const students = [
    {
        id: 1,
        name: "Cody Fisher",
        email: "cody.fisher@example.com",
        course: "UI/UX Design",
        batch: "Batch A",
        courseType: "Online",
        joinDate: "Oct 24, 2026",
        status: "Active",
        feeStatus: "Paid",
        avatar: "https://i.pravatar.cc/150?u=1",
        progress: 75,
    },
    {
        id: 2,
        name: "Esther Howard",
        email: "esther.howard@example.com",
        course: "Full Stack Dev",
        batch: "Batch B",
        courseType: "Offline",
        joinDate: "Oct 23, 2026",
        status: "Active",
        feeStatus: "Pending",
        avatar: "https://i.pravatar.cc/150?u=2",
        progress: 45,
    },
    {
        id: 3,
        name: "Jenny Wilson",
        email: "jenny.wilson@example.com",
        course: "Python AI",
        batch: "Batch A",
        courseType: "Online",
        joinDate: "Oct 21, 2026",
        status: "Locked",
        feeStatus: "Overdue",
        avatar: "https://i.pravatar.cc/150?u=3",
        progress: 20,
    },
    {
        id: 4,
        name: "Guy Hawkins",
        email: "guy.hawkins@example.com",
        course: "Flutter Mobile",
        batch: "Batch C",
        courseType: "Offline",
        joinDate: "Oct 20, 2026",
        status: "Active",
        feeStatus: "Paid",
        avatar: "https://i.pravatar.cc/150?u=4",
        progress: 90,
    },
    {
        id: 5,
        name: "Robert Fox",
        email: "robert.fox@example.com",
        course: "UI/UX Design",
        batch: "Batch A",
        courseType: "Online",
        joinDate: "Oct 18, 2026",
        status: "Inactive",
        feeStatus: "Paid",
        avatar: "https://i.pravatar.cc/150?u=5",
        progress: 0,
    },
    {
        id: 6,
        name: "Kristin Watson",
        email: "kristin.watson@example.com",
        course: "Digital Marketing",
        batch: "Batch B",
        courseType: "Online",
        joinDate: "Oct 15, 2026",
        status: "Active",
        feeStatus: "Paid",
        avatar: "https://i.pravatar.cc/150?u=6",
        progress: 60,
    },
    {
        id: 7,
        name: "Cameron Williamson",
        email: "cameron.williamson@example.com",
        course: "Flutter Mobile",
        batch: "Batch C",
        courseType: "Offline",
        joinDate: "Oct 12, 2026",
        status: "Active",
        feeStatus: "Pending",
        avatar: "https://i.pravatar.cc/150?u=7",
        progress: 35,
    },
    {
        id: 8,
        name: "Jerome Bell",
        email: "jerome.bell@example.com",
        course: "Python AI",
        batch: "Batch A",
        courseType: "Online",
        joinDate: "Oct 10, 2026",
        status: "Active",
        feeStatus: "Paid",
        avatar: "https://i.pravatar.cc/150?u=8",
        progress: 88,
    },
    {
        id: 9,
        name: "Darlene Robertson",
        email: "darlene.robertson@example.com",
        course: "UI/UX Design",
        batch: "Batch A",
        courseType: "Online",
        joinDate: "Oct 08, 2026",
        status: "Locked",
        feeStatus: "Overdue",
        avatar: "https://i.pravatar.cc/150?u=9",
        progress: 15,
    },
    {
        id: 10,
        name: "Theresa Webb",
        email: "theresa.webb@example.com",
        course: "Full Stack Dev",
        batch: "Batch B",
        courseType: "Online",
        joinDate: "Oct 05, 2026",
        status: "Active",
        feeStatus: "Paid",
        avatar: "https://i.pravatar.cc/150?u=10",
        progress: 55,
    },
];

const ITEMS_PER_PAGE = 5;

export default function StudentsPage() {
    const [currentPage, setCurrentPage] = useState(1);

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
                <button className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-colors flex items-center gap-2">
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
                        {currentStudents.map((student) => (
                            <tr key={student.id} className="group hover:bg-gray-50 transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                        <div>
                                            <h4 className="text-sm font-bold text-[#1A1D1F]">{student.name}</h4>
                                            <p className="text-xs text-gray-400">{student.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <h4 className="text-sm font-bold text-[#1A1D1F]">{student.course}</h4>
                                    <p className="text-[11px] px-2 py-0.5 bg-gray-100 rounded-lg inline-block mt-1 font-medium text-gray-500">{student.batch}</p>
                                </td>
                                <td className="p-6">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${student.courseType === 'Online' ? 'bg-[#8E8AFF]/10 text-[#6C5DD3]' : 'bg-[#FFAB7B]/10 text-[#FF754C]'
                                        }`}>
                                        {student.courseType}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${student.status === 'Active' ? 'bg-[#4BD37B]/10 text-[#4BD37B]' :
                                        student.status === 'Locked' ? 'bg-[#FF4C4C]/10 text-[#FF4C4C]' :
                                            'bg-gray-100 text-gray-500'
                                        }`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <span className={`text-xs font-bold ${student.feeStatus === 'Paid' ? 'text-[#4BD37B]' :
                                        student.feeStatus === 'Overdue' ? 'text-[#FF4C4C]' :
                                            'text-[#FFAB7B]'
                                        }`}>
                                        {student.feeStatus}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="w-[100px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${student.progress > 80 ? 'bg-[#4BD37B]' :
                                            student.progress > 40 ? 'bg-[#6C5DD3]' :
                                                'bg-[#FF4C4C]'
                                            }`} style={{ width: `${student.progress}%` }}></div>
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1 block">{student.progress}%</span>
                                </td>
                                <td className="p-6 text-right">
                                    <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-[#1A1D1F] transition-colors">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
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
        </div>
    );
}
