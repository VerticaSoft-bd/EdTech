import type { Metadata } from "next";
import Sidebar from "../components/Sidebar";
import DashboardTopBar from "../components/admin/DashboardTopBar";

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
                    <DashboardTopBar />
                    {children}
                </div>
            </main>
        </div>
    );
}
