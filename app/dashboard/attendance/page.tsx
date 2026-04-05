"use client";

import React from 'react';
import AttendanceManager from '@/app/components/admin/AttendanceManager';
import DashboardTopBar from '@/app/components/admin/DashboardTopBar';

export default function AttendancePage() {
    return (
        <div className="flex flex-col gap-8 p-4 md:p-8 animate-in fade-in duration-500">
            <DashboardTopBar />
            
            <main>
                <AttendanceManager />
            </main>
        </div>
    );
}
