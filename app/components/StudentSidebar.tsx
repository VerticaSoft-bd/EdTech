import React from 'react';
import Link from 'next/link';

const StudentSidebar: React.FC = () => {
    return (
        <aside className="fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-gray-100 flex flex-col z-50">
            {/* Logo area */}
            <div className="h-[80px] flex items-center px-8 border-b border-gray-50">
                <div className="w-8 h-8 bg-[#6C5DD3] rounded-lg flex items-center justify-center transform -rotate-12 mr-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-[#1A1D1F]">Streva</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-4 mb-2">Student Menu</div>

                <Link href="/student" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#6C5DD3] text-white shadow-lg shadow-[#6C5DD3]/20 group transition-all">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <span className="text-sm font-bold">Dashboard</span>
                </Link>

                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#1A1D1F] transition-all group">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    <span className="text-sm font-bold">My Classes</span>
                </Link>

                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#1A1D1F] transition-all group">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <span className="text-sm font-bold">Assignments</span>
                </Link>

                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#1A1D1F] transition-all group">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    <span className="text-sm font-bold">Fee Status</span>
                </Link>

                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#1A1D1F] transition-all group">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span className="text-sm font-bold">AI Resume</span>
                </Link>

                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-4 mb-2 mt-6">Settings</div>

                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#1A1D1F] transition-all group">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    <span className="text-sm font-bold">Settings</span>
                </Link>
            </nav>

            {/* Profile Info */}
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                    <img src="https://i.pravatar.cc/150?u=student" className="w-10 h-10 rounded-full bg-gray-200" alt="Student" />
                    <div>
                        <h4 className="text-sm font-bold text-[#1A1D1F]">Alex Smith</h4>
                        <p className="text-[10px] text-gray-400">Batch A - UX101</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default StudentSidebar;
