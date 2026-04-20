"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ComingSoonModal from './ComingSoonModal';
import { formatDistanceToNow } from 'date-fns';

export default function Header() {
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const pathname = usePathname();
    const router = useRouter();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user from localStorage:", error);
            }
        }

        const fetchNotifications = async () => {
            try {
                const res = await fetch('/api/notifications');
                const data = await res.json();
                if (data.success) {
                    setNotifications(data.data.notifications);
                    setUnreadCount(data.data.unreadCount);
                }
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            }
        };

        if (storedUser) {
            fetchNotifications();
            // Set up polling for new notifications every 1 minute
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, []);

    // Close mobile menu on bypass or link click
    const closeMenu = () => setIsMobileMenuOpen(false);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-[1600px] mx-auto px-6">
                <div className="flex items-center justify-between h-[80px] gap-4">
                    {/* Left: Logo & Search */}
                    <div className="flex items-center gap-8 shrink-0">
                        <Link href="/" className="flex items-center gap-2">
                            <img
                                src="/images/logo.png"
                                alt="Youth Ins Logo"
                                className="h-10 w-auto object-contain transition-transform hover:scale-105"
                            />
                        </Link>

                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsAIModalOpen(true)}
                                className="hidden sm:block relative group overflow-hidden p-[1px] rounded-2xl shadow-[0px_16px_40px_-10px_rgba(108,93,211,0.35)] hover:shadow-[0px_20px_50px_-8px_rgba(108,93,211,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0.5 bg-gradient-to-br from-[#8E8AFF] via-[#F1F5F9] via-60% to-[#6C5DD3] shrink-0"
                            >
                                <div className="relative bg-white rounded-xl pl-4 pr-5 py-2.5 flex items-center gap-2.5 bg-[radial-gradient(circle_at_top_left,rgba(142,138,255,0.15),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(108,93,211,0.15),transparent_50%)] bg-white">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#6C5DD3]/0 via-[#6C5DD3]/10 to-[#6C5DD3]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer rounded-xl"></div>
                                    <div className="text-[#1A1D1F]">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L13.8 6.2L18 8L13.8 9.8L12 14L10.2 9.8L6 8L10.2 6.2L12 2Z" fill="#1A1D1F" stroke="#1A1D1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M19 13L20 15.5L22.5 16.5L20 17.5L19 20L18 17.5L15.5 16.5L18 15.5L19 13Z" fill="#1A1D1F" stroke="#1A1D1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-sm text-[#1A1D1F] tracking-wide">
                                        Ask AI
                                    </span>
                                </div>
                            </button>

                            <form onSubmit={handleSearch} className="relative w-[280px] hidden xl:block">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#A4A4A4"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.3-4.3" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-10 py-2.5 bg-[#F8FAFC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all placeholder:text-[#A4A4A4] border border-transparent focus:border-gray-200"
                                    placeholder="Search..."
                                />
                                <div className="absolute inset-y-0 right-2 flex items-center">
                                    <button 
                                        type="submit"
                                        className="w-7 h-7 bg-[#6C5DD3] rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-[#5a4cb5] transition-colors"
                                    >
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="11" cy="11" r="8" />
                                            <path d="m21 21-4.3-4.3" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Middle: Navigation Tabs (Hidden on mobile) */}
                    <nav className="hidden lg:flex items-center gap-2 shrink-0">
                        {[
                            { label: "Home", href: "/" },
                            { label: "Courses", href: "/courses" },
                            { label: "My Courses", href: user?.role === 'student' ? '/student-dashboard' : '/dashboard' },
                            { label: "CV Maker", href: "/cv/list" },
                            // { label: "Settings", href: user?.role === 'student' ? '/student-dashboard/profile' : '/dashboard/settings' }
                        ].map((item, idx) => {
                            const isCVMaker = item.label === "CV Maker";
                            // For nested paths like /courses/some-course, we still want "Courses" to be active
                            const isActive = item.href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(item.href);

                            const commonClasses = `px-5 py-2.5 text-[13px] font-black rounded-lg transition-all relative group flex items-center gap-2 overflow-hidden ${isActive ? "text-[#6C5DD3]"
                                : isCVMaker ? "text-white bg-gradient-to-r from-[#8E8AFF] to-[#6C5DD3] shadow-[0px_16px_40px_-10px_rgba(108,93,211,0.35)] hover:shadow-[0px_20px_50px_-8px_rgba(108,93,211,0.5)] hover:-translate-y-1 transform active:translate-y-0.5"
                                    : "text-gray-500 hover:text-[#1A1D1F]"
                                }`;

                            return (
                                <Link key={item.label} href={item.href} className={commonClasses}>
                                    {/* Magnetic Glow Background */}
                                    {!isCVMaker ? (
                                        <>
                                            <div className={`absolute inset-0 bg-[#6C5DD3]/5 ${isActive ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity duration-300`}></div>
                                            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[#6C5DD3]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer pointer-events-none"></div>
                                    )}

                                    <span className={`relative z-10 uppercase tracking-widest flex items-center gap-1.5`}>
                                        {item.label}
                                        {isCVMaker && (
                                            <span className="bg-white text-[#6C5DD3] text-[9px] px-1.5 py-0.5 rounded shadow-sm">NEW</span>
                                        )}
                                    </span>

                                    {/* AI Indicator Dots */}
                                    {isActive ? (
                                        <div className="relative z-10 flex gap-0.5">
                                            <span className="w-1 h-1 rounded-full bg-[#6C5DD3] animate-pulse"></span>
                                            <span className="w-1 h-1 rounded-full bg-[#6C5DD3]/40"></span>
                                        </div>
                                    ) : (
                                        <div className="relative z-10 w-1 h-1 rounded-full bg-transparent group-hover:bg-[#6C5DD3]/30 transition-colors"></div>
                                    )}

                                    {/* Bottom Energy Bar */}
                                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#6C5DD3] rounded-full transition-all duration-300 ${isActive ? 'w-4' : 'w-0 group-hover:w-3 opacity-50'}`}></span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right: Actions & Profile */}
                    <div className="flex items-center gap-3 shrink-0">
                        {user ? (
                            <>
                                    <div className="relative group">
                                        <button 
                                            onClick={() => {
                                                setIsNotificationOpen(!isNotificationOpen);
                                                if (!isNotificationOpen && unreadCount > 0) {
                                                    // Mark as read when opening
                                                    fetch('/api/notifications', { method: 'PATCH' });
                                                    setUnreadCount(0);
                                                }
                                            }}
                                            className="relative p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500 hover:text-[#1A1D1F]"
                                        >
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                                            </svg>
                                            {unreadCount > 0 && (
                                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF754C] rounded-full ring-2 ring-gray-50 animate-pulse"></span>
                                            )}
                                        </button>

                                        {isNotificationOpen && (
                                            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                                <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                                    <h3 className="font-bold text-sm text-[#1A1D1F]">Notifications</h3>
                                                    {unreadCount > 0 && <span className="px-2 py-0.5 bg-[#6C5DD3] text-white text-[10px] font-bold rounded-full">{unreadCount} New</span>}
                                                </div>
                                                <div className="max-h-[400px] overflow-y-auto">
                                                    {notifications.length === 0 ? (
                                                        <div className="p-10 text-center">
                                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A4A4A4" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                                                            </div>
                                                            <p className="text-xs text-gray-400 font-medium">All caught up!</p>
                                                        </div>
                                                    ) : (
                                                        notifications.map((notif) => (
                                                            <Link 
                                                                key={notif._id} 
                                                                href={notif.link || '#'}
                                                                onClick={() => setIsNotificationOpen(false)}
                                                                className={`block p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-[#6C5DD3]/5' : ''}`}
                                                            >
                                                                <p className="text-xs font-bold text-[#1A1D1F] mb-1">{notif.title}</p>
                                                                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{notif.message}</p>
                                                                <p className="text-[9px] text-gray-400 mt-2">{formatDistanceToNow(new Date(notif.createdAt))} ago</p>
                                                            </Link>
                                                        ))
                                                    )}
                                                </div>
                                                {notifications.length > 0 && (
                                                    <div className="p-3 bg-gray-50/30 text-center">
                                                        <button 
                                                            onClick={() => setIsNotificationOpen(false)}
                                                            className="text-[11px] font-bold text-[#6C5DD3] hover:underline"
                                                        >
                                                            Close
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden md:block"></div>

                                <div className="relative group">
                                    <Link
                                        href={user.role === 'student' ? '/student-dashboard' : '/dashboard'}
                                        className="flex items-center gap-3 pl-1 cursor-pointer"
                                    >
                                        <div className="w-10 h-10 bg-[#FFAB7B] rounded-lg flex items-center justify-center text-white font-bold shadow-sm transition-transform group-hover:scale-105">
                                            {user.name ? user.name.substring(0, 2).toUpperCase() : 'SR'}
                                        </div>
                                        <div className="flex flex-col hidden sm:flex">
                                            <span className="text-sm font-bold leading-tight text-[#1A1D1F]">
                                                {user.name || 'Syed Roni'}
                                            </span>
                                            <span className="text-[11px] text-gray-500 font-medium capitalize">
                                                {user.role || 'Product Designer'}
                                            </span>
                                        </div>
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-gray-400 group-hover:text-[#1A1D1F] transition-colors"
                                        >
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </Link>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                                        <div className="p-2 space-y-1">
                                            <Link
                                                href={user.role === 'student' ? '/student-dashboard' : '/dashboard'}
                                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#1A1D1F] hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                                Dashboard
                                            </Link>
                                            <Link
                                                href={user.role === 'student' ? '/student-dashboard/profile' : '/dashboard/profile'}
                                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#1A1D1F] hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                                Profile
                                            </Link>
                                            <div className="h-[1px] bg-gray-100 my-1 mx-2"></div>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await fetch('/api/auth/logout', { method: 'POST' });
                                                    } catch (error) {
                                                        console.error("Logout failed:", error);
                                                    }
                                                    localStorage.removeItem('token');
                                                    localStorage.removeItem('user');
                                                    window.location.href = '/login';
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Link href="/login" className="px-5 py-2.5 bg-[#6C5DD3] text-white text-[14px] font-bold rounded-lg hover:bg-[#5a4cb5] transition-colors shadow-lg shadow-[#6C5DD3]/20 flex items-center gap-2">
                                Login
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" /></svg>
                            </Link>
                        )}
                        {/* Mobile Menu Toggle (Hamburger) */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="flex lg:hidden p-2 ml-2 text-gray-500 hover:text-[#1A1D1F] hover:bg-gray-50 rounded-lg transition-colors relative z-[60]"
                        >
                            {isMobileMenuOpen ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="4" y1="12" x2="20" y2="12" />
                                    <line x1="4" y1="6" x2="20" y2="6" />
                                    <line x1="4" y1="18" x2="20" y2="18" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <div className={`fixed inset-0 bg-white z-50 lg:hidden transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full pt-20 px-6">
                    {/* Search in mobile menu */}
                    <form onSubmit={handleSearch} className="relative mb-8">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search courses..."
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/10 transition-all"
                        />
                        <button type="submit" className="absolute inset-y-0 left-4 flex items-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A4A4A4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </button>
                    </form>

                    <nav className="flex flex-col gap-2">
                        {[
                            { label: "Home", href: "/" },
                            { label: "Courses", href: "/courses" },
                            { label: "My Courses", href: user?.role === 'student' ? '/student-dashboard' : '/dashboard' },
                            { label: "CV Maker", href: "/cv/list" },
                            { label: "Settings", href: user?.role === 'student' ? '/student-dashboard/profile' : '/dashboard/settings' }
                        ].map((item) => {
                            const isCVMaker = item.label === "CV Maker";
                            const isActive = item.href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={closeMenu}
                                    className={`px-6 py-4 text-lg font-black rounded-xl transition-all tracking-widest flex items-center justify-between group overflow-hidden relative ${isActive && !isCVMaker ? 'text-[#6C5DD3] bg-[#6C5DD3]/5' :
                                        isCVMaker ? 'text-white bg-gradient-to-r from-[#8E8AFF] to-[#6C5DD3] shadow-lg shadow-[#6C5DD3]/20 hover:-translate-y-1 transform uppercase' :
                                            'text-gray-500 hover:text-[#6C5DD3] hover:bg-[#6C5DD3]/5 uppercase'
                                        }`}
                                >
                                    {isCVMaker && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer pointer-events-none"></div>
                                    )}
                                    <span className="flex items-center gap-2 relative z-10">
                                        {item.label}
                                        {isActive && !isCVMaker && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#6C5DD3] animate-pulse"></span>
                                        )}
                                        {isCVMaker && <span className="bg-white text-[#6C5DD3] text-[9px] px-1.5 py-0.5 rounded shadow-sm">NEW</span>}
                                    </span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`${isCVMaker || isActive ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all`}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto pb-10 flex flex-col gap-4">
                        <button 
                            onClick={() => {
                                closeMenu();
                                setIsAIModalOpen(true);
                            }}
                            className="w-full py-4 bg-gradient-to-r from-[#8E8AFF] to-[#6C5DD3] text-white font-black rounded-xl shadow-xl shadow-[#6C5DD3]/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L13.8 6.2L18 8L13.8 9.8L12 14L10.2 9.8L6 8L10.2 6.2L12 2Z" fill="white" /><path d="M19 13L20 15.5L22.5 16.5L20 17.5L19 20L18 17.5L15.5 16.5L18 15.5L19 13Z" fill="white" /></svg>
                            ASK AI ASSISTANT
                        </button>
                    </div>
                </div>
            </div>

            <ComingSoonModal 
                isOpen={isAIModalOpen} 
                onClose={() => setIsAIModalOpen(false)} 
            />
        </header>
    );
}

