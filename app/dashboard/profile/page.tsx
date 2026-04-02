"use client";

import React from "react";
import ProfileView from "@/app/components/ProfileView";

export default function DashboardProfilePage() {
  return (
    <div className="w-full pt-8 pb-12 animate-in fade-in zoom-in-95 duration-200">
      <ProfileView basePath="/dashboard" />
    </div>
  );
}
