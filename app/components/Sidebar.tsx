"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar: React.FC = () => {
    const pathname = usePathname();
    const [isUsersOpen, setIsUsersOpen] = useState(false);
    const [user, setUser] = useState<{ role: string; name: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user from localStorage", e);
            }
        }

        // Listen for auth changes
        const handleAuthChange = () => {
            const updatedUser = localStorage.getItem('user');
            if (updatedUser) setUser(JSON.parse(updatedUser));
        };

        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, []);

    // Auto-expand the Users accordion if we are currently on any users subpage
    useEffect(() => {
        if (pathname?.startsWith('/dashboard/users')) {
            setIsUsersOpen(true);
        }
    }, [pathname]);

    const isActive = (path: string) => {
        if (path === '/dashboard' && pathname === '/dashboard') return true;
        if (path !== '/dashboard' && pathname?.startsWith(path)) return true;
        return false;
    };

    const getLinkClasses = (path: string) => {
        const active = isActive(path);
        const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group w-full";
        const activeClasses = "bg-[#6C5DD3] text-white shadow-lg shadow-[#6C5DD3]/20";
        const inactiveClasses = "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D1F]";

        return `${baseClasses} ${active ? activeClasses : inactiveClasses}`;
    };

    const role = user?.role || 'admin'; // Default to admin if not found (safer for dev, but usually would be restricted)
    const isStaff = role === 'staff';

    return (
        <aside className="fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-gray-100 flex flex-col z-50">
            {/* Logo area */}
            <div className="h-[80px] flex items-center px-8 border-b border-gray-50">
                <div className="w-8 h-8 bg-[#6C5DD3] rounded-lg flex items-center justify-center transform -rotate-12 mr-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-[#1A1D1F]">Streva Admin</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-4 mb-2">Main Menu</div>

                <Link href="/dashboard" className={getLinkClasses('/dashboard')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <span className="text-sm font-bold">Dashboard</span>
                </Link>

                <Link href="/dashboard/courses" className={getLinkClasses('/dashboard/courses')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                    <span className="text-sm font-bold">Courses</span>
                </Link>

                <Link href="/dashboard/enrollments" className={getLinkClasses('/dashboard/enrollments')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <span className="text-sm font-bold">Enrollments</span>
                </Link>

                <Link href="/dashboard/categories" className={getLinkClasses('/dashboard/categories')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline><polyline points="2 17 12 22 22 17"></polyline></svg>
                    <span className="text-sm font-bold">Categories</span>
                </Link>

                {/* Users Accordion Menu */}
                <div className="pt-1 pb-1">
                    <button
                        onClick={() => setIsUsersOpen(!isUsersOpen)}
                        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all group ${pathname?.startsWith('/dashboard/users') && !isUsersOpen
                            ? 'bg-[#6C5DD3]/10 text-[#6C5DD3] font-bold'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-[#1A1D1F]'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            <span className="text-sm font-bold">Users</span>
                        </div>
                        <svg
                            className={`transition-transform duration-200 ${isUsersOpen ? 'rotate-180 text-[#1A1D1F]' : 'text-gray-400'}`}
                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    {/* Nested Sub-links */}
                    {isUsersOpen && (
                        <div className="flex flex-col gap-1 mt-1 pl-11 pr-2 animate-in slide-in-from-top-2 duration-200">
                            <Link href="/dashboard/users/student" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/dashboard/users/student' ? 'text-[#6C5DD3] bg-[#6C5DD3]/5 font-bold' : 'text-gray-500 hover:text-[#1A1D1F] hover:bg-gray-50'}`}>
                                Student
                            </Link>
                            <Link href="/dashboard/users/teacher" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/dashboard/users/teacher' ? 'text-[#6C5DD3] bg-[#6C5DD3]/5 font-bold' : 'text-gray-500 hover:text-[#1A1D1F] hover:bg-gray-50'}`}>
                                Teacher
                            </Link>
                            <Link href="/dashboard/users/staff" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/dashboard/users/staff' ? 'text-[#6C5DD3] bg-[#6C5DD3]/5 font-bold' : 'text-gray-500 hover:text-[#1A1D1F] hover:bg-gray-50'}`}>
                                Staff
                            </Link>
                            {!isStaff && (
                                <>
                                    <Link href="/dashboard/users/admin" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/dashboard/users/admin' ? 'text-[#6C5DD3] bg-[#6C5DD3]/5 font-bold' : 'text-gray-500 hover:text-[#1A1D1F] hover:bg-gray-50'}`}>
                                        Admin
                                    </Link>
                                    <Link href="/dashboard/users/group" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/dashboard/users/group' ? 'text-[#6C5DD3] bg-[#6C5DD3]/5 font-bold' : 'text-gray-500 hover:text-[#1A1D1F] hover:bg-gray-50'}`}>
                                        Group
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {!isStaff && (
                    <>
                        <Link href="/dashboard/accounts" className={getLinkClasses('/dashboard/accounts')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                            <span className="text-sm font-bold">Accounts</span>
                        </Link>

                        <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#1A1D1F] transition-all group">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            <span className="text-sm font-bold">Revenue</span>
                        </Link>

                        <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#1A1D1F] transition-all group">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                            <span className="text-sm font-bold">System Health</span>
                        </Link>

                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-4 mb-2 mt-6">Settings</div>

                        <Link href="/dashboard/setting/pages/home" className={getLinkClasses('/dashboard/setting/pages/home')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            <span className="text-sm font-bold">Home Settings</span>
                        </Link>

                        <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#1A1D1F] transition-all group">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.86a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            <span className="text-sm font-bold">Settings</span>
                        </Link>
                    </>
                )}
            </nav>

            {/* Profile Info */}
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                    <img src={`https://i.pravatar.cc/150?u=${user?.email || 'admin'}`} className="w-10 h-10 rounded-full bg-gray-200" alt="Admin" />
                    <div>
                        <h4 className="text-sm font-bold text-[#1A1D1F]">{user?.name || 'Admin User'}</h4>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{user?.role || 'Super Admin'}</p>
                    </div>
                </div>
            </div>
        </aside>

    );
};

export default Sidebar;
