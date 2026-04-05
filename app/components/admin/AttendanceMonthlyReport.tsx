"use client";

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Loader2, Download, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
    courseName: string;
    students: any[];
}

export default function AttendanceMonthlyReport({ courseName, students }: Props) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState<any[]>([]);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    useEffect(() => {
        if (courseName) {
            fetchMonthlyData();
        }
    }, [courseName, currentMonth]);

    const fetchMonthlyData = async () => {
        setLoading(true);
        try {
            const startDate = monthStart.toISOString();
            const endDate = monthEnd.toISOString();
            const res = await fetch(`/api/admin/attendance/history?courseName=${encodeURIComponent(courseName)}&startDate=${startDate}&endDate=${endDate}`);
            const data = await res.json();
            if (data.success) {
                setAttendanceData(data.data);
            }
        } catch (error) {
            toast.error('Failed to fetch monthly report');
        } finally {
            // Smaller delay for smooth UI
            setTimeout(() => setLoading(false), 500);
        }
    };

    const getRecord = (studentId: string, email: string, date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return attendanceData.find(d => 
            (d.student?._id === studentId || d.student === studentId || d.studentEmail === email) && 
            format(new Date(d.date), 'yyyy-MM-dd') === dateStr
        );
    };

    const exportToCSV = () => {
        if (!students.length) return;

        let csv = 'Student Name,Email,' + daysInMonth.map(d => format(d, 'dd MMM')).join(',') + '\n';
        
        students.forEach(s => {
            csv += `"${s.name}","${s.email}",`;
            csv += daysInMonth.map(d => {
                const record = getRecord(s.studentId, s.email, d);
                return record?.status || '-';
            }).join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `Attendance_${courseName}_${format(currentMonth, 'MMM_yyyy')}.csv`);
        a.click();
    };

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentMonth(newDate);
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => changeMonth(-1)}
                        className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all shadow-sm active:scale-95"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-xl font-black text-gray-900 min-w-[150px] text-center tracking-tight">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <button 
                        onClick={() => changeMonth(1)}
                        className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all shadow-sm active:scale-95"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={fetchMonthlyData}
                        disabled={loading}
                        className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-[#6C5DD3] hover:border-[#6C5DD3] transition-all shadow-sm active:scale-95 disabled:opacity-50"
                        title="Refresh Report"
                    >
                        <Loader2 className={loading ? 'animate-spin' : ''} size={20} />
                    </button>
                    <button 
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-gray-200 hover:bg-gray-800 transition-all active:scale-[0.98]"
                    >
                        <FileSpreadsheet size={16} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-white border-b border-gray-50">
                            <th className="sticky left-0 z-20 bg-white p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 border-r border-gray-50 min-w-[180px]">
                                Student Details
                            </th>
                            {daysInMonth.map(day => (
                                <th key={day.toString()} className={`p-4 text-center min-w-[45px] border-r border-gray-50/50 ${[0, 6].includes(day.getDay()) ? 'bg-red-50/30' : ''}`}>
                                    <span className="block text-[10px] font-black text-gray-400 uppercase leading-none mb-1">
                                        {format(day, 'EEE')}
                                    </span>
                                    <span className={`text-sm font-bold ${[0, 6].includes(day.getDay()) ? 'text-red-400' : 'text-gray-900'}`}>
                                        {format(day, 'dd')}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="relative">
                        {loading && (
                            <tr className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-50 flex items-center justify-center">
                                <td colSpan={daysInMonth.length + 1} className="p-20 text-center">
                                    <Loader2 className="animate-spin text-[#6C5DD3] mx-auto" size={32} />
                                    <p className="text-xs font-bold text-gray-400 mt-4 tracking-widest uppercase">Fetching Records...</p>
                                </td>
                            </tr>
                        )}
                        
                        {students.map((student, idx) => (
                            <tr key={student.studentId} className={`border-b border-gray-50/50 hover:bg-gray-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/10'}`}>
                                <td className="sticky left-0 z-10 bg-inherit p-4 border-r border-gray-50 font-medium whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900">{student.name}</span>
                                        <span className="text-[10px] text-gray-400 truncate max-w-[150px] font-medium">{student.email}</span>
                                    </div>
                                </td>
                                {daysInMonth.map(day => {
                                    const record = getRecord(student.studentId, student.email, day);
                                    const status = record?.status;
                                    let colorClass = "bg-gray-50 text-gray-200 border-gray-100";
                                    let label = "";
                                    
                                    // Fallback to updatedAt for older records
                                    const timeSource = record?.attendedAt || record?.updatedAt || record?.createdAt;
                                    const timeStr = timeSource ? format(new Date(timeSource), 'hh:mm a') : '';

                                    if (status === 'Present') {
                                        colorClass = "bg-green-100 text-green-600 border-green-200 shadow-sm shadow-green-100";
                                        label = "P";
                                    } else if (status === 'Absent') {
                                        colorClass = "bg-red-100 text-red-600 border-red-200 shadow-sm shadow-red-100";
                                        label = "A";
                                    } else if (status === 'Late') {
                                        colorClass = "bg-amber-100 text-amber-600 border-amber-200 shadow-sm shadow-amber-100";
                                        label = "L";
                                    }

                                    return (
                                        <td key={day.toString()} className="p-2 text-center border-r border-gray-50/30 relative">
                                            <div className="flex flex-col items-center gap-1 group/item">
                                                <div 
                                                    className={`w-8 h-8 rounded-[10px] flex items-center justify-center mx-auto text-[10px] font-black border transition-all hover:scale-110 cursor-default ${colorClass}`}
                                                >
                                                    {label || "•"}
                                                </div>
                                                
                                                {/* Premium Floating Tooltip */}
                                                {status && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover/item:opacity-100 transition-all duration-200 translate-y-2 group-hover/item:translate-y-0">
                                                        <div className="bg-[#1A1D1F] text-white p-3 rounded-2xl shadow-2xl shadow-black/20 border border-white/10 min-w-[120px] backdrop-blur-md">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Marked at</span>
                                                                <span className="text-lg font-black tracking-tight text-white whitespace-nowrap">
                                                                    {timeStr || '--:--'}
                                                                </span>
                                                                {record?.markedBy?.name && (
                                                                    <div className="mt-1 pt-1 border-t border-white/5 w-full text-center">
                                                                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter block">By {record.markedBy.name}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {/* Tooltip Arrow */}
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#1A1D1F]"></div>
                                                        </div>
                                                    </div>
                                                )}

                                                {timeStr && (
                                                    <span className="text-[7px] font-bold text-gray-300 transition-colors leading-none tracking-tighter">
                                                        {timeStr.split(' ')[0]}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Footer Legend */}
            <div className="p-6 bg-gray-50/50 border-t border-gray-50 flex flex-wrap gap-6 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-green-100 border border-green-200 shadow-xs"></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Present</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-red-100 border border-red-200 shadow-xs"></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-amber-100 border border-amber-200 shadow-xs"></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Late</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-gray-50 border border-gray-100 shadow-xs"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Record</span>
                </div>
            </div>
        </div>
    );
}
