import React from "react";

interface ViewStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: any;
}

export default function ViewStudentModal({ isOpen, onClose, student }: ViewStudentModalProps) {
    if (!isOpen || !student) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
            <div className="bg-white rounded-[24px] shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10">
                    <h3 className="text-xl font-bold text-[#1A1D1F]">Student Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                    {/* Header Info */}
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                        {student.avatar ? (
                            <img src={student.avatar} alt={student.fullName} className="w-20 h-20 rounded-full object-cover shadow-sm bg-gray-100" />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-[#6C5DD3] text-white flex items-center justify-center text-2xl font-bold">
                                {student.fullName?.charAt(0) || '?'}
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold text-[#1A1D1F]">{student.fullName}</h2>
                            <p className="text-gray-500">{student.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                                {student.courseName}
                            </span>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Personal Info</h4>
                                <div className="space-y-2 text-sm text-[#1A1D1F]">
                                    <p><span className="font-medium text-gray-500">Father's Name:</span> {student.fatherName}</p>
                                    <p><span className="font-medium text-gray-500">Mother's Name:</span> {student.motherName}</p>
                                    <p><span className="font-medium text-gray-500">Date of Birth:</span> {student.dateOfBirth}</p>
                                    <p><span className="font-medium text-gray-500">Gender:</span> {student.gender}</p>
                                    <p><span className="font-medium text-gray-500">Marital Status:</span> {student.maritalStatus}</p>
                                    <p><span className="font-medium text-gray-500">NID No:</span> {student.nidNo}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact</h4>
                                <div className="space-y-2 text-sm text-[#1A1D1F]">
                                    <p><span className="font-medium text-gray-500">Mobile No:</span> {student.mobileNo}</p>
                                    <p><span className="font-medium text-gray-500">Guardian Mobile:</span> {student.guardianMobileNo}</p>
                                    <p><span className="font-medium text-gray-500">Address:</span> {student.presentAddress}, {student.country}</p>
                                    <p><span className="font-medium text-gray-500">Residency:</span> {student.residentialStatus}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Academic & Financial</h4>
                                <div className="space-y-2 text-sm text-[#1A1D1F]">
                                    <p><span className="font-medium text-gray-500">Education:</span> {student.education}</p>
                                    <p><span className="font-medium text-gray-500">Total Course Fee:</span> ৳{student.totalCourseFee}</p>
                                    <p><span className="font-medium text-gray-500">Paid Amount:</span> <span className="text-green-600 font-bold">৳{student.paidAmount}</span></p>
                                    <p><span className="font-medium text-gray-500">Due Amount:</span> <span className="text-red-500 font-bold">৳{student.dueAmount}</span></p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Course Progress</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-500">Overall Progress</span>
                                        <span className="font-bold text-[#6C5DD3]">{student.progress || 0}%</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#6C5DD3] to-[#8E8AFF] rounded-full transition-all duration-500" 
                                            style={{ width: `${student.progress || 0}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                        <span className="text-xs font-bold text-gray-500 uppercase">
                                            {student.courseMode === 'Offline' ? 'Attendance' : 'Modules'}
                                        </span>
                                        <span className="text-sm font-bold text-[#1A1D1F]">
                                            {student.attendedClasses || 0} / {student.totalClasses || 0} {student.courseMode === 'Offline' ? 'Classes' : 'Modules'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">System Info</h4>
                                <div className="space-y-2 text-sm text-[#1A1D1F]">
                                    <p><span className="font-medium text-gray-500">Joined On:</span> {new Date(student.createdAt).toLocaleDateString()}</p>
                                    <p><span className="font-medium text-gray-500">Privacy Policy:</span> {student.privacyPolicyAccepted ? 'Accepted' : 'Pending'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
