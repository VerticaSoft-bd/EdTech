import React from 'react';

interface AttendanceProps {
    present: number;
    total: number;
    limit: number;
}

const AttendanceChart: React.FC<AttendanceProps> = ({ present, total, limit }) => {
    const percentage = Math.min(100, (present / limit) * 100);
    const isNearLimit = percentage > 80;

    return (
        <div className="bg-white p-6 rounded-[32px] shadow-sm flex flex-col h-full rounded-[32px] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#1A1D1F] flex items-center gap-2">
                    Attendance
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isNearLimit ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {present}/{limit} Classes
                    </span>
                </h3>
                <select className="bg-gray-50 border-none text-xs font-bold text-gray-500 rounded-lg px-2 py-1 outline-none">
                    <option>This Batch</option>
                </select>
            </div>

            <div className="flex-1 flex items-center justify-center relative">
                {/* Simple Circular Progress - utilizing SVG for cleaner look than complex libraries */}
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="#F0F2F4"
                            strokeWidth="12"
                            fill="none"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke={isNearLimit ? "#FF4C4C" : "#4BD37B"}
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray="440"
                            strokeDashoffset={440 - (440 * percentage) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-[#1A1D1F]">{present}</span>
                        <span className="text-xs text-gray-400 font-medium">Attended</span>
                    </div>
                </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
                {limit - present} classes remaining before lock check.
            </p>
        </div>
    );
};

export default AttendanceChart;
