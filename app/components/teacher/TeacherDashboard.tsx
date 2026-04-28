"use client";
import React, { useState, useEffect } from 'react';
import TeacherStats from './TeacherStats';
import TeacherQuickActions from './TeacherQuickActions';
import MyCoursesList from './MyCoursesList';
import CriticalAlerts from '../admin/CriticalAlerts';
import RecentAdmissions from '../admin/RecentAdmissions';

export default function TeacherDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Stats
                const statsRes = await fetch('/api/admin/stats');
                const statsData = await statsRes.json();
                
                // Fetch Courses
                const coursesRes = await fetch('/api/courses');
                const coursesData = await coursesRes.json();

                if (statsData.success) setStats(statsData.data);
                if (coursesData.success) setCourses(coursesData.data);

            } catch (error) {
                console.error('Failed to fetch teacher dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const teacherStats = {
        totalStudents: stats?.totalStudents || 0,
        studentChange: stats?.studentChange || '0%',
        totalEnrollments: stats?.totalEnrollments || 0,
        enrollmentChange: stats?.enrollmentChange || '0%',
        activeCourses: courses.length,
        pendingTasks: stats?.pendingPayments || 0,
    };

    return (
        <div className="space-y-6">
            <TeacherStats stats={teacherStats} isLoading={isLoading} />

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8">
                    <MyCoursesList courses={courses} isLoading={isLoading} />
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <TeacherQuickActions />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-6">
                    <RecentAdmissions />
                </div>
                <div className="col-span-12 lg:col-span-6">
                    <CriticalAlerts />
                </div>
            </div>
        </div>
    );
}
