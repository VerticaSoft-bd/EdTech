"use client";
import React, { useState } from 'react';

interface ChartData {
    date: string;
    fullDate?: string;
    count: number;
}

interface WebRequestChartProps {
    data: ChartData[];
    onMonthChange?: (month: number, year: number) => void;
}

const WebRequestChart: React.FC<WebRequestChartProps> = ({ data = [], onMonthChange }) => {
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    const maxCount = data.length > 0 ? Math.max(...data.map(d => d.count)) : 0;

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = parseInt(e.target.value, 10);
        setSelectedMonth(val);
        if (onMonthChange) onMonthChange(val, selectedYear);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = parseInt(e.target.value, 10);
        setSelectedYear(val);
        if (onMonthChange) onMonthChange(selectedMonth, val);
    };

    const months = [
        { val: 1, label: 'January' }, { val: 2, label: 'February' }, { val: 3, label: 'March' },
        { val: 4, label: 'April' }, { val: 5, label: 'May' }, { val: 6, label: 'June' },
        { val: 7, label: 'July' }, { val: 8, label: 'August' }, { val: 9, label: 'September' },
        { val: 10, label: 'October' }, { val: 11, label: 'November' }, { val: 12, label: 'December' }
    ];

    const currentYear = today.getFullYear();
    const years = [currentYear, currentYear - 1, currentYear - 2];

    return (
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 w-full h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-[#1A1D1F]">Web Requests</h3>
                    <p className="text-xs text-gray-400">Traffic Trends ({months.find(m => m.val === selectedMonth)?.label} {selectedYear})</p>
                </div>
                <div className="flex items-center gap-2">
                    <select 
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="bg-[#F0F2F4] border-none text-xs font-bold text-[#1A1D1F] rounded-xl px-3 py-2 outline-none cursor-pointer"
                    >
                        {months.map(m => (
                            <option key={m.val} value={m.val}>{m.label}</option>
                        ))}
                    </select>
                    <select 
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="bg-[#F0F2F4] border-none text-xs font-bold text-[#1A1D1F] rounded-xl px-3 py-2 outline-none cursor-pointer"
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* CSS-only Bar Chart */}
            <div className="flex flex-1 items-end justify-between min-h-[220px] gap-1 px-1 overflow-visible">
                {data.length > 0 ? (
                    data.map((item, idx) => {
                        const heightPercent = maxCount === 0 ? 5 : Math.max(5, (item.count / maxCount) * 100);
                        const isHighest = item.count === maxCount && maxCount > 0;

                        return (
                            <div key={idx} className="flex flex-col items-center gap-2 group min-w-[8px] md:min-w-[12px] flex-1">
                                <div className="relative w-full h-[180px] flex items-end justify-center rounded-[4px] md:rounded-[8px] bg-[#F0F2F4]/50 overflow-visible group-hover:bg-[#F0F2F4] transition-colors">
                                    <div
                                        className={`w-[80%] rounded-t-[4px] transition-all duration-500 ease-out group-hover:scale-y-105 origin-bottom ${isHighest ? 'bg-[#FFAB7B]' : 'bg-[#FFAB7B]/40'}`}
                                        style={{ height: `${heightPercent}%` }}
                                    >
                                        {/* Tooltip on hover */}
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#1A1D1F] text-white text-[10px] font-bold px-2 py-1 rounded-lg transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-md">
                                            {item.fullDate || item.date}: {item.count} views
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-[8px] md:text-[10px] font-bold h-3 ${isHighest ? 'text-[#FFAB7B]' : 'text-gray-400'}`}>
                                    {/* Show label every 3 days or if it's the last day to prevent crowding */}
                                    {idx % 3 === 0 || idx === data.length - 1 ? item.date : ''}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <div className="w-full h-[180px] flex items-center justify-center">
                        <span className="text-sm text-gray-400 font-medium">No data available for this month</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebRequestChart;
