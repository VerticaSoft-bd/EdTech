"use client";
import React from 'react';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
    '/dashboard': { title: 'Dashboard', subtitle: 'Welcome back, Admin' },
    '/dashboard/courses': { title: 'Courses', subtitle: 'Manage your courses' },
    '/dashboard/courses/add': { title: 'Create New Course', subtitle: 'Fill in the details to publish a new course' },
    '/dashboard/enrollments': { title: 'Enrollments', subtitle: 'All course purchase transactions' },
    '/dashboard/categories': { title: 'Categories', subtitle: 'Manage course categories' },
    '/dashboard/students': { title: 'Students', subtitle: 'Student management' },
    '/dashboard/students/add': { title: 'Add New Student', subtitle: 'Fill in the student details' },
    '/dashboard/accounts': { title: 'Accounts', subtitle: 'Manage accounts' },
    '/dashboard/users/student': { title: 'Students', subtitle: 'Manage student users' },
    '/dashboard/users/teacher': { title: 'Teachers', subtitle: 'Manage teacher users' },
    '/dashboard/users/staff': { title: 'Staff', subtitle: 'Manage staff users' },
    '/dashboard/users/admin': { title: 'Admins', subtitle: 'Manage admin users' },
    '/dashboard/users/group': { title: 'Groups', subtitle: 'Manage user groups' },
};

const DashboardTopBar: React.FC = () => {
    const pathname = usePathname();

    // Find exact match first, then try prefix match for dynamic routes
    const pageInfo = pageTitles[pathname || ''] ||
        Object.entries(pageTitles)
            .filter(([key]) => key !== '/dashboard' && pathname?.startsWith(key))
            .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ||
        { title: 'Dashboard', subtitle: 'Welcome back, Admin' };

    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-2xl font-bold text-[#1A1D1F]">{pageInfo.title}</h1>
                <p className="text-sm text-gray-500">{pageInfo.subtitle}</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <input type="text" placeholder="Search anything..." className="pl-10 pr-4 py-2.5 bg-white rounded-xl text-sm border-none focus:ring-2 focus:ring-[#6C5DD3]/20 outline-none w-[300px] shadow-sm" />
                    <svg className="absolute left-3 top-2.5 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm relative">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1D1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#FF4C4C] rounded-full border border-white"></span>
                </button>
            </div>
        </div>
    );
};

export default DashboardTopBar;
