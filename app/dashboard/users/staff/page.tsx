"use client";
import { useState, useEffect, useCallback } from "react";
import CreateUserModal from "@/app/components/CreateUserModal";
import UsersTable from "@/app/components/UsersTable";
import { showToast } from "@/lib/toast";

export default function StaffUsersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/users?role=staff");
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
            `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
            async () => {
                const loadingToast = showToast.loading("Deleting staff...");
                try {
                    const res = await fetch(`/api/users/${user._id}`, {
                        method: "DELETE",
                    });
                    const data = await res.json();
                    showToast.dismiss(loadingToast);

                    if (data.success) {
                        showToast.success("Staff member deleted successfully");
                        fetchUsers();
                    } else {
                        showToast.error(data.message || "Failed to delete user");
                    }
                } catch (error) {
                    showToast.dismiss(loadingToast);
                    console.error("Delete user error", error);
                    showToast.error("An error occurred while deleting user");
                }
            },
            {
                title: "Delete Staff",
                confirmText: "Delete",
                type: 'danger'
            }
        );
    };

    if (currentUser && currentUser.role !== 'admin') {
        return (
            <div className="bg-white rounded-[24px] border border-red-100 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                </div>
                <h3 className="text-lg font-bold text-[#1A1D1F] mb-2">Access Denied</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">You do not have permission to view or manage staff users. This area is restricted to administrators.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-end gap-3">
                <button
                    onClick={() => {
                        setEditingUser(null);
                        setIsModalOpen(true);
                    }}
                    className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-colors flex items-center gap-2"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Staff
                </button>
            </div>

            <UsersTable 
                users={users} 
                loading={loading} 
                role="staff" 
                onEdit={(user) => {
                    setEditingUser(user);
                    setIsModalOpen(true);
                }} 
                onDelete={handleDelete}
            />

            <CreateUserModal
                role="staff"
                isOpen={isModalOpen}
                editingUser={editingUser}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingUser(null);
                }}
                onSuccess={() => {
                    setIsModalOpen(false);
                    fetchUsers();
                }}
            />
        </div >
    );
}

