"use client";
import React, { useState, useEffect } from 'react';
import StatCard from '../components/admin/StatCard';
import RevenueChart from '../components/admin/RevenueChart';
import RecentAdmissions from '../components/admin/RecentAdmissions';
import QuickActions from '../components/admin/QuickActions';
import CriticalAlerts from '../components/admin/CriticalAlerts';
import WebRequestChart from '../components/admin/WebRequestChart';

interface DashboardStats {
    totalRevenue: number;
    revenueChange: string;
    totalStudents: number;
    studentChange: string;
    totalEnrollments: number;
    enrollmentChange: string;
    pendingPayments: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [webStats, setWebStats] = useState<{ today: number; percentageChange: string; allTimeTotal: number, chartData: { date: string; fullDate?: string; count: number }[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<{ role: string } | null>(null);

    const fetchWebStats = async (month?: number, year?: number) => {
        try {
            let url = '/api/admin/analytics/requests';
            if (month && year) {
                url += `?month=${month}&year=${year}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setWebStats(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch web stats:', error);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user");
            }
        }

        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
        // Since only admins can see web stats, we don't strictly *need* to gate the fetch,
        // but we assume it's best to fetch it simultaneously. The API enforces role anyway.
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        if (parsedUser?.role === 'admin') {
            fetchWebStats();
        }
    }, []);

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) return `৳${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `৳${(amount / 1000).toFixed(1)}K`;
        return `৳${amount}`;
    };

    const isPositiveChange = (change: string) => {
        return change.startsWith('+') && change !== '+0%';
    };

    const role = user?.role || 'admin';
    const isStaff = role === 'staff';

    return (
        <div className="space-y-6">
            {/* Top Row: Key Metrics */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${isStaff ? 'lg:grid-cols-2' : 'lg:grid-cols-4'} gap-6`}>
                {!isStaff && (
                    <StatCard
                        title="Total Revenue"
                        value={isLoading ? '—' : formatCurrency(stats?.totalRevenue || 0)}
                        change={isLoading ? '...' : stats?.revenueChange || '0%'}
                        isPositive={isPositiveChange(stats?.revenueChange || '0%')}
                        color="bg-[#6C5DD3]"
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
                    />
                )}
                <StatCard
                    title="Active Students"
                    value={isLoading ? '—' : (stats?.totalStudents || 0).toLocaleString()}
                    change={isLoading ? '...' : stats?.studentChange || '0%'}
                    isPositive={isPositiveChange(stats?.studentChange || '0%')}
                    color="bg-[#4BD37B]"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                />
                <StatCard
                    title="Total Enrollments"
                    value={isLoading ? '—' : (stats?.totalEnrollments || 0).toLocaleString()}
                    change={isLoading ? '...' : stats?.enrollmentChange || '0%'}
                    isPositive={isPositiveChange(stats?.enrollmentChange || '0%')}
                    color="bg-[#FFAB7B]"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>}
                />
                {!isStaff && (
                    <StatCard
                        title="Pending Payments"
                        value={isLoading ? '—' : (stats?.pendingPayments || 0).toLocaleString()}
                        change="Needs attention"
                        isPositive={false}
                        color="bg-[#FF4C4C]"
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>}
                    />
                )}
            </div>

            {/* Middle Row: Revenue Chart & Recent Enrollments */}
            <div className="grid grid-cols-12 gap-6">
                {!isStaff && <RevenueChart />}
                <div className={`${isStaff ? 'col-span-12' : 'col-span-12 lg:col-span-4'}`}>
                    <RecentAdmissions />
                </div>
            </div>

            {/* Web Request Analytics Section */}
            {!isStaff && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 flex flex-col gap-6">
                        <StatCard
                            title="All-Time Requests"
                            value={webStats === null ? '—' : webStats.allTimeTotal.toLocaleString()}
                            change="Total to date"
                            isPositive={true}
                            color="bg-[#4BD37B]"
                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>}
                        />
                        <StatCard
                            title="Daily Web Requests"
                            value={webStats === null ? '—' : webStats.today.toLocaleString()}
                            change={webStats === null ? '...' : webStats.percentageChange}
                            isPositive={isPositiveChange(webStats?.percentageChange || '0%')}
                            color="bg-[#33C3FF]"
                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <WebRequestChart data={webStats?.chartData || []} onMonthChange={(m, y) => {
                            const parsedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
                            if (parsedUser?.role === 'admin') fetchWebStats(m, y);
                        }} />
                    </div>
                </div>
            )}

            {/* Bottom Row: Quick Actions & Critical Alerts */}
            {!isStaff && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <QuickActions />
                    <CriticalAlerts />
                </div>
            )}
        </div>
    );
}
