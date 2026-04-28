"use client";
import React from 'react';
import Link from 'next/link';

const TeacherQuickActions: React.FC = () => {
    return (
        <div className="bg-[#6C5DD3] rounded-[32px] p-6 text-white relative overflow-hidden shadow-lg shadow-[#6C5DD3]/30 h-full">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

            <h3 className="text-lg font-bold mb-6 relative z-10">Quick Actions</h3>

            <div className="grid grid-cols-2 gap-3 relative z-10">
                <Link href="/dashboard/attendance" className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/20 transition-all cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14l2 2 4-4"></path></svg>
                    </div>
                    <span className="text-[10px] font-bold text-center">Mark Attendance</span>
                </Link>

                <Link href="/dashboard/tasks" className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/20 transition-all cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </div>
                    <span className="text-[10px] font-bold text-center">Create Task</span>
                </Link>

                <Link href="/dashboard/courses" className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/20 transition-all cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <span className="text-[10px] font-bold text-center">Add Resource</span>
                </Link>

                <Link href="/dashboard/student-management" className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/20 transition-all cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <span className="text-[10px] font-bold text-center">Messages</span>
                </Link>
            </div>
        </div>
    );
};

export default TeacherQuickActions;
