"use client";

import React from 'react';
import AttendanceManager from '@/app/components/admin/AttendanceManager';

export default function AttendancePage() {
    return (
        <div className="animate-in fade-in duration-500">
            <main>
                <AttendanceManager />
            </main>
        </div>
    );
}
