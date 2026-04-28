"use client";
import React from 'react';
import StatCard from '../admin/StatCard';

interface TeacherStatsProps {
    stats: {
        totalStudents: number;
        studentChange: string;
        totalEnrollments: number;
        enrollmentChange: string;
        activeCourses: number;
        pendingTasks: number;
    };
    isLoading: boolean;
}

const TeacherStats: React.FC<TeacherStatsProps> = ({ stats, isLoading }) => {
    const isPositiveChange = (change: string) => {
        return change.startsWith('+') && change !== '+0%';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="My Total Students"
                value={isLoading ? '—' : stats.totalStudents.toLocaleString()}
                change={isLoading ? '...' : stats.studentChange}
                isPositive={isPositiveChange(stats.studentChange)}
                color="bg-[#4BD37B]"
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
            />
            <StatCard
                title="Active Enrollments"
                value={isLoading ? '—' : stats.totalEnrollments.toLocaleString()}
                change={isLoading ? '...' : stats.enrollmentChange}
                isPositive={isPositiveChange(stats.enrollmentChange)}
                color="bg-[#FFAB7B]"
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>}
            />
            <StatCard
                title="Active Courses"
                value={isLoading ? '—' : stats.activeCourses.toString()}
                change="Assigned courses"
                isPositive={true}
                color="bg-[#6C5DD3]"
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>}
            />
            <StatCard
                title="Tasks to Review"
                value={isLoading ? '—' : stats.pendingTasks.toString()}
                change="Pending review"
                isPositive={false}
                color="bg-[#FFAA47]"
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14l2 2 4-4"></path></svg>}
            />
        </div>
    );
};

export default TeacherStats;
