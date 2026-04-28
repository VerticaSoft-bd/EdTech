import type { Metadata } from "next";
import Sidebar from "../components/Sidebar";
import DashboardTopBar from "../components/admin/DashboardTopBar";
import { Suspense } from "react";

import SiteSettings from "@/models/SiteSettings";
import connectDB from "@/lib/db";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function generateMetadata(): Promise<Metadata> {
    try {
        await connectDB();
        const settings = await SiteSettings.findOne();
        const siteTitle = settings?.siteTitle || "Youthins";
        
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        let role = 'admin';

        if (token) {
            try {
                const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
                const { payload } = await jwtVerify(token, secret);
                role = payload.role as string;
            } catch (err) { }
        }

        const dashboardTitle = role === 'teacher' ? "Teacher Dashboard" : "Admin Dashboard";

        return {
            title: `${dashboardTitle} | ${siteTitle}`,
            description: `Futuristic EdTech ${dashboardTitle}`,
        };
    } catch {
        return {
            title: "Dashboard | Youthins",
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
            <Suspense fallback={<div className="w-[280px] bg-white border-r h-screen" />}>
                <Sidebar />
            </Suspense>
            <main className="flex-1 ml-[280px] p-8">
                <div className="max-w-[1600px] mx-auto">
                    <Suspense fallback={<div className="h-20 mb-8" />}>
                        <DashboardTopBar />
                    </Suspense>
                    {children}
                </div>
            </main>
        </div>
    );
}
