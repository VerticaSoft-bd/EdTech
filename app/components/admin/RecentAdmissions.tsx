import React from 'react';

const students = [
    {
        id: 1,
        name: "Cody Fisher",
        course: "UI/UX Design",
        date: "Oct 24, 2026",
        status: "Pending",
        avatar: "https://i.pravatar.cc/150?u=1",
    },
    {
        id: 2,
        name: "Esther Howard",
        course: "Full Stack Dev",
        date: "Oct 23, 2026",
        status: "Approved",
        avatar: "https://i.pravatar.cc/150?u=2",
    },
    {
        id: 3,
        name: "Jenny Wilson",
        course: "Python AI",
        date: "Oct 21, 2026",
        status: "Rejected",
        avatar: "https://i.pravatar.cc/150?u=3",
    },
    {
        id: 4,
        name: "Guy Hawkins",
        course: "Flutter Mobile",
        date: "Oct 20, 2026",
        status: "Approved",
        avatar: "https://i.pravatar.cc/150?u=4",
    },
];

const RecentAdmissions: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 col-span-12 lg:col-span-4 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#1A1D1F]">Recent Admissions</h3>
                <a href="#" className="text-xs font-bold text-[#6C5DD3] hover:underline">View All</a>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
                {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                            <div>
                                <h4 className="text-sm font-bold text-[#1A1D1F]">{student.name}</h4>
                                <p className="text-[10px] text-gray-400">{student.course}</p>
                            </div>
                        </div>

                        <div>
                            {student.status === 'Pending' && (
                                <div className="flex gap-2">
                                    <button className="w-7 h-7 rounded-full bg-[#4BD37B]/10 text-[#4BD37B] flex items-center justify-center hover:bg-[#4BD37B] hover:text-white transition-colors">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </button>
                                    <button className="w-7 h-7 rounded-full bg-[#FF4C4C]/10 text-[#FF4C4C] flex items-center justify-center hover:bg-[#FF4C4C] hover:text-white transition-colors">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                            )}
                            {student.status === 'Approved' && (
                                <span className="px-2.5 py-1 rounded-lg bg-[#4BD37B]/10 text-[#4BD37B] text-[10px] font-bold">Approved</span>
                            )}
                            {student.status === 'Rejected' && (
                                <span className="px-2.5 py-1 rounded-lg bg-[#FF4C4C]/10 text-[#FF4C4C] text-[10px] font-bold">Rejected</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentAdmissions;
