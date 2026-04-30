"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface AddCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    student: any;
}

export default function AddCourseModal({ isOpen, onClose, onSuccess, student }: AddCourseModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [studentCourses, setStudentCourses] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<{
        code: string;
        discountType: string;
        discountValue: number;
    } | null>(null);
    
    const [formData, setFormData] = useState({
        courseName: '',
        paidAmount: '',
        paymentMethod: 'Cash',
        description: '',
        couponCode: '',
    });

    useEffect(() => {
        if (isOpen && student) {
            fetchData();
            // Reset form when opening for a new student
            setFormData({
                courseName: '',
                paidAmount: '',
                paymentMethod: 'Cash',
                description: '',
                couponCode: '',
            });
            setAppliedCoupon(null);
        }
    }, [isOpen, student]);

    const fetchData = async () => {
        setIsLoadingData(true);
        try {
            // Fetch all active courses
            const coursesRes = await fetch('/api/courses');
            const coursesData = await coursesRes.json();
            
            // Fetch student's current enrollments
            const enrollmentsRes = await fetch(`/api/students?email=${student.email}`);
            const enrollmentsData = await enrollmentsRes.json();

            if (coursesData.success) {
                // Filter only active courses
                setCourses(coursesData.data.filter((c: any) => c.status === 'Active'));
            }
            if (enrollmentsData.success) {
                setStudentCourses(enrollmentsData.data);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Failed to load data");
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-fill fee if course is selected
        if (name === 'courseName') {
            const selectedCourse = courses.find(c => c.title === value);
            if (selectedCourse) {
                // You might want to auto-fill the whole amount or leave it empty
                // setFormData(prev => ({ ...prev, paidAmount: selectedCourse.regularFee.toString() }));
            }
        }
    };

    const handleApplyCoupon = async () => {
        if (!formData.couponCode) {
            toast.error("Please enter a coupon code");
            return;
        }

        setIsApplyingCoupon(true);
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: formData.couponCode })
            });
            const data = await res.json();

            if (data.success) {
                setAppliedCoupon(data.data);
                toast.success(data.message);
            } else {
                toast.error(data.message);
                setAppliedCoupon(null);
            }
        } catch (error) {
            console.error("Failed to apply coupon:", error);
            toast.error("Error applying coupon");
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.courseName) {
            toast.error("Please select a course");
            return;
        }

        const isAlreadyEnrolled = studentCourses.some(c => c.courseName === formData.courseName);
        if (isAlreadyEnrolled) {
            toast.error("Student is already enrolled in this course");
            return;
        }

        setIsLoading(true);

        const selectedCourse = courses.find(c => c.title === formData.courseName);
        const regularFee = selectedCourse?.regularFee || 0;
        
        // Calculate discount
        let discount = 0;
        if (appliedCoupon) {
            if (appliedCoupon.discountType === 'Percentage') {
                discount = (regularFee * appliedCoupon.discountValue) / 100;
            } else {
                discount = appliedCoupon.discountValue;
            }
        }

        const totalFee = Math.max(0, regularFee - discount);
        const paidAmount = Number(formData.paidAmount) || 0;
        const dueAmount = Math.max(0, totalFee - paidAmount);

        // Build submission payload based on existing student record
        const submissionPayload = {
            ...student,
            courseName: formData.courseName,
            totalCourseFee: totalFee,
            paidAmount: paidAmount,
            dueAmount: dueAmount,
            discountAmount: discount,
            appliedCoupon: appliedCoupon?.code || '',
            paymentMethod: formData.paymentMethod,
            description: formData.description,
            // Reset progress and enrollment details for the new course
            progress: 0,
            attendedClasses: 0,
            completedModuleIds: [],
            privacyPolicyAccepted: true, // Re-confirming by adding course
        };
        
        // Remove MongoDB specific fields to ensure a new record is created
        delete submissionPayload._id;
        delete submissionPayload.id;
        delete submissionPayload.createdAt;
        delete submissionPayload.updatedAt;
        delete submissionPayload.__v;

        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionPayload),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Course added successfully");
                
                // If an invoice was generated, open it in a new tab
                if (data.invoiceId) {
                    window.open(`/invoice/${data.invoiceId}`, '_blank');
                }

                onSuccess();
                onClose();
            } else {
                toast.error(data.message || "Failed to add course");
            }
        } catch (error) {
            toast.error("An error occurred during submission");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !student) return null;

    const selectedCourse = courses.find(c => c.title === formData.courseName);
    const regularFee = selectedCourse?.regularFee || 0;
    
    // Calculate current discount for display
    let currentDiscount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.discountType === 'Percentage') {
            currentDiscount = (regularFee * appliedCoupon.discountValue) / 100;
        } else {
            currentDiscount = appliedCoupon.discountValue;
        }
    }
    
    const totalFee = Math.max(0, regularFee - currentDiscount);
    const paidAmount = Number(formData.paidAmount) || 0;
    const dueAmount = Math.max(0, totalFee - paidAmount);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
                    <div>
                        <h3 className="text-xl font-bold text-[#1A1D1F]">Add Course</h3>
                        <p className="text-xs text-gray-500 mt-1">Enroll student in an additional course</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 px-8 py-6 space-y-6">
                    {/* Student Identity Card */}
                    <div className="p-5 bg-gradient-to-br from-[#6C5DD3]/5 to-transparent rounded-[24px] border border-[#6C5DD3]/10 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-[#6C5DD3] text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-[#6C5DD3]/20">
                            {student.fullName?.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1A1D1F] text-lg">{student.fullName}</h4>
                            <p className="text-sm text-gray-500 font-medium">{student.email}</p>
                        </div>
                    </div>

                    {/* Active Enrollments */}
                    <div>
                        <label className="block text-sm font-bold text-[#1A1D1F] mb-3">Currently Enrolled Courses</label>
                        <div className="flex flex-wrap gap-2">
                            {isLoadingData ? (
                                <div className="flex gap-2">
                                    <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-lg"></div>
                                    <div className="w-24 h-8 bg-gray-100 animate-pulse rounded-lg"></div>
                                </div>
                            ) : studentCourses.length > 0 ? (
                                studentCourses.map((c, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
                                        <div className="w-2 h-2 rounded-full bg-[#4BD37B]"></div>
                                        <span className="text-xs font-bold text-[#1A1D1F]">{c.courseName}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 italic">No active enrollments found.</p>
                            )}
                        </div>
                    </div>

                    <form id="addCourseForm" onSubmit={handleSubmit} className="space-y-5 pt-4 border-t border-gray-50">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#1A1D1F]">Select New Course <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select
                                    name="courseName"
                                    value={formData.courseName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-4 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:ring-2 focus:ring-[#6C5DD3] outline-none transition-all text-sm font-bold text-[#1A1D1F] appearance-none"
                                >
                                    <option value="">Select a course</option>
                                    {courses
                                        .filter(c => !studentCourses.some(sc => sc.courseName === c.title))
                                        .map(c => (
                                            <option key={c._id} value={c.title}>{c.title} (৳{c.regularFee})</option>
                                        ))
                                    }
                                </select>
                                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1A1D1F]">Initial Payment (৳) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    name="paidAmount"
                                    value={formData.paidAmount}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter amount"
                                    className="w-full px-5 py-4 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:ring-2 focus:ring-[#6C5DD3] outline-none transition-all text-sm font-bold text-[#1A1D1F]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1A1D1F]">Payment Method</label>
                                <div className="relative">
                                    <select
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:ring-2 focus:ring-[#6C5DD3] outline-none transition-all text-sm font-bold text-[#1A1D1F] appearance-none"
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="bKash">bKash</option>
                                        <option value="Nagad">Nagad</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Coupon Code Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#1A1D1F]">Coupon Code</label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    name="couponCode"
                                    value={formData.couponCode}
                                    onChange={handleChange}
                                    placeholder="Enter coupon code"
                                    className="flex-1 px-5 py-3.5 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:ring-2 focus:ring-[#6C5DD3] outline-none transition-all text-sm font-bold text-[#1A1D1F] uppercase"
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyCoupon}
                                    disabled={isApplyingCoupon || !formData.couponCode}
                                    className="px-6 py-3.5 bg-[#1A1D1F] text-white rounded-[16px] font-bold hover:bg-black transition-all disabled:opacity-50 text-sm"
                                >
                                    {isApplyingCoupon ? '...' : 'Apply'}
                                </button>
                            </div>
                        </div>

                        {formData.courseName && (
                            <div className="p-5 bg-white rounded-[24px] border border-gray-100 shadow-sm space-y-3 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">Course Regular Fee</span>
                                    <span className="text-[#1A1D1F] font-bold">৳{regularFee}</span>
                                </div>
                                
                                {appliedCoupon && (
                                    <div className="flex justify-between items-center text-green-600 bg-green-50/50 p-2.5 rounded-xl border border-green-100/50">
                                        <span className="text-sm font-medium">Coupon Discount ({appliedCoupon.code})</span>
                                        <span className="text-sm font-bold">-৳{currentDiscount}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center py-2 border-t border-gray-50">
                                    <span className="text-gray-700 font-bold">Total Course Fee</span>
                                    <span className="text-[#6C5DD3] font-bold text-lg">৳{totalFee}</span>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">Initial Deposit</span>
                                    <span className="text-[#4BD37B] font-bold">৳{paidAmount}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                                    <span className="text-gray-700 font-bold">Remaining Due</span>
                                    <span className="text-[#FF4C4C] font-bold text-lg">৳{dueAmount}</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#1A1D1F]">Payment Description / Note</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Add any specific notes for this enrollment payment..."
                                className="w-full px-5 py-4 bg-[#F4F4F4] rounded-[16px] border border-transparent focus:ring-2 focus:ring-[#6C5DD3] outline-none transition-all text-sm font-medium text-[#1A1D1F] resize-none"
                            ></textarea>
                        </div>
                    </form>
                </div>

                <div className="px-8 py-6 border-t border-gray-50 bg-white flex justify-end gap-3">
                    <button 
                        onClick={onClose} 
                        className="px-6 py-3 rounded-[16px] font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        form="addCourseForm"
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-[#6C5DD3] text-white rounded-[16px] font-bold hover:bg-[#5b4eb3] transition-all disabled:opacity-50 shadow-xl shadow-[#6C5DD3]/20 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                Processing...
                            </>
                        ) : (
                            "Confirm Enrollment"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
