"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function AddStudentPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

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
        zipCode: '',
        city: '',
        country: '',
        email: '',
        nidNo: '',
        education: '',
        mobileNo: '',
        guardianMobileNo: '',
        privacyPolicyAccepted: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: target.checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.privacyPolicyAccepted) {
            toast.error("You must accept the privacy policy.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                router.push('/dashboard/students');
                router.refresh();
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

    return (
        <div className="space-y-6 pb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#1A1D1F]">Add New Student</h2>
                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <Link href="/dashboard/students" className="hover:text-[#6C5DD3] transition-colors">Students</Link>
                        <span>/</span>
                        <span className="text-[#1A1D1F] font-medium">Add Student</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-8">

                {/* Academic Information */}
                <div>
                    <h3 className="text-lg font-bold text-[#1A1D1F] mb-4 pb-2 border-b border-gray-100">Academic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700">Course Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="courseName"
                                value={formData.courseName} onChange={handleChange}
                                required
                                placeholder="e.g. Graphic Design Masterclass"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50 focus:bg-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div>
                    <h3 className="text-lg font-bold text-[#1A1D1F] mb-4 pb-2 border-b border-gray-100">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Enter full name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50 focus:bg-white" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Father's Name <span className="text-red-500">*</span></label>
                            <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required placeholder="Enter father's name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50 focus:bg-white" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Mother's Name <span className="text-red-500">*</span></label>
                            <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} required placeholder="Enter mother's name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50 focus:bg-white" />
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
                            <label className="text-sm font-bold text-gray-700">Date of Birth (DD,MM,YYYY) <span className="text-red-500">*</span></label>
                            <input type="text" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required placeholder="DD,MM,YYYY" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50 focus:bg-white" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">National ID (NID) No. <span className="text-red-500">*</span></label>
                            <input type="text" name="nidNo" value={formData.nidNo} onChange={handleChange} required placeholder="Enter NID number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50 focus:bg-white" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Education <span className="text-red-500">*</span></label>
                            <input type="text" name="education" value={formData.education} onChange={handleChange} required placeholder="e.g. BSc in Computer Science" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50 focus:bg-white" />
                        </div>
                    </div>
                </div>

                {/* Contact & Address */}
                <div>
                    <h3 className="text-lg font-bold text-[#1A1D1F] mb-4 pb-2 border-b border-gray-100">Contact & Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="student@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50 focus:bg-white" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Mobile No. <span className="text-red-500">*</span></label>
                            <input type="tel" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required placeholder="Enter mobile number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50 focus:bg-white" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Guardian Mobile No. <span className="text-red-500">*</span></label>
                            <input type="tel" name="guardianMobileNo" value={formData.guardianMobileNo} onChange={handleChange} required placeholder="Enter guardian mobile number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50 focus:bg-white" />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700">Present Address <span className="text-red-500">*</span></label>
                            <input type="text" name="presentAddress" value={formData.presentAddress} onChange={handleChange} required placeholder="Street address, apartment, suite, etc." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50 focus:bg-white" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">City <span className="text-red-500">*</span></label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="City name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50 focus:bg-white" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Zip Code <span className="text-red-500">*</span></label>
                            <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} required placeholder="Zip or postal code" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50 focus:bg-white" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Country <span className="text-red-500">*</span></label>
                            <input type="text" name="country" value={formData.country} onChange={handleChange} required placeholder="Country name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all bg-gray-50/50 focus:bg-white" />
                        </div>
                    </div>
                </div>

                {/* Privacy Policy */}
                <div className="pt-4 border-t border-gray-100">
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
                            I accept the <Link href="#" className="font-bold text-[#6C5DD3] hover:underline">Privacy Policy</Link> and agree to provide accurate information.
                        </span>
                    </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center gap-4 justify-end pt-4">
                    <Link href="/dashboard/students" className="px-6 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : 'Save Student'}
                    </button>
                </div>
            </form>
        </div>
    );
}
