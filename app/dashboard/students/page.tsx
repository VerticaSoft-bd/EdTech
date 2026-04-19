"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CreateStudentModal from "@/app/components/CreateStudentModal";
import EditStudentModal from "@/app/components/EditStudentModal";
import ViewStudentModal from "@/app/components/ViewStudentModal";
import TransactionHistoryModal from "@/app/components/TransactionHistoryModal";
import CoursePurchaseHistoryModal from "@/app/components/CoursePurchaseHistoryModal";
import AddPaymentModal from "@/app/components/AddPaymentModal";

const ITEMS_PER_PAGE = 5;

function StudentsPageContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode'); // 'offline' or 'online'
    
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isCourseHistoryModalOpen, setIsCourseHistoryModalOpen] = useState(false);
    const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
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
    
    // Filter students based on mode
    const filteredStudents = students.filter(student => {
        if (!mode) return true;
        const studentMode = (student.courseMode || student.courseType || 'Online').toLowerCase();
        return studentMode.includes(mode.toLowerCase());
    });

    const filteredTotalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentStudents = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDeleteStudent = async (id: string) => {
        try {
            const res = await fetch(`/api/students/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                fetchStudents();
            } else {
                alert(data.message || "Failed to delete student");
            }
        } catch (error) {
            console.error("Delete Student Error:", error);
            alert("An error occurred while deleting student");
        }
    };

    return (
        <div className="space-y-6 pb-8">
            <div className="flex items-center justify-end">
                {(!mode || mode === 'offline') && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-colors flex items-center gap-2"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add Student
                    </button>
                )}
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider rounded-tl-[32px]">Student</th>
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Course Info</th>
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Fee Status</th>
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Progress</th>
                            <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right rounded-tr-[32px]">Action</th>
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
                                        <div className="flex items-center justify-between mt-1.5">
                                            <span className="text-[10px] font-bold text-[#1A1D1F]">{progress}%</span>
                                            <span className="text-[9px] text-gray-400 font-medium">
                                                {courseType === 'Offline' 
                                                    ? `${student.attendedClasses || 0}/${student.totalClasses || 0} Classes` 
                                                    : `${student.attendedClasses || 0}/${student.totalClasses || 0} Modules`}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className={`relative inline-block text-left ${openActionMenuId === (student._id || student.id) ? 'z-50' : ''}`}>
                                            <button
                                                onClick={() => setOpenActionMenuId(openActionMenuId === (student._id || student.id) ? null : (student._id || student.id))}
                                                className="p-2 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-[#1A1D1F] transition-colors"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                            </button>

                                            {openActionMenuId === (student._id || student.id) && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setOpenActionMenuId(null)}></div>
                                                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 p-2 z-50">
                                                        <button
                                                            onClick={() => { setSelectedStudent(student); setIsViewModalOpen(true); setOpenActionMenuId(null); }}
                                                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1A1D1F] rounded-lg transition-colors"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                            View Details
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedStudent(student); setIsEditModalOpen(true); setOpenActionMenuId(null); }}
                                                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1A1D1F] rounded-lg transition-colors"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedStudent(student); setIsAddPaymentModalOpen(true); setOpenActionMenuId(null); }}
                                                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1A1D1F] rounded-lg transition-colors"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                                            Add Payment
                                                        </button>
                                                        <div className="h-px bg-gray-100 my-1 mx-2"></div>
                                                        <button
                                                            onClick={() => { setSelectedStudent(student); setIsTransactionModalOpen(true); setOpenActionMenuId(null); }}
                                                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1A1D1F] rounded-lg transition-colors"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                                            Transactions
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedStudent(student); setIsCourseHistoryModalOpen(true); setOpenActionMenuId(null); }}
                                                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1A1D1F] rounded-lg transition-colors"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                                                            Course History
                                                        </button>
                                                        <div className="h-px bg-gray-100 my-1 mx-2"></div>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm(`Are you sure you want to delete ${name}? This will also delete their account and history.`)) {
                                                                    handleDeleteStudent(student._id || student.id);
                                                                }
                                                                setOpenActionMenuId(null);
                                                            }}
                                                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                            Delete Student
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="p-6 border-t border-gray-100 flex items-center justify-between rounded-b-[32px] bg-white">
                    <p className="text-xs text-gray-500 font-medium">
                        Showing <span className="text-[#1A1D1F] font-bold">{startIndex + 1}</span> to <span className="text-[#1A1D1F] font-bold">{Math.min(startIndex + ITEMS_PER_PAGE, filteredStudents.length)}</span> of <span className="text-[#1A1D1F] font-bold">{filteredStudents.length}</span> students
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-xl transition-all ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 hover:text-[#1A1D1F]'}`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                        </button>

                        {Array.from({ length: filteredTotalPages }).map((_, idx) => {
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
                            disabled={currentPage === filteredTotalPages}
                            className={`p-2 rounded-xl transition-all ${currentPage === filteredTotalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 hover:text-[#1A1D1F]'}`}
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

            {selectedStudent && (
                <EditStudentModal
                    isOpen={isEditModalOpen}
                    onClose={() => { setIsEditModalOpen(false); setSelectedStudent(null); }}
                    onSuccess={() => {
                        fetchStudents();
                        setIsEditModalOpen(false);
                        setSelectedStudent(null);
                    }}
                    student={selectedStudent}
                />
            )}

            {selectedStudent && (
                <ViewStudentModal
                    isOpen={isViewModalOpen}
                    onClose={() => { setIsViewModalOpen(false); setSelectedStudent(null); }}
                    student={selectedStudent}
                />
            )}

            {selectedStudent && (
                <TransactionHistoryModal
                    isOpen={isTransactionModalOpen}
                    onClose={() => { setIsTransactionModalOpen(false); setSelectedStudent(null); }}
                    student={selectedStudent}
                    onUpdate={fetchStudents}
                />
            )}

            {selectedStudent && (
                <AddPaymentModal 
                    isOpen={isAddPaymentModalOpen}
                    onClose={() => { setIsAddPaymentModalOpen(false); setSelectedStudent(null); }}
                    onSuccess={() => {
                        fetchStudents();
                        setIsAddPaymentModalOpen(false);
                        setSelectedStudent(null);
                    }}
                    student={selectedStudent}
                />
            )}

            {selectedStudent && (
                <CoursePurchaseHistoryModal
                    isOpen={isCourseHistoryModalOpen}
                    onClose={() => { setIsCourseHistoryModalOpen(false); setSelectedStudent(null); }}
                    student={selectedStudent}
                />
            )}
        </div>
    );
}

export default function StudentsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading page...</div>}>
            <StudentsPageContent />
        </Suspense>
    );
}
