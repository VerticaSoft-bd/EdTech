"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function TeacherProfilePage() {
  const params = useParams();
  const id = params?.id as string;

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
    role: "teacher"
  });

  useEffect(() => {
    if (id) {
        fetchTeacherProfile();
    }
  }, [id]);

  const fetchTeacherProfile = async () => {
    try {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch teacher profile");
      }
      
      const resData = await res.json();
      const user = resData.data;
      
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        role: user.role || "teacher",
        mobileNo: user.mobileNo || "",
        presentAddress: user.presentAddress || "",
        fatherName: user.fatherName || "",
        motherName: user.motherName || "",
        guardianMobileNo: user.guardianMobileNo || "",
        dateOfBirth: user.dateOfBirth || "",
        nidNo: user.nidNo || "",
        gender: user.gender || "Male",
        maritalStatus: user.maritalStatus || "Single",
        residentialStatus: user.residentialStatus || "Resident",
        country: user.country || "Bangladesh",
        education: user.education || "",
      }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load teacher profile data");
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
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update teacher profile");
      }

      toast.success("Teacher profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-20">
        <div className="w-10 h-10 border-4 border-[#6C5DD3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full pb-12 animate-in fade-in zoom-in-95 duration-200">
      <Toaster position="top-right" />

      {/* Page Header Area */}
      <div className="bg-white border border-gray-100 py-8 mb-8 shadow-sm rounded-[24px]">
        <div className="px-6 md:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mb-3">
            <Link href="/dashboard" className="hover:text-[#6C5DD3] transition-colors">Dashboard</Link>
            <span>/</span>
            <Link href="/dashboard/users/teacher" className="hover:text-[#6C5DD3] transition-colors">Teachers</Link>
            <span>/</span>
            <span className="text-[#1A1D1F]">Edit Profile</span>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1A1D1F] to-gray-500">
            Teacher Profile
          </h1>
          <p className="text-gray-500 mt-1">Manage personal information and contact details for {formData.name}.</p>
        </div>
      </div>

      <main className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Sidebar Nav */}
        <div className="xl:col-span-4">
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col gap-6 sticky top-28">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-gradient-to-br from-[#FFAB7B] to-[#FFCF9D] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#FFAB7B]/20">
                  {formData.name ? formData.name.substring(0, 2).toUpperCase() : 'TR'}
               </div>
               <div>
                 <h2 className="text-lg font-bold truncate max-w-[140px]">{formData.name}</h2>
                 <span className="text-xs font-semibold text-[#6C5DD3] bg-[#6C5DD3]/10 px-2.5 py-1 rounded-lg uppercase tracking-wider inline-block mt-1">
                     {formData.role}
                 </span>
               </div>
            </div>

            <div className="h-[1px] bg-gray-100 w-full"></div>

            <nav className="flex flex-col gap-1.5">
              <button className="flex items-center gap-3 px-4 py-3 bg-[#6C5DD3] text-white rounded-xl shadow-md shadow-[#6C5DD3]/20 font-semibold transition-all w-full">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                Personal Info
              </button>
            </nav>
          </div>
        </div>

        {/* Form Container */}
        <div className="xl:col-span-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-gray-100 w-full">
            
            <div className="mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1D1F" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                 Personal Information
              </h3>
              <p className="text-sm text-gray-500">Essential details for this teacher.</p>
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
                <label className="text-sm font-bold text-gray-600">Email Address (Read-only)</label>
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
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600">Guardian / Alt Mobile</label>
                <input
                  type="text"
                  name="guardianMobileNo"
                  value={formData.guardianMobileNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all text-sm font-medium"
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600">NID No</label>
                <input
                  type="text"
                  name="nidNo"
                  value={formData.nidNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all text-sm font-medium"
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
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1D1F" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                 Contact & Address
              </h3>
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
                ></textarea>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 bg-[#6C5DD3] hover:bg-[#5a4cb5] text-white font-bold rounded-xl shadow-lg shadow-[#6C5DD3]/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {submitting ? "Saving..." : "Save Teacher Profile"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
