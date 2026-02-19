"use client";
import React from 'react';
import Link from 'next/link';

const courses = [
    {
        id: 1,
        title: "Mastering UI/UX Design",
        instructor: "Syed Roni",
        category: "Design",
        type: "Online",
        students: 120,
        rating: 4.8,
        price: "$89.00",
        status: "Active",
        thumbnail: "https://grainy-gradients.vercel.app/noise.svg", // Using a placeholder pattern
        color: "from-[#8E8AFF] to-[#B4B1FF]",
        lessons: 24,
        duration: "12h 30m"
    },
    {
        id: 2,
        title: "Full Stack Development with Next.js",
        instructor: "Cody Fisher",
        category: "Development",
        type: "Offline",
        students: 85,
        rating: 4.9,
        price: "$120.00",
        status: "Active",
        thumbnail: "https://grainy-gradients.vercel.app/noise.svg",
        color: "from-[#FFAB7B] to-[#FFCF9D]",
        lessons: 45,
        duration: "28h 15m"
    },
    {
        id: 3,
        title: "Python for Data Science",
        instructor: "Jenny Wilson",
        category: "Data Science",
        type: "Online",
        students: 200,
        rating: 4.7,
        price: "$95.00",
        status: "Draft",
        thumbnail: "https://grainy-gradients.vercel.app/noise.svg",
        color: "from-[#FF9AD5] to-[#FFC2E8]",
        lessons: 18,
        duration: "10h 45m"
    },
    {
        id: 4,
        title: "Digital Marketing Masterclass",
        instructor: "Esther Howard",
        category: "Marketing",
        type: "Offline",
        students: 340,
        rating: 4.6,
        price: "$50.00",
        status: "Active",
        thumbnail: "https://grainy-gradients.vercel.app/noise.svg",
        color: "from-[#4BD37B] to-[#80F2AA]",
        lessons: 32,
        duration: "15h 20m"
    },
    {
        id: 5,
        title: "Flutter Mobile App Development",
        instructor: "Guy Hawkins",
        category: "Mobile Dev",
        type: "Online",
        students: 60,
        rating: 4.8,
        price: "$110.00",
        status: "Archived",
        thumbnail: "https://grainy-gradients.vercel.app/noise.svg",
        color: "from-[#6C5DD3] to-[#8E8AFF]",
        lessons: 50,
        duration: "30h 00m"
    },
    {
        id: 6,
        title: "Advanced React Patterns",
        instructor: "Cody Fisher",
        category: "Development",
        type: "Online",
        students: 150,
        rating: 4.9,
        price: "$95.00",
        status: "Active",
        thumbnail: "https://grainy-gradients.vercel.app/noise.svg",
        color: "from-[#FF9AD5] to-[#FFC2E8]",
        lessons: 28,
        duration: "14h 20m"
    },
    {
        id: 7,
        title: "Motion Design Fundamentals",
        instructor: "Syed Roni",
        category: "Design",
        type: "Offline",
        students: 95,
        rating: 4.7,
        price: "$75.00",
        status: "Active",
        thumbnail: "https://grainy-gradients.vercel.app/noise.svg",
        color: "from-[#4BD37B] to-[#80F2AA]",
        lessons: 35,
        duration: "18h 45m"
    },
    {
        id: 8,
        title: "Data Visualization with D3.js",
        instructor: "Jenny Wilson",
        category: "Data Science",
        type: "Online",
        students: 70,
        rating: 4.5,
        price: "$85.00",
        status: "Draft",
        thumbnail: "https://grainy-gradients.vercel.app/noise.svg",
        color: "from-[#8E8AFF] to-[#B4B1FF]",
        lessons: 22,
        duration: "11h 10m"
    },
    {
        id: 9,
        title: "SEO Strategy 2026",
        instructor: "Esther Howard",
        category: "Marketing",
        type: "Online",
        students: 210,
        rating: 4.8,
        price: "$60.00",
        status: "Active",
        thumbnail: "https://grainy-gradients.vercel.app/noise.svg",
        color: "from-[#FFAB7B] to-[#FFCF9D]",
        lessons: 15,
        duration: "8h 30m"
    }
];

const ITEMS_PER_PAGE = 6;

export default function CoursesPage() {
    const [filterType, setFilterType] = React.useState('All');
    const [currentPage, setCurrentPage] = React.useState(1);

    const filteredCourses = courses.filter(course => {
        if (filterType === 'All') return true;
        return course.type === filterType;
    });

    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedCourses = filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset to page 1 when filter changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filterType]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#1A1D1F]">Courses</h2>
                    <p className="text-sm text-gray-500">Manage your educational content and catalog.</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Course Type Filter */}
                    <div className="relative">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 cursor-pointer font-bold text-[#1A1D1F]"
                        >
                            <option value="All">All Types</option>
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                    </div>

                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                        <input type="text" placeholder="Search courses..." className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 w-[240px]" />
                    </div>
                    <Link href="/dashboard/courses/add" className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-colors flex items-center gap-2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Create New Course
                    </Link>
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {paginatedCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 group hover:shadow-md transition-all cursor-pointer">
                        {/* Thumbnail Area */}
                        <div className={`h-[160px] rounded-[20px] bg-gradient-to-br ${course.color} relative p-5 flex flex-col justify-between overflow-hidden mb-4`}>
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className="flex gap-2">
                                    <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-bold border border-white/20">
                                        {course.category}
                                    </span>
                                    <span className={`px-2.5 py-1 backdrop-blur-md rounded-lg text-white text-[10px] font-bold border border-white/20 ${course.type === 'Online' ? 'bg-[#8E8AFF]/40' : 'bg-[#FF754C]/40'}`}>
                                        {course.type}
                                    </span>
                                </div>
                                <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                </button>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-1 text-white/90 text-[11px] font-medium mb-1">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    {course.duration} • {course.lessons} Lessons
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-2 pb-2">
                            <h3 className="font-bold text-[#1A1D1F] text-lg leading-tight mb-2 group-hover:text-[#6C5DD3] transition-colors">{course.title}</h3>

                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/150?u=${course.instructor}`} alt={course.instructor} />
                                </div>
                                <span className="text-xs text-gray-500 font-medium">by {course.instructor}</span>
                            </div>

                            <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-[#1A1D1F]">{course.price}</span>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                        <span className="text-xs font-bold text-[#1A1D1F]">{course.rating}</span>
                                    </div>
                                </div>

                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${course.status === 'Active' ? 'bg-[#4BD37B]/10 text-[#4BD37B]' :
                                    course.status === 'Draft' ? 'bg-gray-100 text-gray-500' :
                                        'bg-[#FF4C4C]/10 text-[#FF4C4C]'
                                    }`}>
                                    {course.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Placeholder Card */}
                <div className="bg-gray-50 rounded-[24px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 cursor-pointer hover:border-[#6C5DD3] hover:bg-[#6C5DD3]/5 transition-all min-h-[350px] group">
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-[#6C5DD3] group-hover:scale-110 transition-all mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Add New Course</h3>
                    <p className="text-xs text-gray-500 text-center">Create a new course and start earning</p>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="p-6 bg-white rounded-[24px] border border-gray-100 flex items-center justify-between shadow-sm">
                    <p className="text-xs text-gray-500 font-medium">
                        Showing <span className="text-[#1A1D1F] font-bold">{filteredCourses.length > 0 ? startIndex + 1 : 0}</span> to <span className="text-[#1A1D1F] font-bold">{Math.min(startIndex + ITEMS_PER_PAGE, filteredCourses.length)}</span> of <span className="text-[#1A1D1F] font-bold">{filteredCourses.length}</span> courses
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-xl transition-all ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 hover:text-[#1A1D1F]'}`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                        </button>

                        {Array.from({ length: totalPages }).map((_, idx) => {
                            const page = idx + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${currentPage === page
                                        ? 'bg-[#6C5DD3] text-white shadow-lg shadow-[#6C5DD3]/20'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-[#1A1D1F]'
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-xl transition-all ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 hover:text-[#1A1D1F]'}`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
