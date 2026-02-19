import React from 'react';

const RevenueChart: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 col-span-12 lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-[#1A1D1F]">Revenue Analytics</h3>
                    <p className="text-xs text-gray-400">Installment Collection Trends</p>
                </div>
                <div className="flex items-center gap-2">
                    <select className="bg-[#F0F2F4] border-none text-xs font-bold text-[#1A1D1F] rounded-xl px-3 py-2 outline-none cursor-pointer">
                        <option>This Year</option>
                        <option>Last Year</option>
                    </select>
                </div>
            </div>

            {/* CSS-only Bar Chart implementation for simplicity & performance */}
            <div className="flex items-end justify-between h-[220px] gap-2 px-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => {
                    // Mock data generation
                    const height = Math.floor(Math.random() * (100 - 30 + 1) + 30);
                    const isHighest = height > 90;

                    return (
                        <div key={idx} className="flex flex-col items-center gap-3 group w-full">
                            <div className="relative w-full h-[180px] flex items-end justify-center rounded-[12px] bg-[#F0F2F4]/50 overflow-hidden group-hover:bg-[#F0F2F4] transition-colors">
                                <div
                                    className={`w-[60%] rounded-t-[8px] transition-all duration-500 ease-out group-hover:scale-y-105 origin-bottom ${isHighest ? 'bg-[#6C5DD3]' : 'bg-[#6C5DD3]/40'}`}
                                    style={{ height: `${height}%` }}
                                >
                                    {/* Tooltip on hover */}
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#1A1D1F] text-white text-[10px] font-bold px-2 py-1 rounded-lg transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                        ${(height * 1250).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold ${isHighest ? 'text-[#6C5DD3]' : 'text-gray-400'}`}>{month}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RevenueChart;
