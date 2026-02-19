import React from 'react';

const jobs = [
    {
        id: 1,
        role: "Jr. UI/UX Designer",
        company: "TechFlow",
        type: "Remote",
        salary: "$40k - $60k",
        logo: "TF"
    },
    {
        id: 2,
        role: "React Frontend Dev",
        company: "Creative Studio",
        type: "Hybrid",
        salary: "$50k - $70k",
        logo: "CS"
    },
    {
        id: 3,
        role: "Flutter Developer",
        company: "AppMaster",
        type: "Remote",
        salary: "$45k - $65k",
        logo: "AM"
    }
];

const JobFeed: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-[32px] shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#1A1D1F] flex items-center gap-2">
                    Recommended Jobs
                    <span className="w-2 h-2 rounded-full bg-[#FF754C]"></span>
                </h3>
                <a href="#" className="text-sm font-bold text-[#6C5DD3] hover:underline">View All</a>
            </div>

            <div className="space-y-4">
                {jobs.map(job => (
                    <div key={job.id} className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                            {job.logo}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-[#1A1D1F]">{job.role}</h4>
                            <p className="text-[11px] text-gray-400">{job.company} • {job.type}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-[#1A1D1F] bg-[#F0F2F4] px-2 py-1 rounded-md group-hover:bg-white group-hover:shadow-sm">{job.salary}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="bg-gradient-to-r from-[#8E8AFF] to-[#6C5DD3] rounded-2xl p-4 flex items-center justify-between relative overflow-hidden group cursor-pointer">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="relative z-10 text-white">
                        <h4 className="font-bold text-sm">AI CV Builder</h4>
                        <p className="text-[10px] opacity-80">Generate a pro resume in seconds.</p>
                    </div>
                    <div className="relative z-10 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white/30 transition-all">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14" />
                            <path d="M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobFeed;
