import type { Metadata } from "next";
import Sidebar from "../components/Sidebar";
import DashboardTopBar from "../components/admin/DashboardTopBar";

import SiteSettings from "@/models/SiteSettings";
import connectDB from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
    try {
        await connectDB();
        const settings = await SiteSettings.findOne();
        const siteTitle = settings?.siteTitle || "Youthins";
        return {
            title: "Admin Dashboard",
            description: "Futuristic EdTech Admin Dashboard",
        };
    } catch {
        return {
            title: "Admin Dashboard | Youthins",
        };
    }
}

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
