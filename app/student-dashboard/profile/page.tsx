"use client";

import React from "react";
import Header from "@/app/components/Header";
import ProfileView from "@/app/components/ProfileView";

export default function StudentProfilePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1A1D1F] flex flex-col">
      <Header />
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 pt-8 pb-12">
        <ProfileView basePath="/student-dashboard" />
      </div>
    </div>
  );
}
