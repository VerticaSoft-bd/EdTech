import React from 'react';

export default function Header() {
    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-[1600px] mx-auto px-6">
                <div className="flex items-center justify-between h-[80px] gap-4">
                    {/* Left: Logo & Search */}
                    <div className="flex items-center gap-8 shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#6C5DD3] rounded-lg flex items-center justify-center transform -rotate-12">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-[#1A1D1F]">Streva</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="relative group overflow-hidden p-[1px] rounded-[16px] shadow-[0px_16px_40px_-10px_rgba(108,93,211,0.35)] hover:shadow-[0px_20px_50px_-8px_rgba(108,93,211,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0.5 bg-gradient-to-br from-[#8E8AFF] via-[#F1F5F9] via-60% to-[#6C5DD3] shrink-0">
                                <div className="relative bg-white rounded-[15px] pl-4 pr-5 py-2.5 flex items-center gap-2.5 bg-[radial-gradient(circle_at_top_left,rgba(142,138,255,0.15),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(108,93,211,0.15),transparent_50%)] bg-white">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#6C5DD3]/0 via-[#6C5DD3]/10 to-[#6C5DD3]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer rounded-[15px]"></div>
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

                            <div className="relative w-[280px] hidden xl:block">
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
                                    className="w-full pl-11 pr-10 py-2.5 bg-[#F8FAFC] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all placeholder:text-[#A4A4A4] border border-transparent focus:border-gray-200"
                                    placeholder="Search..."
                                />
                                <div className="absolute inset-y-0 right-2 flex items-center">
                                    <div className="w-7 h-7 bg-[#6C5DD3] rounded-full flex items-center justify-center cursor-pointer shadow-sm">
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Navigation Tabs (Moved Between Search and Icons) */}
                    <nav className="flex items-center gap-1 shrink-0">
                        {["Home", "My Courses", "Assesment", "Settings"].map((item, idx) => (
                            <button
                                key={item}
                                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${idx === 0
                                        ? "bg-gray-100 text-[#1A1D1F]"
                                        : "text-gray-500 hover:text-[#1A1D1F] hover:bg-gray-50"
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>

                    {/* Right: Actions & Profile */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
                            <button className="relative p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500 hover:text-[#1A1D1F]">
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
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF754C] rounded-full ring-2 ring-gray-50"></span>
                            </button>
                            <button className="relative p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500 hover:text-[#1A1D1F]">
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
                            </button>
                        </div>

                        <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>

                        <div className="flex items-center gap-3 pl-1 group cursor-pointer">
                            <div className="w-10 h-10 bg-[#FFAB7B] rounded-xl flex items-center justify-center text-white font-bold shadow-sm transition-transform group-hover:scale-105">
                                SR
                            </div>
                            <div className="flex flex-col hidden sm:flex">
                                <span className="text-sm font-bold leading-tight text-[#1A1D1F]">
                                    Syed Roni
                                </span>
                                <span className="text-[11px] text-gray-500 font-medium">
                                    Product Designer
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
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
