"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface EditStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    student: any;
}

export default function EditStudentModal({ isOpen, onClose, onSuccess, student }: EditStudentModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);

    useEffect(() => {
        if (isOpen && student) {
            setFormData({
                courseName: student.courseName || '',
                fullName: student.fullName || '',
                fatherName: student.fatherName || '',
                motherName: student.motherName || '',
                residentialStatus: student.residentialStatus || 'Resident',
                maritalStatus: student.maritalStatus || 'Single',
                gender: student.gender || 'Male',
                dateOfBirth: student.dateOfBirth || '',
                presentAddress: student.presentAddress || '',
                depositCourseFee: student.paidAmount?.toString() || '',
                country: student.country || '',
                email: student.email || '',
                nidNo: student.nidNo || '',
                education: student.education || '',
                mobileNo: student.mobileNo || '',
                guardianMobileNo: student.guardianMobileNo || '',
                avatar: student.avatar || '',
                privacyPolicyAccepted: student.privacyPolicyAccepted || false,
                progress: student.progress || 0,
                totalClasses: student.totalClasses || 0,
                attendedClasses: student.attendedClasses || 0,
            });
            fetchCourses();
        }
    }, [isOpen, student]);

    const fetchCourses = async () => {
        setIsLoadingCourses(true);
        try {
            const res = await fetch('/api/courses');
            const data = await res.json();
            if (data.success) {
                setCourses(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch courses:", error);
            toast.error("Failed to load courses");
        } finally {
            setIsLoadingCourses(false);
        }
    };

    const [formData, setFormData] = useState({
        courseName: '',
        fullName: '',
        fatherName: '',
        motherName: '',
        residentialStatus: 'Resident',
        maritalStatus: 'Single',
        gender: 'Male',
        dateOfBirth: '',
        presentAddress: '',
        depositCourseFee: '',
        country: '',
        email: '',
        nidNo: '',
        education: '',
        mobileNo: '',
        guardianMobileNo: '',
        avatar: '',
        privacyPolicyAccepted: false,
        progress: 0,
        totalClasses: 0,
        attendedClasses: 0,
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: target.checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));

            // Auto-fill depositCourseFee if courseName is changed
            if (name === 'courseName') {
                const selectedCourse = courses.find((c: any) => c.title === value);
                if (selectedCourse && selectedCourse.regularFee !== undefined) {
                    setFormData(prev => ({ ...prev, depositCourseFee: selectedCourse.regularFee.toString() }));
                }
            }
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.privacyPolicyAccepted) {
            toast.error("You must accept the privacy policy.");
            return;
        }

        setIsLoading(true);

        const selectedCourse = courses.find((c: any) => c.title === formData.courseName);
        const totalFee = selectedCourse?.regularFee || 0;
        const paidAmount = Number(formData.depositCourseFee) || 0;
        const dueAmount = Math.max(0, totalFee - paidAmount);

        // Build submission payload matching the updated Student schema for accounts
        const submissionPayload = {
            ...formData,
            totalCourseFee: totalFee,
            paidAmount: paidAmount,
            dueAmount: dueAmount,
        };
        // Remove the frontend-only state key
        delete (submissionPayload as any).depositCourseFee;

        try {
            const response = await fetch('/api/students/' + student._id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionPayload),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Student updated successfully');

                // Reset form
                setFormData({
                    courseName: '', fullName: '', fatherName: '', motherName: '', residentialStatus: 'Resident', maritalStatus: 'Single', gender: 'Male', dateOfBirth: '', presentAddress: '', depositCourseFee: '', country: '', email: '', nidNo: '', education: '', mobileNo: '', guardianMobileNo: '', avatar: '', privacyPolicyAccepted: false, progress: 0, totalClasses: 0, attendedClasses: 0,
                });

                if (onSuccess) onSuccess();
                onClose();
            } else {
                toast.error(data.message || 'Something went wrong');
            }
        } catch (error) {
            toast.error('An error occurred during submission.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const selectedCourse = courses.find((c: any) => c.title === formData.courseName);
    const totalFee = selectedCourse?.regularFee || 0;
    const paidAmount = Number(formData.depositCourseFee) || 0;
    const dueAmount = Math.max(0, totalFee - paidAmount);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
            <div className="bg-white rounded-[24px] shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10">
                    <h3 className="text-xl font-bold text-[#1A1D1F]">Edit Student Registration</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                    <form id="createStudentForm" onSubmit={handleSubmit} className="space-y-8">
                        {/* Academic Information */}
                        <div>
                            <h3 className="text-lg font-bold text-[#1A1D1F] mb-4 pb-2 border-b border-gray-100">Academic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-700">Course Name <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select
                                            name="courseName"
                                            value={formData.courseName}
                                            onChange={handleChange}
                                            required
                                            disabled={isLoadingCourses}
                                            className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-[#1A1D1F] appearance-none"
                                        >
                                            <option value="" disabled>{isLoadingCourses ? 'Loading courses...' : 'Select a course'}</option>
                                            {courses.map((course: any) => (
                                                <option key={course._id} value={course.title}>
                                                    {course.title} - ৳{course.regularFee || 0}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-bold text-[#1A1D1F] mb-4 pb-2 border-b border-gray-100">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Avatar Upload */}
                                <div className="space-y-2 md:col-span-2 flex flex-col items-center justify-center py-4">
                                    <div className="relative group cursor-pointer w-24 h-24 rounded-full border-2 border-dashed border-gray-300 hover:border-[#6C5DD3] transition-colors overflow-hidden">
                                        {formData.avatar ? (
                                            <img src={formData.avatar} alt="Avatar preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 group-hover:text-[#6C5DD3] transition-colors bg-gray-50">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                                    <circle cx="12" cy="13" r="4"></circle>
                                                </svg>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 font-medium">Upload Profile Photo (Optional)</p>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Enter full name" className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-[#1A1D1F]" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Father's Name <span className="text-red-500">*</span></label>
                                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required placeholder="Enter father's name" className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-[#1A1D1F]" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Mother's Name <span className="text-red-500">*</span></label>
                                    <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} required placeholder="Enter mother's name" className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-[#1A1D1F]" />
                                </div>

                                {/* Status Selectors */}
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700">Residential Status <span className="text-red-500">*</span></label>
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="residentialStatus" value="Resident" checked={formData.residentialStatus === 'Resident'} onChange={handleChange} className="w-4 h-4 text-[#6C5DD3] focus:ring-[#6C5DD3] border-gray-300" />
                                            <span className="text-sm text-gray-600">Resident</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="residentialStatus" value="Non-Resident" checked={formData.residentialStatus === 'Non-Resident'} onChange={handleChange} className="w-4 h-4 text-[#6C5DD3] focus:ring-[#6C5DD3] border-gray-300" />
                                            <span className="text-sm text-gray-600">Non-Resident</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700">Marital Status <span className="text-red-500">*</span></label>
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="maritalStatus" value="Single" checked={formData.maritalStatus === 'Single'} onChange={handleChange} className="w-4 h-4 text-[#6C5DD3] focus:ring-[#6C5DD3] border-gray-300" />
                                            <span className="text-sm text-gray-600">Single</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="maritalStatus" value="Married" checked={formData.maritalStatus === 'Married'} onChange={handleChange} className="w-4 h-4 text-[#6C5DD3] focus:ring-[#6C5DD3] border-gray-300" />
                                            <span className="text-sm text-gray-600">Married</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="maritalStatus" value="Others" checked={formData.maritalStatus === 'Others'} onChange={handleChange} className="w-4 h-4 text-[#6C5DD3] focus:ring-[#6C5DD3] border-gray-300" />
                                            <span className="text-sm text-gray-600">Others</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700">Gender <span className="text-red-500">*</span></label>
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} className="w-4 h-4 text-[#6C5DD3] focus:ring-[#6C5DD3] border-gray-300" />
                                            <span className="text-sm text-gray-600">Male</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} className="w-4 h-4 text-[#6C5DD3] focus:ring-[#6C5DD3] border-gray-300" />
                                            <span className="text-sm text-gray-600">Female</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-[#1A1D1F]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">National ID (NID) No. <span className="text-red-500">*</span></label>
                                    <input type="text" name="nidNo" value={formData.nidNo} onChange={handleChange} required placeholder="Enter NID number" className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-[#1A1D1F]" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Education <span className="text-red-500">*</span></label>
                                    <input type="text" name="education" value={formData.education} onChange={handleChange} required placeholder="e.g. BSc in Computer Science" className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-[#1A1D1F]" />
                                </div>
                            </div>
                        </div>

                        {/* Contact & Address */}
                        <div>
                            <h3 className="text-lg font-bold text-[#1A1D1F] mb-4 pb-2 border-b border-gray-100">Contact & Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="student@example.com" className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-[#1A1D1F]" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Mobile No. <span className="text-red-500">*</span></label>
                                    <input type="tel" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required placeholder="Enter mobile number" className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-[#1A1D1F]" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Guardian Mobile No. <span className="text-red-500">*</span></label>
                                    <input type="tel" name="guardianMobileNo" value={formData.guardianMobileNo} onChange={handleChange} required placeholder="Enter guardian mobile number" className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-[#1A1D1F]" />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-700">Present Address <span className="text-red-500">*</span></label>
                                    <input type="text" name="presentAddress" value={formData.presentAddress} onChange={handleChange} required placeholder="Street address, apartment, suite, etc." className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-[#1A1D1F]" />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-700">Country <span className="text-red-500">*</span></label>
                                    <input type="text" name="country" value={formData.country} onChange={handleChange} required placeholder="Country name" className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-[#1A1D1F]" />
                                </div>
                            </div>
                        </div>

                        {/* Course Fee Payment */}
                        <div>
                            <h3 className="text-lg font-bold text-[#1A1D1F] mb-4 pb-2 border-b border-gray-100">Payment Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-700">Course Fee Deposit <span className="text-red-500">*</span></label>
                                    <input type="number" name="depositCourseFee" value={formData.depositCourseFee} onChange={handleChange} required placeholder="Enter deposit amount" className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-[#1A1D1F]" />
                                    {formData.courseName && (
                                        <div className="mt-3 p-4 bg-white rounded-[16px] border border-gray-200">
                                            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                                                <span className="text-sm font-medium text-gray-600">Total Course Fee</span>
                                                <span className="text-sm font-bold text-[#1A1D1F]">৳{totalFee}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-600">Paid Amount</span>
                                                <span className="text-sm font-bold text-green-600">৳{paidAmount}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-600">Due Amount</span>
                                                <span className="text-sm font-bold text-red-500">৳{dueAmount}</span>
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500 mt-2">* This field auto-fills with the selected course's regular fee, but you can adjust the deposit amount.</p>
                                </div>

                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-700">Course Progress ({student.courseMode === 'Offline' ? 'Attendance' : 'Completion'}) %</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            name="progress"
                                            min="0"
                                            max="100"
                                            value={formData.progress}
                                            onChange={handleChange}
                                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6C5DD3]"
                                        />
                                        <div className="w-12 text-center font-bold text-[#1A1D1F] px-2 py-1 bg-gray-100 rounded-lg text-sm">
                                            {formData.progress}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attendance Tracker */}
                        <div>
                            <h3 className="text-lg font-bold text-[#1A1D1F] mb-4 pb-2 border-b border-gray-100">
                                {student.courseMode === 'Offline' ? 'Attendance Tracker' : 'Module Progress Tracker'}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">
                                        {student.courseMode === 'Offline' ? 'Total Classes' : 'Total Modules'} <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        name="totalClasses" 
                                        value={formData.totalClasses} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder={student.courseMode === 'Offline' ? 'e.g. 30' : 'e.g. 12'} 
                                        className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-[#1A1D1F]" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">
                                        {student.courseMode === 'Offline' ? 'Attended Classes' : 'Completed Modules'} <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        name="attendedClasses" 
                                        value={formData.attendedClasses} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder={student.courseMode === 'Offline' ? 'e.g. 18' : 'e.g. 8'} 
                                        className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-[#1A1D1F]" 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Privacy Policy */}
                        <div className="pt-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        name="privacyPolicyAccepted"
                                        checked={formData.privacyPolicyAccepted}
                                        onChange={handleChange}
                                        required
                                        className="peer w-5 h-5 appearance-none rounded border-2 border-gray-300 checked:bg-[#6C5DD3] checked:border-[#6C5DD3] transition-all cursor-pointer"
                                    />
                                    <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                    I accept the <a href="#" className="font-bold text-[#6C5DD3] hover:underline">Privacy Policy</a> and agree to provide accurate information.
                                </span>
                            </label>
                        </div>
                    </form>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3 z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-5 py-2.5 rounded-[12px] font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        form="createStudentForm"
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-[#6C5DD3] text-white rounded-[12px] font-semibold hover:bg-[#5b4eb3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#6C5DD3]/20"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : (
                            'Update Student'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
