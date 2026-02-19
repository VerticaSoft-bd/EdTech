import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, icon, color }) => {
    return (
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-[#1A1D1F] mb-2">{value}</h3>

                <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${isPositive ? 'text-[#4BD37B]' : 'text-[#FF4C4C]'} flex items-center`}>
                        {isPositive ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                        ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        )}
                        {change}
                    </span>
                    <span className="text-[10px] text-gray-400">vs last month</span>
                </div>
            </div>

            <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center ${color} text-white shadow-lg shadow-${color.replace('bg-', '')}/30`}>
                {icon}
            </div>
        </div>
    );
};

export default StatCard;
