"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import CreateUserModal from "@/app/components/CreateUserModal";
import UsersTable from "@/app/components/UsersTable";
import { showToast } from "@/lib/toast";

export default function TeacherUsersPage() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/users?role=teacher");
            const data = await res.json();
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async (user: any) => {
        showToast.confirm(
            `Are you sure you want to delete ${user.name}? This will also remove their account and history.`,
            async () => {
                const loadingToast = showToast.loading("Deleting teacher...");
                try {
                    const res = await fetch(`/api/users/${user._id}`, {
                        method: "DELETE",
                    });
                    const data = await res.json();
                    showToast.dismiss(loadingToast);
                    
                    if (data.success) {
                        showToast.success("Teacher deleted successfully");
                        fetchUsers();
                    } else {
                        showToast.error(data.message || "Failed to delete teacher");
                    }
                } catch (error) {
                    showToast.dismiss(loadingToast);
                    console.error("Delete user error", error);
                    showToast.error("An error occurred while deleting teacher");
                }
            },
            { 
                title: "Delete Teacher", 
                confirmText: "Delete", 
                type: 'danger' 
            }
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-end gap-3">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-colors flex items-center gap-2"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Teacher
                </button>
            </div>

            <UsersTable 
                users={users} 
                loading={loading} 
                role="teacher" 
                onEdit={(user) => router.push(`/dashboard/users/teacher/${user._id}`)} 
                onDelete={handleDelete}
            />

            <CreateUserModal
                role="teacher"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    fetchUsers();
                }}
            />
        </div >
    );
}

