import React from 'react';

const QuickActions: React.FC = () => {
    return (
        <div className="bg-[#6C5DD3] rounded-[32px] p-6 text-white relative overflow-hidden shadow-lg shadow-[#6C5DD3]/30">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

            <h3 className="text-lg font-bold mb-6 relative z-10">Quick Actions</h3>

            <div className="grid grid-cols-2 gap-3 relative z-10">
                <button className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/20 transition-all cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                    </div>
                    <span className="text-[10px] font-bold">Add Student</span>
                </button>

                <button className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/20 transition-all cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    </div>
                    <span className="text-[10px] font-bold">New Course</span>
                </button>

                <button className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/20 transition-all cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <span className="text-[10px] font-bold">Broadcast</span>
                </button>

                <button className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/20 transition-all cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    <span className="text-[10px] font-bold">Lock Access</span>
                </button>
            </div>
        </div>
    );
};

export default QuickActions;
