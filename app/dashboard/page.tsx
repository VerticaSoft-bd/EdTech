import React from 'react';
import StatCard from '../components/admin/StatCard';
import RevenueChart from '../components/admin/RevenueChart';
import RecentAdmissions from '../components/admin/RecentAdmissions';
import QuickActions from '../components/admin/QuickActions';
import CriticalAlerts from '../components/admin/CriticalAlerts';

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            {/* Top Row: Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value="$1.2M"
                    change="+12.5%"
                    isPositive={true}
                    color="bg-[#6C5DD3]"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
                />
                <StatCard
                    title="Active Students"
                    value="3,450"
                    change="+5.2%"
                    isPositive={true}
                    color="bg-[#4BD37B]"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                />
                <StatCard
                    title="Engagement Rate"
                    value="88%"
                    change="-2.1%"
                    isPositive={false}
                    color="bg-[#FFAB7B]"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>}
                />
                <StatCard
                    title="System Health"
                    value="99.9%"
                    change="Stable"
                    isPositive={true}
                    color="bg-[#FF4C4C]"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>}
                />
            </div>

            {/* Middle Row: Revenue Chart & Recent Admissions */}
            <div className="grid grid-cols-12 gap-6">
                <RevenueChart />
                <RecentAdmissions />
            </div>

            {/* Bottom Row: Quick Actions & Critical Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <QuickActions />
                <CriticalAlerts />
            </div>
        </div>
    );
}
