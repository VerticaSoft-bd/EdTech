"use client";

import React, { useState, useEffect } from 'react';

interface Alert {
    id: string;
    student: string;
    issue: string;
    status: 'Locked' | 'Warning' | 'Critical';
    type: 'payment' | 'attendance' | 'progress';
}

const CriticalAlerts: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await fetch('/api/admin/alerts');
                const data = await res.json();
                if (data.success) {
                    setAlerts(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch alerts:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    const getStatusColor = (status: Alert['status']) => {
        switch (status) {
            case 'Locked':
                return 'bg-[#FFF0F0] text-[#D13438] ring-1 ring-[#FBDDDD]';
            case 'Warning':
                return 'bg-[#FFF4CE] text-[#794500] ring-1 ring-[#F8E391]';
            case 'Critical':
                return 'bg-[#FFF0F0] text-[#D13438] ring-1 ring-[#FBDDDD]';
            default:
                return 'bg-gray-100 text-gray-800 ring-1 ring-gray-200';
        }
    };

    const getTagLabelColor = (status: Alert['status']) => {
        switch (status) {
            case 'Locked': return 'bg-[#FBDDDD] text-[#D13438]';
            case 'Warning': return 'bg-[#F8E391] text-[#794500]';
            case 'Critical': return 'bg-[#FBDDDD] text-[#D13438]';
            default: return 'bg-gray-100 text-gray-600';
        }
    }

    return (
        <div className="bg-white p-7 rounded-[40px] shadow-sm border border-gray-100 flex-1 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-[#1A1D1F] flex items-center gap-3">
                    Critical Alerts
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4C4C] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF4C4C]"></span>
                    </span>
                </h3>
                {alerts.length > 0 && !isLoading && (
                    <span className="text-[12px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                        {alerts.length} Issues Found
                    </span>
                )}
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="p-5 bg-gray-50 rounded-[28px] animate-pulse flex justify-between items-center">
                            <div className="space-y-2 flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded-lg w-16"></div>
                        </div>
                    ))
                ) : alerts.length > 0 ? (
                    alerts.map(alert => (
                        <div 
                            key={alert.id} 
                            className={`p-5 rounded-[28px] flex items-start justify-between group transition-all hover:scale-[1.01] ${getStatusColor(alert.status)}`}
                        >
                            <div className="space-y-1">
                                <h4 className="text-[15px] font-black leading-tight tracking-tight">{alert.student}</h4>
                                <p className="text-[12px] font-bold opacity-80">{alert.issue}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/40 backdrop-blur-sm self-center`}>
                                {alert.status}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="py-16 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-[32px] border border-dashed border-gray-100">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4BD37B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <p className="text-sm font-bold text-gray-400">All sets! No critical alerts found.</p>
                    </div>
                )}
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E8E8E8;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D0D0D0;
                }
            `}</style>
        </div>
    );
};

export default CriticalAlerts;
