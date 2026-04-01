"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function StudentProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNo: "",
    presentAddress: "",
    fatherName: "",
    motherName: "",
    guardianMobileNo: "",
    dateOfBirth: "",
    nidNo: "",
    gender: "Male",
    maritalStatus: "Single",
    residentialStatus: "Resident",
    country: "Bangladesh",
    education: "",
  });

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordStep, setPasswordStep] = useState(1); // 1 = Verify, 2 = Set New
  const [passwordInputs, setPasswordInputs] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    // Basic auth check using localStorage (just visually, API enforces it)
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    // Fetch user profile
    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/users/profile");
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          router.push("/login");
        }
        throw new Error("Failed to fetch profile");
      }
      
      const data = await res.json();
      
      setFormData((prev) => ({
        ...prev,
        name: data.user?.name || "",
        email: data.user?.email || "",
        mobileNo: data.student?.mobileNo || "",
        presentAddress: data.student?.presentAddress || "",
        fatherName: data.student?.fatherName || "",
        motherName: data.student?.motherName || "",
        guardianMobileNo: data.student?.guardianMobileNo || "",
        dateOfBirth: data.student?.dateOfBirth || "",
        nidNo: data.student?.nidNo || "",
        gender: data.student?.gender || "Male",
        maritalStatus: data.student?.maritalStatus || "Single",
        residentialStatus: data.student?.residentialStatus || "Resident",
        country: data.student?.country || "Bangladesh",
        education: data.student?.education || "",
      }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      const { 
        name, mobileNo, presentAddress,
        fatherName, motherName, guardianMobileNo,
        dateOfBirth, nidNo, gender, maritalStatus,
        residentialStatus, country, education
      } = formData;
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, mobileNo, presentAddress,
          fatherName, motherName, guardianMobileNo,
          dateOfBirth, nidNo, gender, maritalStatus,
          residentialStatus, country, education
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      
      // Update local storage name if it was changed
      const storedUserStr = localStorage.getItem("user");
      if (storedUserStr) {
          const storedUser = JSON.parse(storedUserStr);
          storedUser.name = name;
          localStorage.setItem("user", JSON.stringify(storedUser));
          
          window.location.reload(); 
      }
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordModalClose = () => {
    setIsPasswordModalOpen(false);
    setPasswordStep(1);
    setPasswordInputs({ current: "", new: "", confirm: "" });
    setModalError("");
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError("");

    try {
        const res = await fetch("/api/users/profile/verify-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: passwordInputs.current })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed");

        setPasswordStep(2);
    } catch (error: any) {
        setModalError(error.message);
    } finally {
        setModalLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInputs.new !== passwordInputs.confirm) {
        setModalError("New passwords do not match.");
        return;
    }

    setModalLoading(true);
    setModalError("");

    try {
        const res = await fetch("/api/users/profile/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                newPassword: passwordInputs.new,
                confirmPassword: passwordInputs.confirm
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to change password");

        toast.success("Password changed successfully!");
        handlePasswordModalClose();
    } catch (error: any) {
        setModalError(error.message);
    } finally {
        setModalLoading(false);
    }
  };

  const onPasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordInputs({ ...passwordInputs, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#6C5DD3] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1A1D1F] pb-12">
      <Header />
      <Toaster position="top-right" />

      {/* Page Header Area */}
      <div className="bg-white border-b border-gray-100 py-8 mb-8 shadow-sm">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mb-3">
            <Link href="/student-dashboard" className="hover:text-[#6C5DD3] transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-[#1A1D1F]">Profile</span>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1A1D1F] to-gray-500">
            Account Settings
          </h1>
          <p className="text-gray-500 mt-1">Manage your personal information, contact details, and security.</p>
        </div>
      </div>

      <main className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Sidebar Nav (Optional but nice UX) */}
        <div className="col-span-12 md:col-span-4">
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col gap-6 sticky top-28">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-gradient-to-br from-[#FFAB7B] to-[#FFCF9D] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#FFAB7B]/20">
                  {formData.name ? formData.name.substring(0, 2).toUpperCase() : 'SR'}
               </div>
               <div>
                 <h2 className="text-lg font-bold truncate max-w-[140px]">{formData.name}</h2>
                 <span className="text-xs font-semibold text-[#6C5DD3] bg-[#6C5DD3]/10 px-2.5 py-1 rounded-lg uppercase tracking-wider inline-block mt-1">Student</span>
               </div>
            </div>

            <div className="h-[1px] bg-gray-100 w-full"></div>

            <nav className="flex flex-col gap-1.5">
              <button className="flex items-center gap-3 px-4 py-3 bg-[#6C5DD3] text-white rounded-xl shadow-md shadow-[#6C5DD3]/20 font-semibold transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                Personal Info
              </button>
            </nav>
            
            {/* Visual Decorative */}
            <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-[#8E8AFF]/10 to-[#6C5DD3]/10 border border-[#6C5DD3]/10">
               <div className="flex items-start gap-3">
                 <div className="mt-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C5DD3" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-[#6C5DD3]">Secure Account</h4>
                   <p className="text-xs text-gray-500 mt-1 leading-relaxed">Your data is encrypted and kept safe to provide you with the best experience.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="col-span-12 md:col-span-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 w-full">
            
            <div className="mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1D1F" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                 Personal Information
              </h3>
              <p className="text-sm text-gray-500">Essential details for your account.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all text-sm font-medium"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-transparent text-gray-500 text-sm font-medium cursor-not-allowed pr-10"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A4A4A4" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600">Gender</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all text-sm font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1D1F" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                 Family Details
              </h3>
              <p className="text-sm text-gray-500">Information about your parents/guardian.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600">Father's Name</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all text-sm font-medium"
                  placeholder="Father's full name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600">Mother's Name</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all text-sm font-medium"
                  placeholder="Mother's full name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600">Guardian's Mobile No</label>
                <input
                  type="text"
                  name="guardianMobileNo"
                  value={formData.guardianMobileNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all text-sm font-medium"
                  placeholder="e.g. 01XXXXXXXXX"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600">Marital Status</label>
                <select 
                  name="maritalStatus" 
                  value={formData.maritalStatus} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all text-sm font-medium"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1D1F" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                 Identity & Education
              </h3>
              <p className="text-sm text-gray-500">Your background and identification.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600">NID / Birth Certificate No</label>
                <input
                  type="text"
                  name="nidNo"
                  value={formData.nidNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all text-sm font-medium"
                  placeholder="NID or Birth Reg Number"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600">Educational Qualification</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all text-sm font-medium"
                  placeholder="e.g. BSc in Engineering"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600">Residential Status</label>
                <select 
                  name="residentialStatus" 
                  value={formData.residentialStatus} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all text-sm font-medium"
                >
                  <option value="Resident">Resident</option>
                  <option value="Non-Resident">Non-Resident</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all text-sm font-medium"
                  placeholder="e.g. Bangladesh"
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1D1F" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                 Contact & Address
              </h3>
              <p className="text-sm text-gray-500">How we can reach you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600">Mobile Number</label>
                <input
                  type="text"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all text-sm font-medium"
                  placeholder="e.g. +880 1..."
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-600">Present Address</label>
                <textarea
                  name="presentAddress"
                  value={formData.presentAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all text-sm font-medium resize-none"
                  placeholder="Building, Street, Area, City"
                ></textarea>
              </div>
            </div>

            <div className="h-[1px] bg-gray-100 w-full my-10"></div>

            <div className="mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1D1F" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                 Security
              </h3>
              <p className="text-sm text-gray-500">Change your password here. Leave blank if you don't want to change it.</p>
            </div>

            <div className="flex flex-col items-center justify-center py-6 px-4 bg-gray-50 rounded-2xl border border-gray-100/50">
               <div className="w-12 h-12 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
               </div>
               <h4 className="font-bold text-[#1A1D1F]">Account Password</h4>
               <p className="text-xs text-center text-gray-500 mt-2 mb-6 max-w-[200px]">Protect your account by regularly updating your secret password.</p>
               <button 
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-6 py-2.5 bg-[#1A1D1F] hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-black/10 flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  Update Password
                </button>
            </div>

            <div className="mt-10 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 bg-[#6C5DD3] hover:bg-[#5a4cb5] text-white font-bold rounded-xl shadow-lg shadow-[#6C5DD3]/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    Save Changes
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </main>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={handlePasswordModalClose}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-8 pt-8 pb-10">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-2xl flex items-center justify-center font-bold">
                      {passwordStep}
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-[#1A1D1F]">
                       {passwordStep === 1 ? "Verify Identity" : "Set New Password"}
                     </h3>
                     <p className="text-xs text-gray-400">Step {passwordStep} of 2</p>
                   </div>
                 </div>
                 <button 
                  onClick={handlePasswordModalClose}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#1A1D1F] transition-colors rounded-full hover:bg-gray-100"
                 >
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                 </button>
              </div>

              {passwordStep === 1 ? (
                <form onSubmit={handleVerifyPassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 block px-1">Current Password</label>
                    <input 
                      required
                      autoFocus
                      type="password"
                      name="current"
                      value={passwordInputs.current}
                      onChange={onPasswordInputChange}
                      placeholder="••••••••"
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 focus:border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/5 transition-all text-sm font-medium"
                    />
                    <p className="text-[10px] text-gray-400 px-1 italic">Maximum 3 attempts allowed per 24 hours.</p>
                  </div>

                  {modalError && (
                    <div className="p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-start gap-2.5 animate-pulse">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {modalError}
                    </div>
                  )}

                  <button 
                    disabled={modalLoading}
                    className="w-full py-4 bg-[#6C5DD3] hover:bg-[#5a4cb5] text-white font-bold rounded-2xl shadow-xl shadow-[#6C5DD3]/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {modalLoading ? "Verifying..." : "Verify & Continue"}
                    {!modalLoading && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform"><polyline points="9 18 15 12 9 6" /></svg>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-600 block px-1">New Password</label>
                       <input 
                         required
                         autoFocus
                         type="password"
                         name="new"
                         value={passwordInputs.new}
                         onChange={onPasswordInputChange}
                         placeholder="Minimum 6 characters"
                         className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 focus:border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/5 transition-all text-sm font-medium"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-600 block px-1">Confirm New Password</label>
                       <input 
                         required
                         type="password"
                         name="confirm"
                         value={passwordInputs.confirm}
                         onChange={onPasswordInputChange}
                         placeholder="••••••••"
                         className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 focus:border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/5 transition-all text-sm font-medium"
                       />
                    </div>
                  </div>

                  {modalError && (
                    <div className="p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-start gap-2.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {modalError}
                    </div>
                  )}

                  <button 
                    disabled={modalLoading}
                    className="w-full py-4 bg-[#1A1D1F] hover:bg-black text-white font-bold rounded-2xl shadow-xl shadow-black/10 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {modalLoading ? "Saving..." : "Change Password"}
                    {!modalLoading && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
