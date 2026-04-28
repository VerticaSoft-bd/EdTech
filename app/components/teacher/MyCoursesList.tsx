"use client";
import React from 'react';
import Link from 'next/link';

interface Course {
    _id: string;
    title: string;
    slug: string;
    thumbnail?: string;
    totalStudents: number;
    courseMode: string;
}

interface MyCoursesListProps {
    courses: Course[];
    isLoading: boolean;
}

const MyCoursesList: React.FC<MyCoursesListProps> = ({ courses, isLoading }) => {
    return (
        <div className="bg-white p-7 rounded-[40px] shadow-sm border border-gray-100 flex-1 hover:shadow-lg transition-shadow h-full">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-[#1A1D1F]">My Assigned Courses</h3>
                <Link href="/dashboard/courses" className="text-[12px] font-bold text-[#6C5DD3] bg-[#6C5DD3]/5 px-4 py-2 rounded-full hover:bg-[#6C5DD3] hover:text-white transition-all">
                    Manage All
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-50 rounded-[28px] animate-pulse"></div>
                    ))
                ) : courses.length > 0 ? (
                    courses.map(course => (
                        <Link 
                            key={course._id} 
                            href={`/dashboard/courses`}
                            className="p-5 rounded-[28px] border border-gray-50 bg-[#F8FAFC]/50 hover:bg-white hover:shadow-xl hover:shadow-[#6C5DD3]/5 transition-all group border-dashed"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-[#6C5DD3]/10 text-[#6C5DD3]">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[15px] font-black text-[#1A1D1F] truncate group-hover:text-[#6C5DD3] transition-colors">{course.title}</h4>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md uppercase tracking-wider">{course.courseMode}</span>
                                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                                            {course.totalStudents} Students
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-2 py-12 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-[32px] border border-dashed border-gray-100">
                        <p className="text-sm font-bold text-gray-400">No courses assigned yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCoursesList;
