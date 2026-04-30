import React from "react";

interface CoursePurchaseHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: any;
}

export default function CoursePurchaseHistoryModal({ isOpen, onClose, student }: CoursePurchaseHistoryModalProps) {
    if (!isOpen || !student) return null;

    const [courses, setCourses] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchEnrollments = async () => {
        if (!student?.email) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/students?email=${encodeURIComponent(student.email)}`);
            const data = await res.json();
            if (data.success) {
                setCourses(data.data.map((s: any) => ({
                    name: s.courseName || 'Unassigned',
                    date: new Date(s.createdAt).toLocaleDateString(),
                    fee: s.totalCourseFee || 0,
                    status: s.status || 'Active',
                    progress: s.progress || 0,
                })));
            }
        } catch (error) {
            console.error("Failed to fetch enrollments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        if (isOpen && student) {
            fetchEnrollments();
        }
    }, [isOpen, student]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
            <div className="bg-white rounded-[24px] shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10">
                    <h3 className="text-xl font-bold text-[#1A1D1F]">Course Purchase History</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                    <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-4">
                        {student.avatar ? (
                            <img src={student.avatar} alt={student.fullName} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-[#6C5DD3] text-white flex items-center justify-center font-bold">
                                {student.fullName?.charAt(0) || '?'}
                            </div>
                        )}
                        <div>
                            <h4 className="font-bold text-[#1A1D1F]">{student.fullName}</h4>
                            <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[16px] border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">Course Name</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">Date Enrolled</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase text-right">Fee</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">Loading course history...</td>
                                    </tr>
                                ) : courses.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">No course history found.</td>
                                    </tr>
                                ) : (
                                    courses.map((course, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-bold text-[#1A1D1F]">{course.name}</td>
                                            <td className="p-4 text-gray-600">{course.date}</td>
                                            <td className="p-4 font-bold text-gray-600 text-right">৳{course.fee}</td>
                                            <td className="p-4 text-center">
                                                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#6C5DD3]/10 text-[#6C5DD3]">
                                                    {course.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
