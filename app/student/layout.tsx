import type { Metadata } from "next";
import StudentSidebar from "../components/StudentSidebar";

export const metadata: Metadata = {
    title: "Student Dashboard | Streva",
    description: "Futuristic EdTech Student Dashboard",
};

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#F4F4F4]">
            <StudentSidebar />
            <main className="flex-1 ml-[280px]">
                {/* Note: Top bar is integrated inside the page content in the student dashboard design, or we can add a common one here if needed. 
                 For now, keeping it clean to match the specific "Dashboard" design which had its own header structure. 
                 We might wrap children in a container if needed.
             */}
                {children}
            </main>
        </div>
    );
}
