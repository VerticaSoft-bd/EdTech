"use client";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: string;
}

interface UsersTableProps {
    users: User[];
    loading: boolean;
    role: string;
    onEdit?: (user: User) => void;
}

export default function UsersTable({ users, loading, role, onEdit }: UsersTableProps) {
    if (loading) {
        return (
            <div className="bg-white rounded-[24px] border border-gray-100 p-12 text-center shadow-sm">
                <div className="w-16 h-16 border-4 border-[#6C5DD3]/20 border-t-[#6C5DD3] rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-bold text-[#1A1D1F] mb-2">Loading Users...</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">Fetching the latest database records.</p>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="bg-white rounded-[24px] border border-gray-100 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-[#1A1D1F] mb-2">No {role}s Found</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">There are currently no users assigned to the "{role}" role. Add a new user to see them listed here.</p>
            </div>
        );
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined Date</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C5DD3]/20 to-[#6C5DD3]/10 flex flex-col items-center justify-center text-[#6C5DD3] font-bold shadow-inner">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="font-semibold text-[#1A1D1F]">{user.name}</div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-gray-500 text-sm">
                                    {user.email}
                                </td>
                                <td className="py-4 px-6">
                                    <span className="px-3 py-1 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-lg text-xs font-bold capitalize">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-gray-500 text-sm">
                                    {formatDate(user.createdAt)}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button 
                                        onClick={() => onEdit && onEdit(user)}
                                        className="p-2 text-gray-400 hover:text-[#6C5DD3] transition-colors rounded-xl hover:bg-[#6C5DD3]/10">
                                        <svg width="18" height="18" viewBox="0 0  24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
