"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useParams, useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

export default function CheckoutPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        fatherName: "",
        motherName: "",
        residentialStatus: "Resident",
        maritalStatus: "Single",
        gender: "Male",
        dateOfBirth: "",
        presentAddress: "",
        country: "Bangladesh",
        email: "",
        nidNo: "",
        education: "",
        mobileNo: "",
        guardianMobileNo: "",
        privacyPolicyAccepted: false,
    });

    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (!user || !token) {
            window.location.href = `/login?redirect=/checkout/${slug}`;
            return;
        }

        const fetchCourse = async () => {
            try {
                const res = await fetch(`/api/courses/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setCourse(data.data);
                } else {
                    toast.error("Course not found");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error loading course details");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchCourse();
        }
    }, [slug]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.privacyPolicyAccepted) {
            toast.error("Please accept the Terms & Privacy Policy");
            return;
        }

        setSubmitting(true);

        const discountedPrice = course.regularFee * (1 - course.discountPercentage / 100);

        const payload = {
            ...formData,
            courseName: course.title,
            totalCourseFee: discountedPrice,
            paidAmount: discountedPrice, // Assuming full payment upon checkout for this flow
            dueAmount: 0,
        };

        try {
            // Step 1: Save student enrollment details
            const res = await fetch('/api/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok || (data.message && data.message.includes('already registered'))) {
                // Step 2: Initialize Payment via PayStation
                const payRes = await fetch('/api/payment/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: discountedPrice, courseName: course.title, email: formData.email })
                });

                if (payRes.status === 401) {
                    toast.error("Please login to proceed with payment");
                    router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
                    return;
                }

                const payData = await payRes.json();

                if (payRes.ok && payData.payment_url) {
                    toast.success("Redirecting to secure payment gateway...");
                    window.location.href = payData.payment_url;
                } else {
                    toast.error(payData.error || "Payment gateway initialization failed");
                }
            } else {
                toast.error(data.message || "Failed to save enrollment details");
            }
        } catch (error) {
            console.error("Checkout Error:", error);
            toast.error("An error occurred during checkout");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="w-12 h-12 border-4 border-[#6C5DD3] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <h2 className="text-2xl font-bold">Course not found.</h2>
            </div>
        );
    }

    const discountedPrice = course.regularFee * (1 - course.discountPercentage / 100);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
            <Header />
            <Toaster position="top-right" />

            <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-[#1A1D1F]">Checkout Form</h1>
                    <p className="text-gray-500 mt-2">Fill out your details to enroll in the course.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6C5DD3]" placeholder="Enter your full name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6C5DD3]" placeholder="your@email.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number *</label>
                                    <input required type="text" name="mobileNo" value={formData.mobileNo} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6C5DD3]" placeholder="01XXXXXXXXX" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Guardian's Mobile Number *</label>
                                    <input required type="text" name="guardianMobileNo" value={formData.guardianMobileNo} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6C5DD3]" placeholder="01XXXXXXXXX" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Father's Name *</label>
                                    <input required type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6C5DD3]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Mother's Name *</label>
                                    <input required type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6C5DD3]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth *</label>
                                    <input required type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6C5DD3]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">NID / Birth Certificate No. *</label>
                                    <input required type="text" name="nidNo" value={formData.nidNo} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6C5DD3]" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Gender *</label>
                                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6C5DD3]">
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Marital Status *</label>
                                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6C5DD3]">
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Residential Status *</label>
                                    <select name="residentialStatus" value={formData.residentialStatus} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6C5DD3]">
                                        <option value="Resident">Resident</option>
                                        <option value="Non-Resident">Non-Resident</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Country *</label>
                                    <input required type="text" name="country" value={formData.country} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6C5DD3]" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Educational Background *</label>
                                    <input required type="text" name="education" value={formData.education} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6C5DD3]" placeholder="e.g. BSc in CSE" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Present Address *</label>
                                    <textarea required name="presentAddress" value={formData.presentAddress} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6C5DD3]" placeholder="Your full present address"></textarea>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex items-start gap-3">
                                <input required type="checkbox" id="privacyPolicyAccepted" name="privacyPolicyAccepted" checked={formData.privacyPolicyAccepted} onChange={handleInputChange} className="mt-1 w-5 h-5 rounded border-gray-300 text-[#6C5DD3] focus:ring-[#6C5DD3]" />
                                <label htmlFor="privacyPolicyAccepted" className="text-sm text-gray-600">
                                    I agree to the <a href="#" className="font-bold text-[#6C5DD3] hover:underline">Terms of Service</a> and <a href="#" className="font-bold text-[#6C5DD3] hover:underline">Privacy Policy</a>.
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full py-4 text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-2 ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#6C5DD3] hover:bg-[#5A4CB5] shadow-lg shadow-indigo-200'}`}
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : "Confirm & Pay"}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-bold text-[#1A1D1F] mb-6 pb-4 border-b border-gray-100">Order Summary</h3>

                            <div className="flex gap-4 mb-6">
                                {course.thumbnail && (
                                    <img src={course.thumbnail} alt={course.title} className="w-20 h-16 object-cover rounded-lg" />
                                )}
                                <div>
                                    <h4 className="font-bold text-[15px] text-[#1A1D1F] line-clamp-2">{course.title}</h4>
                                    <p className="text-sm text-gray-500 mt-1">{course.courseMode}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6 text-sm text-[#475569]">
                                <div className="flex justify-between">
                                    <span>Regular Fee</span>
                                    <span className="font-semibold text-gray-400 line-through">৳{course.regularFee.toLocaleString()}</span>
                                </div>
                                {course.discountPercentage > 0 && (
                                    <div className="flex justify-between text-[#059669]">
                                        <span>Discount ({course.discountPercentage}%)</span>
                                        <span className="font-semibold">-৳{(course.regularFee - discountedPrice).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center mb-8">
                                <span className="font-bold text-[#1A1D1F] text-lg">Total</span>
                                <span className="text-2xl font-extrabold text-[#6C5DD3]">৳{discountedPrice.toLocaleString()}</span>
                            </div>

                            <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-xl flex items-start gap-3">
                                <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <p>You will be redirected to the secure payment gateway after confirming your details.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
