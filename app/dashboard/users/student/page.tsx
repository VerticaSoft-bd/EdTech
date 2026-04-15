"use client";
import { useState, useEffect, useCallback } from "react";
import CreateStudentModal from "@/app/components/CreateStudentModal";
import UsersTable from "@/app/components/UsersTable";

export default function StudentUsersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/users?role=student");
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
        if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

        try {
            const res = await fetch(`/api/users/${user._id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                fetchUsers();
            } else {
                alert(data.message || "Failed to delete user");
            }
        } catch (error) {
            console.error("Delete user error", error);
            alert("An error occurred while deleting user");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-end gap-3">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-colors flex items-center gap-2"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Student
                </button>
            </div>

            <UsersTable 
                users={users} 
                loading={loading} 
                role="student" 
                onDelete={handleDelete}
            />

            <CreateStudentModal
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
