import type { Metadata } from "next";
import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
    title: "Admin Dashboard | Streva",
    description: "Futuristic EdTech Admin Dashboard",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#F4F4F4]">
            <Sidebar />
            <main className="flex-1 ml-[280px] p-8">
                <div className="max-w-[1600px] mx-auto">
                    {/* Simple Top Bar for Dashboard (Search/Notifs) */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-[#1A1D1F]">Dashboard</h1>
                            <p className="text-sm text-gray-500">Welcome back, Admin</p>
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

                    {children}
                </div>
            </main>
        </div>
    );
}
