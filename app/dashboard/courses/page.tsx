"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ITEMS_PER_PAGE = 6;

// Function to deterministically map an index to a gradient for dynamic courses
const getGradientProps = (index: number) => {
    const gradients = [
        "from-[#8E8AFF] to-[#B4B1FF]", // Purple
        "from-[#FFAB7B] to-[#FFCF9D]", // Orange
        "from-[#FF9AD5] to-[#FFC2E8]", // Pink
        "from-[#4BD37B] to-[#80F2AA]", // Green
        "from-[#6C5DD3] to-[#8E8AFF]", // Dark Purple
    ];
    return gradients[index % gradients.length];
};

export default function CoursesPage() {
    const [filterType, setFilterType] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/courses');
                if (!res.ok) throw new Error("Failed to fetch courses");
                const data = await res.json();
                if (data.success && data.data) {
                    setCourses(data.data);
                }
            } catch (err: any) {
                setError(err.message || "An error occurred fetching courses.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesFilter = filterType === 'All' ||
            (filterType === 'Online' && course.courseMode === 'Online Class') ||
            (filterType === 'Offline' && course.courseMode === 'Offline Class') ||
            (course.courseMode === filterType);

        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.category.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedCourses = filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterType, searchQuery]);

    const handleDelete = async (courseId: string, courseTitle: string) => {
        if (!window.confirm(`Are you sure you want to delete the course "${courseTitle}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/courses/${courseId}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (res.ok && data.success) {
                // Remove the deleted course from state
                setCourses(courses.filter(c => c._id !== courseId));
            } else {
                setError(data.message || 'Failed to delete course');
            }
        } catch (err: any) {
            setError('An error occurred while deleting the course.');
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-end gap-3">
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
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 w-[240px]"
                    />
                </div>
                <Link href="/dashboard/courses/add" className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-colors flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Create New Course
                </Link>
            </div>

            {
                error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                        {error}
                    </div>
                )
            }

            {/* Course Grid */}
            {
                loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C5DD3]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {paginatedCourses.map((course, index) => {
                            const gradientColor = getGradientProps(index);
                            const displayType = course.courseMode === 'Online Class' ? 'Online' : course.courseMode === 'Offline Class' ? 'Offline' : course.courseMode;
                            const instructors = course.assignedTeachers && course.assignedTeachers.length > 0
                                ? course.assignedTeachers.map((t: any) => t.name).join(', ')
                                : 'No Instructor Assigned';

                            return (
                                <div key={course._id} className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 group hover:shadow-md transition-all cursor-pointer">
                                    {/* Thumbnail Area */}
                                    <div className={`h-[160px] rounded-[20px] bg-gradient-to-br ${gradientColor} relative p-5 flex flex-col justify-between overflow-hidden mb-4`}>
                                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 z-0"></div>

                                        {course.thumbnail && (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                                            />
                                        )}

                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="flex gap-2">
                                                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-bold border border-white/20 shadow-sm">
                                                    {course.category}
                                                </span>
                                                <span className={`px-2.5 py-1 backdrop-blur-md rounded-lg text-white text-[10px] font-bold border border-white/20 shadow-sm ${displayType === 'Online' ? 'bg-[#8E8AFF]/40' : 'bg-[#FF754C]/40'}`}>
                                                    {displayType}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/courses/${course.slug || course._id}`}
                                                    className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-[#6C5DD3] transition-colors shadow-sm"
                                                    title="View Course"
                                                    target="_blank"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                                </Link>
                                                <Link
                                                    href={`/dashboard/courses/edit/${course._id}`}
                                                    className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-[#6C5DD3] transition-colors shadow-sm"
                                                    title="Edit Course"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </Link>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault(); // Prevent accidental navigation if nested
                                                        handleDelete(course._id, course.title);
                                                    }}
                                                    className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                                                    title="Delete Course"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-1 text-white/90 text-[11px] font-medium mb-1 drop-shadow-md">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                {course.duration || "N/A"} • {course.totalLectures || 0} Lessons
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="px-2 pb-2">
                                        <h3 className="font-bold text-[#1A1D1F] text-lg leading-tight mb-2 group-hover:text-[#6C5DD3] transition-colors line-clamp-2 min-h-[50px]">{course.title}</h3>

                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                {course.assignedTeachers && course.assignedTeachers.length > 0 ? (
                                                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.assignedTeachers[0].name)}&background=random`} alt="Instructor" />
                                                ) : (
                                                    "NA"
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500 font-medium truncate max-w-[200px]">by {instructors}</span>
                                        </div>

                                        <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-bold text-[#1A1D1F]">
                                                    {course.isFree ? "Free" : `৳${course.regularFee || 0}`}
                                                </span>
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
                            );
                        })}

                        {/* Add New Placeholder Card */}
                        <div className="bg-gray-50 rounded-[24px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 cursor-pointer hover:border-[#6C5DD3] hover:bg-[#6C5DD3]/5 transition-all min-h-[350px] group">
                            <Link href="/dashboard/courses/add" className="flex flex-col items-center justify-center w-full h-full">
                                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-[#6C5DD3] group-hover:scale-110 transition-all mb-4">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">Add New Course</h3>
                                <p className="text-xs text-gray-500 text-center">Create a new course and start earning</p>
                            </Link>
                        </div>
                    </div>
                )
            }

            {/* Pagination Controls */}
            {
                totalPages > 1 && !loading && (
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
                )
            }
        </div >
    );
}
