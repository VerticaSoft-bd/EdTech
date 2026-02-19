import React from 'react';

const alerts = [
    {
        id: 1,
        student: "Cameron Williamson",
        issue: "Payment Overdue (2 months)",
        status: "Locked",
    },
    {
        id: 2,
        student: "Robert Fox",
        issue: "Attendance < 50%",
        status: "Warning",
    },
    {
        id: 3,
        student: "Eleanor Pena",
        issue: "Failed 3 Assessments",
        status: "Critical",
    }
];

const CriticalAlerts: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex-1">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#1A1D1F] flex items-center gap-2">
                    Critical Alerts
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                </h3>
            </div>

            <div className="space-y-3">
                {alerts.map(alert => (
                    <div key={alert.id} className="p-3 bg-red-50 rounded-2xl border border-red-100 flex items-start justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-[#1A1D1F]">{alert.student}</h4>
                            <p className="text-[11px] text-red-500 font-medium mt-0.5">{alert.issue}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-lg text-[10px] font-bold">
                            {alert.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CriticalAlerts;
